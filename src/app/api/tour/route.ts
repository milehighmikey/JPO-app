
import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  formatTourDate,
  getDemoTimes,
  tourTimeZone,
} from "@/app/schedule-tour/availability";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const notes = String(body.notes ?? "").trim();
    const selectedDate = String(body.selectedDate ?? "").trim();
    const selectedTime = String(body.selectedTime ?? "").trim();

    if (
      !fullName ||
      !email ||
      !phone ||
      !selectedDate ||
      !selectedTime
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    if (
      fullName.length > 160 ||
      email.length > 254 ||
      phone.length > 40 ||
      notes.length > 2000 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Please check your contact information." },
        { status: 400 }
      );
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate) ||
      !Number.isFinite(
        new Date(`${selectedDate}T12:00:00Z`).getTime()
      )
    ) {
      return NextResponse.json(
        { error: "Invalid tour date." },
        { status: 400 }
      );
    }

    const todayParts = new Intl.DateTimeFormat("en-US", {
      timeZone: tourTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const getPart = (type: string) =>
      todayParts.find((part) => part.type === type)?.value ?? "";

    const today = [
      getPart("year"),
      getPart("month"),
      getPart("day"),
    ].join("-");

    if (!getDemoTimes(selectedDate, today).includes(selectedTime)) {
      return NextResponse.json(
        { error: "The requested date or time is unavailable." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY is missing.");

      return NextResponse.json(
        { error: "Email service is unavailable." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: "JPO Retirement <notifications@jporetirement.com>",
      to: ["jan.musgrove4607@gmail.com"],
      replyTo: email,
      subject: `JPO Tour Request: ${formatTourDate(selectedDate)}`,
      text: [
        "New tour request - confirmation required",
        "",
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        "",
        `Requested Date: ${formatTourDate(selectedDate)}`,
        `Requested Time: ${selectedTime} Central Time`,
        "",
        "Optional Notes:",
        notes || "None provided",
        "",
        "This is a request, not a confirmed appointment.",
        "Please contact the visitor to confirm availability.",
      ].join("\n"),
    });

    if (error) {
      console.error("Resend tour request error:", error);

      return NextResponse.json(
        { error: "Unable to send your tour request." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tour request error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
