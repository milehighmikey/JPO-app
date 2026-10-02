import { PhoneLink, TourButton } from "./Shared";
import styles from "./Home.module.css";

export function HomeCTA() {
  return (
    <section className={styles.homeCta} aria-labelledby="home-cta-title">
      <div className={`${styles.container} ${styles.homeCtaInner}`}>
        <div className={styles.homeCtaCopy}>
          <h2 id="home-cta-title">
            Come see what makes{" "}
            <br />
            JPO <span className={styles.accent}>feel different.</span>
          </h2>

          <div className={styles.ctaOrnament} aria-hidden="true">
            <span className={styles.ctaLine} />
            <span className={styles.ctaHeart}>♡</span>
            <span className={styles.ctaLine} />
          </div>
        </div>

        <div className={styles.homeCtaActions}>
          <TourButton />
          <PhoneLink />
        </div>
      </div>
    </section>
  );
}
