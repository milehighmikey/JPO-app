import Link from "next/link";
import { jpo } from "@/data/jpo";
import styles from "./Jpo.module.css";

export function Brand({ footer = false }: { footer?: boolean }) {
  return <div className={`${styles.brand} ${footer ? styles.footerBrand : ""}`} aria-label="JPO Retirement"><span className={styles.brandName}>JPO</span><span className={styles.brandSub}>RETIREMENT</span>{!footer && <><span className={styles.tagline}>A place to call home.</span><span className={styles.brandHeart} aria-hidden>♡</span></>}</div>;
}
export function CalendarIcon(){return <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden><path d="M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2ZM7 2v4m10-4v4M3 9h18M7 13h2m3 0h2m3 0h1M7 17h2m3 0h2"/></svg>}
export function PhoneIcon(){return <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden><path d="M6.5 3.5 9 8 7.4 9.6c1.2 3 3.6 5.4 6.6 6.6l1.6-1.6 4.5 2.5-.8 3c-.2.7-.9 1.2-1.7 1.1C9.6 20 4 14.4 2.8 6.4c-.1-.8.4-1.5 1.1-1.7l2.6-1.2Z"/></svg>}
export function TourButton(){return <Link href="/schedule-tour" className={styles.button}><CalendarIcon/>Schedule a Tour</Link>}
export function PhoneLink(){return <a href={jpo.phoneHref} className={styles.phone}><PhoneIcon/>{jpo.phoneDisplay}</a>}
