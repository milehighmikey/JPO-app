# Employment application setup

The new page is `/employment`; its server-only endpoint is `POST /api/employment`.
The existing header already includes the route. No existing page, header, menu,
font, asset, or shared stylesheet needs to change.

## Resend and Vercel

1. Add a sending domain in Resend. Publish the DNS records Resend supplies and wait
   until the domain is verified: https://resend.com/docs/dashboard/domains/introduction
2. Create a Resend API key with permission to send from that domain.
3. In the Vercel project's Settings → Environment Variables, configure:
   - `RESEND_API_KEY`: that API key.
   - `JPO_APPLICATION_EMAIL`: the single mailbox that should receive applications.
   - `JPO_APPLICATION_FROM_EMAIL`: a sender on the verified domain, optionally in
     `JPO Retirement <applications@your-verified-domain>` format.
4. Select the intended Vercel environments (Production and, if desired, Preview).
   Redeploy after adding/changing the variables. Do not prefix them with `NEXT_PUBLIC_`.
5. Submit one test application and confirm it appears in Resend's email log and
   the destination inbox. Resend acceptance is confirmed by the app; final inbox
   delivery/bounces should be checked in Resend.

For local testing, copy `.env.example` to `.env.local`, configure the values,
and restart the development server. Never commit `.env.local` or real secrets.

Resend API reference: https://resend.com/docs/api-reference/emails/send-email

## Behavior and checks

- Required fields and bounded optional fields are validated in the browser and
  again on the server. Dates, email, phone, ZIP, enums, availability and the
  acknowledgment are checked. All email content is plain text.
- The honeypot, cross-site rejection and 32 KB body limit provide lightweight spam
  protection. They are not a distributed rate limiter; platform-level limits can
  be added if actual traffic warrants them.
- Resend is called only on the server. Responses never expose credentials,
  recipient configuration, application contents or provider error details.
- A stable submission ID and payload hash provide Resend idempotency on retries.
  Editing an application changes the key. Fields stay intact after errors;
  successful submissions replace the form with a confirmation.
- No applications are saved to browser storage or a database.
- `node --test tests/employment.test.cjs` exercises validation and the actual route
  with mocked Resend responses. These tests never send real email.
- `node node_modules/next/dist/bin/next build` verifies the production build.

A live inbox test requires the configured credentials and verified domain. An
unconfigured environment returns a friendly failure and retains entered values.
