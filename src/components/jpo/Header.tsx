import Link from "next/link";
import { jpo } from "@/data/jpo";
import { MobileMenu } from "./MobileMenu";
import { Brand, PhoneLink, TourButton } from "./Shared";
import styles from "./Jpo.module.css";

type NavigationItem = (typeof jpo.navigation)[number];

type HeaderProps = {
  className?: string;
  activeHref?: string;
  navigation?: readonly NavigationItem[];
};

export function Header({
  className = "",
  activeHref = "/",
  navigation = jpo.navigation,
}: HeaderProps) {
  return (
    <header className={`${styles.header} ${className}`}>
      <div className={`${styles.container} ${styles.headerGrid}`}>
        <Brand />

        <nav className={styles.nav} aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.href === activeHref ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <TourButton />
          <PhoneLink />
        </div>

        <MobileMenu
          activeHref={activeHref}
          navigation={navigation}
        />

        <div className={styles.mobileActions}>
          <TourButton />
          <PhoneLink />
        </div>
      </div>
    </header>
  );
}
