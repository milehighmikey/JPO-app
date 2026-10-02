import Image from "next/image";
import { PhoneLink, TourButton } from "./Shared";
import styles from "./Home.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`${styles.container} ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <h1 id="hero-title">
            Compassionate care.
            <br />
            <span className={styles.accent}>Comfort</span> like home.
          </h1>

          <div className={styles.ornament} aria-hidden="true">
            ♡
          </div>
        </div>

        <p className={styles.intro}>
          At JPO Retirement, every woman is valued, supported, and cared for
          like family.
        </p>

        

        <div
          className={styles.photoSlot}
          role="img"
          aria-label="Caregiver spending time with an older resident"
        >
          <Image
            src="/jpo-caregiver-hero.png"
            alt=""
            fill
            priority
            unoptimized
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 92vw, 60vw"
            className={styles.photoPlaceholder}
          />
          <div className={styles.photoFade} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
