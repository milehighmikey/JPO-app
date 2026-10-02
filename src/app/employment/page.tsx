import type { Metadata } from "next";
import { Header } from "@/components/jpo/Header";
import { EmploymentForm } from "./EmploymentForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Employment Application | JPO Retirement",
  description: "Complete an employment application for JPO Retirement.",
};

export default function EmploymentPage() {
  return <div className={styles.page}>
    <Header activeHref="/employment" />
    <main className={styles.main}>
      <div className={styles.intro}>
        <h1>Employment Application</h1>
        <div className={styles.ornament} aria-hidden="true">♡</div>
        <p>Interested in joining the JPO Retirement team? Complete the application below.</p>
      </div>
      <EmploymentForm />
    </main>
  </div>;
}
