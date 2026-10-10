"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  applicationSections,
  days,
  shifts,
  validateApplication,
  type ApplicationErrors,
  type ApplicationField,
} from "../../lib/employment-application";
import styles from "./page.module.css";

export function EmploymentForm() {
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const pending = useRef(false);
  const submissionId = useRef("");
  const feedback = useRef<HTMLDivElement>(null);
  const confirmation = useRef<HTMLElement>(null);

  useEffect(() => {
    if (success) confirmation.current?.focus();
  }, [success]);
  useEffect(() => {
    if (message) feedback.current?.focus();
  }, [message, errors]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = new FormData(event.currentTarget);
    if (!submissionId.current) submissionId.current = crypto.randomUUID();
    const payload = {
      ...Object.fromEntries(form),
      availability: form.getAll("availability"),
      acknowledgment: form.get("acknowledgment") === "on",
      submissionId: submissionId.current,
    };
    const validation = validateApplication(payload);
    setErrors(validation.errors);
    if (Object.keys(validation.errors).length) {
      setMessage("Please check the highlighted fields before submitting.");
      return;
    }
    pending.current = true;
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/employment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        setErrors(result.errors ?? {});
        setMessage(
          typeof result.error === "string"
            ? result.error
            : "We couldn’t submit your application. Please try again.",
        );
      } else setSuccess(true);
    } catch {
      setMessage(
        "We couldn’t confirm your submission. Your information is still here. Please check your connection and try again.",
      );
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  }

  function renderField(field: ApplicationField) {
    const id = `application-${field.name}`;
    const common = {
      id,
      name: field.name,
      required: field.required,
      "aria-invalid": !!errors[field.name],
      "aria-describedby": errors[field.name] ? `${id}-error` : undefined,
    };
    return (
      <div
        key={field.name}
        className={`${styles.field} ${field.wide ? styles.wide : ""}`}
      >
        <label htmlFor={id}>
          {field.label}
          {field.required && <span aria-hidden="true"> *</span>}
        </label>
        {field.options ? (
          <select {...common} defaultValue="">
            <option value="">Select an option</option>
            {field.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        ) : field.type === "textarea" ? (
          <textarea {...common} rows={4} maxLength={field.maxLength} />
        ) : (
          <input
            {...common}
            type={field.type ?? "text"}
            autoComplete={field.autoComplete}
            maxLength={field.maxLength ?? 160}
            min={field.type === "number" ? 0 : undefined}
            max={field.type === "number" ? 80 : undefined}
            step={field.type === "number" ? 0.1 : undefined}
            inputMode={field.name === "zip" ? "numeric" : undefined}
          />
        )}
        {errors[field.name] && (
          <p className={styles.error} id={`${id}-error`}>
            {errors[field.name]}
          </p>
        )}
      </div>
    );
  }

  if (success)
    return (
      <section
        className={`${styles.panel} ${styles.confirmation}`}
        ref={confirmation}
        tabIndex={-1}
        aria-labelledby="application-success"
      >
        <span className={styles.confirmationHeart} aria-hidden="true">
          ♡
        </span>
        <h2 id="application-success">
          Thank you. Your application has been submitted.
        </h2>
        <p>JPO Retirement has received your application.</p>
      </section>
    );

  return (
    <form
      className={styles.panel}
      onSubmit={submit}
      noValidate
      aria-label="Employment application"
      aria-busy={submitting}
    >
      <p className={styles.requiredNote}>
        Fields marked with * are required. All other questions are optional.
      </p>
      {message && (
        <div
          ref={feedback}
          tabIndex={-1}
          role="alert"
          className={styles.feedback}
        >
          <p>{message}</p>
          {Object.keys(errors).length > 0 && (
            <ul>
              {Object.entries(errors).map(([name, error]) => (
                <li key={name}>
                  <a href={`#application-${name}`}>{error}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <fieldset className={styles.formBody} disabled={submitting}>
        <legend className={styles.visuallyHidden}>Application details</legend>
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="application-website">Leave this field empty</label>
          <input
            id="application-website"
            name="website"
            type="text"
            autoComplete="off"
            tabIndex={-1}
          />
        </div>
        {applicationSections.map((section, index) => (
          <section
            key={section.title}
            className={styles.section}
            aria-labelledby={`section-${index}`}
          >
            <h2 id={`section-${index}`}>{section.title}</h2>
            {section.note && <p className={styles.note}>{section.note}</p>}
            <div className={styles.grid}>{section.fields.map(renderField)}</div>
            {section.title === "Employment information" && (
              <fieldset
                id="application-availability"
                className={styles.availability}
                aria-describedby={`availability-help${errors.availability ? " availability-error" : ""}`}
              >
                <legend>Availability</legend>
                <p id="availability-help" className={styles.note}>
                  Select the days and times you’re generally available. Leave
                  blank if you’d prefer to discuss.
                </p>
                <div className={styles.days}>
                  {days.map((day) => (
                    <fieldset key={day} className={styles.day}>
                      <legend>{day}</legend>
                      <div>
                        {shifts.map((shift) => (
                          <label key={shift}>
                            <input
                              type="checkbox"
                              name="availability"
                              value={`${day}: ${shift}`}
                            />
                            <span>{shift}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
                {errors.availability && (
                  <p id="availability-error" className={styles.error}>
                    {errors.availability}
                  </p>
                )}
              </fieldset>
            )}
          </section>
        ))}
        <div className={styles.acknowledgment}>
          <label>
            <input
              id="application-acknowledgment"
              type="checkbox"
              name="acknowledgment"
              required
              aria-invalid={!!errors.acknowledgment}
              aria-describedby={
                errors.acknowledgment ? "acknowledgment-error" : undefined
              }
            />
            <span>
              I certify that the information I provided is accurate to the best
              of my knowledge. <span aria-hidden="true">*</span>
            </span>
          </label>
          {errors.acknowledgment && (
            <p className={styles.error} id="acknowledgment-error">
              {errors.acknowledgment}
            </p>
          )}
        </div>
        <button className={styles.submit} type="submit" disabled={submitting}>
          {submitting ? "Submitting application…" : "Submit Application"}
        </button>
      </fieldset>
      <p className={styles.visuallyHidden} role="status">
        {submitting ? "Submitting your application. Please wait." : ""}
      </p>
      <noscript>
        Please enable JavaScript to complete and submit this application.
      </noscript>
    </form>
  );
}
