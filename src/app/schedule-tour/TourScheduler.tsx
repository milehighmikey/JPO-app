
"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import {
  addDays,
  dateKey,
  demoBookingWindowDays,
  formatTourDate,
  getDemoTimes,
} from "./availability";
import styles from "./page.module.css";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type PanelPosition = CSSProperties & {
  "--tour-origin-x": string;
  "--tour-origin-y": string;
  "--tour-origin-width": string;
  "--tour-origin-height": string;
};

export function TourScheduler({ today }: { today: string }) {
  const [month, setMonth] = useState(today.slice(0, 7));
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [demoComplete, setDemoComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [panelPosition, setPanelPosition] =
    useState<PanelPosition | null>(null);

  const confirmation = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const lastDateButton = useRef<HTMLButtonElement | null>(null);

  const firstDay = new Date(`${month}-01T12:00:00Z`);

  const numberOfDays = new Date(
    Date.UTC(firstDay.getUTCFullYear(), firstDay.getUTCMonth() + 1, 0)
  ).getUTCDate();

  const lastMonth = addDays(today, demoBookingWindowDays).slice(0, 7);

  const monthLabel = firstDay.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const times = selectedDate ? getDemoTimes(selectedDate, today) : [];

  const cells = Array.from(
    { length: Math.ceil((firstDay.getUTCDay() + numberOfDays) / 7) * 7 },
    (_, index) => {
      const day = index - firstDay.getUTCDay() + 1;

      return day > 0 && day <= numberOfDays
        ? `${month}-${String(day).padStart(2, "0")}`
        : null;
    }
  );

  const panelOpen = Boolean(selectedDate);

  useEffect(() => {
    if (demoComplete) {
      confirmation.current?.focus();
    }
  }, [demoComplete]);

  useEffect(() => {
    if (!panelOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedDate("");
        setSelectedTime("");
        setDemoComplete(false);
        setSubmitError("");
      }

      if (event.key !== "Tab") return;

      const panel = document.querySelector<HTMLElement>(
        '[data-tour-dialog="true"]'
      );

      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled])'
        )
      ).filter((element) => element.getClientRects().length > 0);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      closeButton.current?.focus();
    }, 1000);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
      lastDateButton.current?.focus();
    };
  }, [panelOpen]);

  function changeMonth(direction: number) {
    const next = new Date(firstDay);

    next.setUTCMonth(next.getUTCMonth() + direction);

    setMonth(dateKey(next).slice(0, 7));
    setSelectedDate("");
    setSelectedTime("");
    setDemoComplete(false);
    setSubmitError("");
  }

  function selectDate(
    date: string,
    button: HTMLButtonElement
  ) {
    const rect = button.getBoundingClientRect();

    lastDateButton.current = button;

    setPanelPosition({
      "--tour-origin-x": `${rect.left + rect.width / 2}px`,
      "--tour-origin-y": `${rect.top + rect.height / 2}px`,
      "--tour-origin-width": `${rect.width}px`,
      "--tour-origin-height": `${rect.height}px`,
    });

    setSelectedDate(date);
    setSelectedTime("");
    setDemoComplete(false);
    setSubmitError("");
  }

  function closePanel() {
    if (isSubmitting) return;

    setSelectedDate("");
    setSelectedTime("");
    setDemoComplete(false);
    setSubmitError("");
  }

  function selectTime(time: string) {
    setSelectedTime(time);
    setDemoComplete(false);
    setSubmitError("");
  }

  async function requestDemoTour(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      isSubmitting ||
      !selectedDate ||
      !times.includes(selectedTime)
    ) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    const submission = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      selectedDate,
      selectedTime,
    };

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/tour", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        throw new Error("Unable to send tour request.");
      }

      setDemoComplete(true);
    } catch {
      setSubmitError(
        "Unable to send your tour request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section
        className={styles.panel}
        aria-labelledby="choose-date-title"
      >
        <p className={styles.demoNotice}>
          Select your preferred date and time to request a tour.
          Times are examples and must be confirmed by JPO Retirement.
        </p>

        <h2 id="choose-date-title">Choose a date</h2>

        <p className={styles.help}>
          Explore a visit starting tomorrow. All times are Central Time.
        </p>

        <div className={styles.calendarHeader}>
          <button
            type="button"
            className={styles.monthButton}
            aria-label="Previous month"
            disabled={month <= today.slice(0, 7)}
            onClick={() => changeMonth(-1)}
          >
            <span aria-hidden="true">‹</span>
          </button>

          <h3 aria-live="polite" aria-atomic="true">
            {monthLabel}
          </h3>

          <button
            type="button"
            className={styles.monthButton}
            aria-label="Next month"
            disabled={month >= lastMonth}
            onClick={() => changeMonth(1)}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <table
          className={styles.calendar}
          aria-label={monthLabel}
        >
          <thead>
            <tr>
              {weekdays.map((day) => (
                <th key={day} scope="col">
                  <abbr title={day}>
                    {day.slice(0, 3)}
                  </abbr>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from(
              { length: cells.length / 7 },
              (_, week) => (
                <tr key={week}>
                  {cells
                    .slice(week * 7, week * 7 + 7)
                    .map((date, index) => (
                      <td key={date ?? `empty-${index}`}>
                        {date && (
                          <button
                            type="button"
                            className={styles.dateButton}
                            disabled={
                              getDemoTimes(date, today).length === 0
                            }
                            aria-label={formatTourDate(date)}
                            aria-pressed={selectedDate === date}
                            aria-current={
                              date === today ? "date" : undefined
                            }
                            onClick={(event) =>
                              selectDate(date, event.currentTarget)
                            }
                          >
                            {Number(date.slice(-2))}
                          </button>
                        )}
                      </td>
                    ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </section>

      {panelOpen && (
        <div className={styles.tourOverlay}>
          <div
            className={styles.tourBackdrop}
            onClick={closePanel}
            aria-hidden="true"
          />

          <div
            className={styles.tourDialog}
            data-tour-dialog="true"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-dialog-title"
            data-step={selectedTime ? "contact" : "times"}
            style={panelPosition ?? undefined}
          >
            <div className={styles.tourDialogInner}>
              <div className={styles.tourDialogHeader}>
                <div>
                  <p className={styles.tourEyebrow}>
                    SCHEDULE A VISIT
                  </p>

                  <h2 id="tour-dialog-title">
                    {demoComplete
                      ? "Request received"
                      : selectedTime
                        ? "Your information"
                        : "Choose a time"}
                  </h2>

                  <p className={styles.help}>
                    {formatTourDate(selectedDate)}
                    {selectedTime
                      ? ` at ${selectedTime} Central Time`
                      : " · Central Time"}
                  </p>
                </div>

                <button
                  ref={closeButton}
                  type="button"
                  className={styles.tourClose}
                  onClick={closePanel}
                  disabled={isSubmitting}
                  aria-label="Close tour scheduler"
                >
                  ×
                </button>
              </div>

              <div className={styles.tourDialogBody}>
                <section
                  className={styles.tourTimesPane}
                  aria-labelledby="available-times-title"
                >
                  <h3 id="available-times-title">
                    Available Times
                  </h3>

                  <p className={styles.help}>
                    Select a time that works best for you.
                  </p>

                  <div
                    className={styles.tourTimeChoices}
                    aria-label="Choose a tour time"
                  >
                    {times.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={styles.timeButton}
                        aria-pressed={selectedTime === time}
                        onClick={() => selectTime(time)}
                        disabled={isSubmitting || demoComplete}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  <p className={styles.tourTimeNote}>
                    All appointment times are requests and
                    must be confirmed by JPO Retirement.
                  </p>
                </section>

                {selectedTime && (
                  <section
                    className={styles.tourContactPane}
                    aria-labelledby="tour-contact-title"
                  >
                    <h3 id="tour-contact-title">
                      Your contact information
                    </h3>

                    <form
                      onSubmit={requestDemoTour}
                      hidden={demoComplete}
                    >
                      <fieldset
                        className={styles.contactFields}
                        disabled={isSubmitting}
                      >
                        <legend className={styles.srOnly}>
                          Your contact information
                        </legend>

                        <label htmlFor="tour-name">
                          Full Name
                          <span aria-hidden="true"> *</span>
                          <input
                            id="tour-name"
                            name="fullName"
                            autoComplete="name"
                            required
                            maxLength={160}
                          />
                        </label>

                        <label htmlFor="tour-email">
                          Email Address
                          <span aria-hidden="true"> *</span>
                          <input
                            id="tour-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            maxLength={254}
                          />
                        </label>

                        <label htmlFor="tour-phone">
                          Phone Number
                          <span aria-hidden="true"> *</span>
                          <input
                            id="tour-phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            required
                            maxLength={40}
                          />
                        </label>

                        <label
                          htmlFor="tour-notes"
                          className={styles.notes}
                        >
                          Optional Notes
                          <textarea
                            id="tour-notes"
                            name="notes"
                            rows={4}
                            maxLength={2000}
                          />
                        </label>
                      </fieldset>

                      <p className={styles.formNote}>
                        * Required fields. Your information
                        will be sent to JPO Retirement
                        to arrange your visit.
                      </p>

                      <button
                        className={styles.submit}
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Sending..."
                          : "Request Tour"}
                      </button>

                      {submitError && (
                        <p role="alert" className={styles.formNote}>
                          {submitError}
                        </p>
                      )}
                    </form>

                    {demoComplete && (
                      <div
                        className={styles.confirmation}
                        ref={confirmation}
                        tabIndex={-1}
                        role="status"
                      >
                        <h3>
                          Your tour request has been sent!
                        </h3>

                        <p>
                          Thank you for your interest in
                          JPO Retirement. We'll contact you
                          to confirm your appointment.
                        </p>

                        <button
                          type="button"
                          className={styles.editButton}
                          onClick={() => {
                            setDemoComplete(false);
                            setSubmitError("");
                          }}
                        >
                          Edit your details
                        </button>
                      </div>
                    )}
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
