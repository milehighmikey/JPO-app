
"use client";

import { useState, type FormEvent } from "react";
import styles from "./page.module.css";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const submission = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    setIsSubmitting(true);
    setStatus("");
    setIsSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        throw new Error("Message could not be sent.");
      }

      form.reset();
      setIsSuccess(true);
      setStatus("Your message has been sent successfully!");
    } catch {
      setIsSuccess(false);
      setStatus("Unable to send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="full-name">Full Name</label>
      <input
        id="full-name"
        name="fullName"
        type="text"
        autoComplete="name"
        placeholder="Your full name"
        required
      />

      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        required
      />

      <label htmlFor="phone">Phone Number</label>
      <input
        id="phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="(909) 555-1234"
      />

      <label htmlFor="subject">Subject</label>
      <input
        id="subject"
        name="subject"
        type="text"
        placeholder="How can we help?"
        required
      />

      <label htmlFor="message">Message</label>
      <textarea
        id="message"
        name="message"
        placeholder="Write your message here..."
        required
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      {status && (
        <p role="status" aria-live="polite">
          {isSuccess ? "✓ " : ""}
          {status}
        </p>
      )}
    </form>
  );
}
