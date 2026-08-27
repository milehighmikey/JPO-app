import { careItems } from "@/data/jpo";
import styles from "./Jpo.module.css";

function CareIcon({type}:{type:(typeof careItems)[number]["icon"]}){
  if(type==="clock") return <svg className={styles.cardIcon} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="29" cy="29" r="22"/><path d="M29 14v16l9 6M29 7v5M7 29h5m17 17v5m17-22h5M40 48c-6-5-10-8-10-13 0-6 8-8 11-3 3-5 11-3 11 3 0 5-4 8-12 13Z" fill="var(--jpo-cream)"/></svg>;
  if(type==="meal") return <svg className={styles.cardIcon} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 25h38l-4 26H17l-4-26Zm-4 0h46M22 18c-5-6 5-7 0-13m11 13c-5-6 5-7 0-13m11 13c-5-6 5-7 0-13"/><path d="M32 42c-8-5-8-13-2-13 2 0 3 1 4 3 3-5 11-3 9 3-1 3-5 6-11 7Z"/></svg>;
  return <svg className={styles.cardIcon} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2"><path d="M31 11c-5-8-16-3-14 5-8-2-12 8-6 13-7 5-2 15 5 14-1 8 10 12 15 6m2-38c5-8 16-3 14 5 8-2 12 8 6 13 7 5 2 15-5 14 1 8-10 12-15 6V11Z"/><path d="M18 21c7 0 7 9 1 11m27-11c-7 0-7 9-1 11M22 43c3-7 9-5 10 0 1-5 7-7 10 0-2 5-5 7-10 11-5-4-8-6-10-11Z"/></svg>;
}
export function CareHighlights(){return <section className={styles.care} aria-labelledby="care-title"><div className={styles.container}><h2 className={styles.careHeading} id="care-title">Care that matters most.</h2><div className={styles.cardGrid}>{careItems.map(item=><article className={styles.card} key={item.title}><CareIcon type={item.icon}/><div><h3>{item.title}</h3><div className={styles.miniOrnament} aria-hidden>— ♡ —</div><p>{item.description}</p></div></article>)}</div></div></section>}
