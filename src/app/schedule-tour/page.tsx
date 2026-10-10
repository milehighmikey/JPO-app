import type { Metadata } from "next";
import { Header } from "@/components/jpo/Header";
import { TourScheduler } from "./TourScheduler";
import { tourTimeZone } from "./availability";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Schedule a Tour | JPO Retirement",
  description: "Choose a date and time to explore a visit to JPO Retirement.",
};

// Keep the calendar's current date fresh rather than fixing it at build time.
export const dynamic = "force-dynamic";

export default function ScheduleTourPage() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tourTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: string) => parts.find((value) => value.type === type)?.value;
  const today = `${part("year")}-${part("month")}-${part("day")}`;

  return (
    <div className={styles.page}>
      <Header activeHref="/schedule-tour" />
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>
            Come see what makes JPO <em>feel like home.</em>
          </h1>
          <div className={styles.ornament} aria-hidden="true">♡</div>
          <p>
            Choose a convenient date and time to visit JPO Retirement and learn
            more about our home and the care we provide.
          </p>
        </div>
        <TourScheduler today={today} />
      </main>
    </div>
  );
}
