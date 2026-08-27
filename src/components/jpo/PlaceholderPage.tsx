import Link from "next/link";
import { Brand } from "./Shared";
import styles from "./Jpo.module.css";
export function PlaceholderPage({title}:{title:string}){return <main className={styles.placeholderPage}><div><Brand/><h1>{title}</h1><p>Page coming next.</p><Link href="/">Return home</Link></div></main>}
