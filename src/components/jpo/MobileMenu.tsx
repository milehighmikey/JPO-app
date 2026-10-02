"use client";

import { useState } from "react";
import Link from "next/link";
import { jpo } from "@/data/jpo";
import styles from "./Jpo.module.css";

type NavigationItem = (typeof jpo.navigation)[number];

export function MobileMenu({
  activeHref = "/",
  navigation = jpo.navigation,
}: {
  activeHref?: string;
  navigation?: readonly NavigationItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.menuButton}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        <span className={styles.menuLines} />
      </button>

      <nav
        id="mobile-navigation"
        className={styles.mobilePanel}
        data-open={open ? "true" : "false"}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        {navigation.map((item, index) => (
          <Link
            href={item.href}
            key={item.href}
            aria-current={item.href === activeHref ? "page" : undefined}
            onClick={() => setOpen(false)}
            style={{ "--menu-index": index } as React.CSSProperties}
          >
            {item.label}
          </Link>
        ))}

        <Link
          href="/contact"
          onClick={() => setOpen(false)}
          style={
            { "--menu-index": navigation.length } as React.CSSProperties
          }
        >
          Schedule a Tour
        </Link>
      </nav>
    </>
  );
}