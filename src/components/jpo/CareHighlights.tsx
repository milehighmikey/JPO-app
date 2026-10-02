import styles from "./Home.module.css";

const careHighlights = [
  {
    title: "24-Hour Care & Assistance",
    description:
      "Compassionate support around the clock for peace of mind, day and night.",
    icon: "care",
  },
  {
    title: "Home-Cooked Meals",
    description:
      "Nutritious, homemade meals prepared with care and served with love.",
    icon: "meals",
  },
  {
    title: "Memory & Dementia Support",
    description:
      "Specialized care in a safe, supportive environment that honors every memory.",
    icon: "memory",
  },
] as const;

type IconType = (typeof careHighlights)[number]["icon"];

function CareIcon({ type }: { type: IconType }) {
  if (type === "care") {
    return (
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="29" cy="29" r="18" />
        <path d="M29 18v12l8 5" />
        <path d="M29 8v4" />
        <path d="M11 29H7" />
        <path d="M51 29h-4" />
        <path d="M29 51v-4" />
        <path d="M43.5 41.5c-3.2-3.2-8.5-1-8.5 3.5 0 5.5 8.5 10 8.5 10s8.5-4.5 8.5-10c0-4.5-5.3-6.7-8.5-3.5Z" />
      </svg>
    );
  }

  if (type === "meals") {
    return (
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 34h36" />
        <path d="M17 34l4 23h22l4-23" />

        <path d="M23 27c-4-4-1-7 1-10 2-3 1-6-1-8" />
        <path d="M32 27c-4-4-1-7 1-10 2-3 1-6-1-8" />
        <path d="M41 27c-4-4-1-7 1-10 2-3 1-6-1-8" />

        <path d="M32 39.5c-2.8-3-7.5-1-7.5 3 0 4.5 7.5 8.3 7.5 8.3s7.5-3.8 7.5-8.3c0-4-4.7-6-7.5-3Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M31 10c-5-4-12-1-12 5-6 0-9 7-5 11-5 4-3 12 3 13-2 7 5 12 11 9 2 5 9 5 12 1" />
      <path d="M33 10c5-4 12-1 12 5 6 0 9 7 5 11 5 4 3 12-3 13 2 7-5 12-11 9" />

      <path d="M25 18c-4 1-5 5-3 8" />
      <path d="M39 18c4 1 5 5 3 8" />
      <path d="M20 32c4-1 7 1 8 4" />
      <path d="M44 32c-4-1-7 1-8 4" />
      <path d="M31 15v21" />
      <path d="M33 15v18" />

      <path d="M32 40.5c-3.1-3.2-8.2-1-8.2 3.4 0 5.1 8.2 9.4 8.2 9.4s8.2-4.3 8.2-9.4c0-4.4-5.1-6.6-8.2-3.4Z" />
    </svg>
  );
}

export function CareHighlights() {
  return (
    <section
      className={styles.careHighlights}
      aria-label="Care highlights"
    >
      <div className={`${styles.container} ${styles.careGrid}`}>
        {careHighlights.map((item) => (
          <article
            className={styles.careCard}
            key={item.title}
          >
            <div className={styles.careIcon} aria-hidden="true"><CareIcon type={item.icon} /></div>
            <h2 className={styles.desktopTitle}>{item.title}</h2>
            <div className={styles.careOrnament} aria-hidden="true">♡</div>
            <p id={`care-${item.icon}`} className={styles.careDescription}>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
