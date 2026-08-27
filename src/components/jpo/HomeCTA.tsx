import { jpo } from "@/data/jpo";
import { TourButton } from "./Shared";
import styles from "./Jpo.module.css";
export function HomeCTA(){return <section className={styles.homeCta} aria-labelledby="cta-title"><div className={styles.container}><h2 id="cta-title">Come see what makes JPO <em>feel different.</em></h2><div className={`${styles.ornament} ${styles.ctaOrnament}`} aria-hidden>♡</div><div className={styles.ctaActions}><TourButton/><span className={styles.ctaCall}>or call <a href={jpo.phoneHref}>{jpo.phoneDisplay}</a></span></div></div></section>}
