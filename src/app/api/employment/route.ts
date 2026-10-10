import { createHash } from "node:crypto";
import {
  applicationEmail,
  validateApplication,
} from "../../../lib/employment-application";

export const runtime = "nodejs";
const failure =
  "We couldn’t submit your application right now. Your information is still here. Please try again.";
const reply = (body: object, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (
    (origin && origin !== new URL(request.url).origin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    return reply(
      { error: "Please submit the application from this website." },
      403,
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return reply({ error: "Please submit a valid application." }, 415);

  let raw: Record<string, unknown>;
  try {
    // Enforce a real body limit, including requests without Content-Length.
    const reader = request.body?.getReader();
    if (!reader)
      return reply({ error: "Please complete the application." }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32000) {
        await reader.cancel();
        return reply(
          {
            error:
              "Your application is too long. Please shorten your responses.",
          },
          413,
        );
      }
      chunks.push(value);
    }
    raw = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
      throw new Error("Invalid body");
  } catch {
    return reply({ error: "Please submit a valid application." }, 400);
  }

  // The honeypot is not a real application question. Never send detected spam.
  if (typeof raw.website !== "string" || raw.website.trim())
    return reply(
      {
        error:
          "We couldn’t accept this submission. Please reload the page and try again.",
      },
      400,
    );
  if (
    typeof raw.submissionId !== "string" ||
    !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(
      raw.submissionId,
    )
  )
    return reply({ error: "Please reload the page and try again." }, 400);
  const { data, errors } = validateApplication(raw);
  if (Object.keys(errors).length)
    return reply(
      { error: "Please check the highlighted fields.", errors },
      422,
    );

  // Server-only configuration. Never return provider responses or credentials.
  const key = process.env.RESEND_API_KEY;
  const to = process.env.JPO_APPLICATION_EMAIL;
  const from = process.env.JPO_APPLICATION_FROM_EMAIL;
  if (!key || !to || !from) return reply({ error: failure }, 503);
  const fingerprint = createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `employment/${raw.submissionId}/${fingerprint}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.fields.email,
        subject: `New JPO Employment Application — ${data.fields.fullName}`,
        text: applicationEmail(data),
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return reply({ error: failure }, 502);
    const result: unknown = await response.json();
    if (
      !result ||
      typeof result !== "object" ||
      !("id" in result) ||
      typeof result.id !== "string" ||
      !result.id
    )
      return reply({ error: failure }, 502);
    return reply({ success: true });
  } catch {
    return reply({ error: failure }, 502);
  }
}
