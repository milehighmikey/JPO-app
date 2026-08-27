import type { Metadata } from "next";
import { Header } from "@/components/jpo/Header";
import { FaqAccordion } from "./FaqAccordion";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | JPO Retirement",
  description: "Answers to common questions about care, daily life, and tours at JPO Retirement.",
};

export default function FaqPage() {
  return (
    <div className={styles.page}>
      <Header activeHref="/faq" />
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Frequently Asked <em>Questions</em></h1>
          <div className={styles.ornament} aria-hidden><span>♡</span></div>
          <p>We know choosing a home is an important decision.<br />Here are answers to some of the most common questions we receive.</p>
        </div>
        <FaqAccordion />
      </main>
    </div>
  );
}
