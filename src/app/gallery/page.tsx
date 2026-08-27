import type { Metadata } from "next";
import { Header } from "@/components/jpo/Header";
import { TourButton } from "@/components/jpo/Shared";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Gallery | JPO Retirement", description: "A glimpse into the home, activities, and community at JPO Retirement." };

function BotanicalDivider(){return <div className={styles.divider} aria-hidden><span><svg viewBox="0 0 24 24"><path d="M12 22V4m0 7c-4 0-6-2-6-5 4 0 6 2 6 5Zm0 5c4 0 6-2 6-5-4 0-6 2-6 5Zm0 3c-3.1 0-4.8-1.6-4.8-4 3.1 0 4.8 1.6 4.8 4Z"/></svg></span></div>}
function GalleryImagePlaceholder(){return <div className={styles.imagePlaceholder} aria-hidden/>}
function GalleryVideoPlaceholder({number}:{number:number}){return <div className={styles.videoPlaceholder} role="img" aria-label={`Video ${number} coming soon`}><span className={styles.playIcon} aria-hidden><svg viewBox="0 0 24 24"><path d="m9 7 8 5-8 5V7Z"/></svg></span></div>}
function GallerySection({title,count}:{title:string;count:number}){const id=`${title.toLowerCase().replaceAll(" ","-")}-heading`;return <section className={styles.gallerySection} aria-labelledby={id}><h2 id={id}>{title}</h2><div className={styles.photoGrid}>{Array.from({length:count},(_,index)=><GalleryImagePlaceholder key={index}/>)}</div></section>}

export default function GalleryPage(){return <div className={styles.page}>
  <div className={styles.headerShell}><Header activeHref="/gallery"/></div>
  <main>
    <section className={styles.hero} aria-labelledby="gallery-title"><div className={styles.heroInner}>
      <p className={styles.eyebrow}>Gallery</p><h1 id="gallery-title">A glimpse into<br/>our home and heart.</h1>
      <div className={styles.heartDivider} aria-hidden><span>♡</span></div>
      <p className={styles.introCopy}>Explore moments from our space, activities, and community.<br/>Every photo tells a story of care, connection, and comfort.</p>
    </div></section>
    <div className={styles.galleryWrap}><div className={styles.leftFlowers} aria-hidden/>
      <GallerySection title="Our Space" count={4}/><BotanicalDivider/><GallerySection title="Community & Events" count={4}/><BotanicalDivider/>
      <section className={styles.gallerySection} aria-labelledby="videos-heading"><h2 id="videos-heading">Videos</h2><div className={styles.videoGrid}>{Array.from({length:3},(_,index)=><GalleryVideoPlaceholder key={index} number={index+1}/>)}</div></section>
      <section className={styles.cta} aria-labelledby="gallery-cta-title"><h2 id="gallery-cta-title">Come see what makes<br/>JPO <em>feel different.</em></h2><div className={styles.ctaDivider} aria-hidden/><p>We’d love to welcome you into our<br/>home and show you what life at<br/>JPO feels like.</p><TourButton/></section>
      <div className={styles.rightFlowers} aria-hidden/>
    </div>
  </main>
</div>}
