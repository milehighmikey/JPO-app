import { CareHighlights } from "@/components/jpo/CareHighlights";
import { Footer } from "@/components/jpo/Footer";
import { Header } from "@/components/jpo/Header";
import { Hero } from "@/components/jpo/Hero";
import { HomeCTA } from "@/components/jpo/HomeCTA";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.heroShell}>
        <Header />
        <main>
          <Hero />
          <CareHighlights />
        </main>
      </div>
      <HomeCTA />
      <Footer />
    </div>
  );
}
