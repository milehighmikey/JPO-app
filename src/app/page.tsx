import { CareHighlights } from "@/components/jpo/CareHighlights";
import { Footer } from "@/components/jpo/Footer";
import { Header } from "@/components/jpo/Header";
import { Hero } from "@/components/jpo/Hero";
import { HomeCTA } from "@/components/jpo/HomeCTA";
import { HomeMotion } from "@/components/jpo/HomeMotion";

import styles from "./page.module.css";
import homeStyles from "@/components/jpo/Home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <HomeMotion />

      <div className={styles.heroShell}>
        <Header className={homeStyles.header} />

        <main>
          <div className={styles.homeComposition}>
            <Hero />
            <CareHighlights />
          </div>

          <HomeCTA />
        </main>
      </div>

      <Footer />
    </div>
  );
}