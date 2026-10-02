import Link from "next/link";
import { jpo } from "@/data/jpo";
import { Brand, PhoneLink } from "./Shared";
import styles from "./Jpo.module.css";

export function Footer() {
  return (
    <footer className={`${styles.footer} jpo-home-footer`}>
      <div className={`${styles.container} ${styles.footerInner}`}>
        <div className={styles.footerBrand}>
          <Brand />

          <p className={styles.footerTagline}>
            Compassionate care. Comfort like home.
          </p>
        </div>

        <nav className={styles.footerNav} aria-label="Footer navigation">
          {jpo.navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.footerContact}>
        <PhoneLink />
        <p>119 Saunders St.</p>
        <p>Dalzell, Illinois</p>
      </div>
       </div>

      <div className={`${styles.container} ${styles.footerBottom}`}>
        <p>
          © {new Date().getFullYear()} JPO Retirement. All rights reserved.
        </p>
      </div>
    </footer>
  );
}