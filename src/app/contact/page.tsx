
import type { Metadata } from "next";
import { Header } from "@/components/jpo/Header";
import { jpo } from "@/data/jpo";
import { ContactForm } from "./ContactForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact | JPO Retirement",
  description: "Contact JPO Retirement to ask a question or schedule a tour.",
};

const contactNavigation = jpo.navigation.filter(({ href }) =>
  ["/", "/care-services", "/gallery", "/faq", "/contact"].includes(href),
);

function HeartDivider() {
  return (
    <div className={styles.divider} aria-hidden>
      <span>♡</span>
    </div>
  );
}

function ContactIcon({
  name,
}: {
  name: "phone" | "email" | "address" | "hours";
}) {
  const paths = {
    phone: (
      <path d="M6.5 3.5 9 8 7.4 9.6c1.2 3 3.6 5.4 6.6 6.6l1.6-1.6 4.5 2.5-.8 3c-.2.7-.9 1.2-1.7 1.1C9.6 20 4 14.4 2.8 6.4c-.1-.8.4-1.5 1.1-1.7l2.6-1.2Z" />
    ),
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="m4 7 8 7 8-7M4 18l6-6m10 6-6-6" />
      </>
    ),
    address: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    hours: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 3" />
      </>
    ),
  };

  return (
    <span className={styles.iconCircle} aria-hidden>
      <svg viewBox="0 0 24 24">{paths[name]}</svg>
    </span>
  );
}

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <Header activeHref="/contact" navigation={contactNavigation} />

      <main className={styles.main}>
        <div className={styles.flowers} aria-hidden />

        <section
          className={styles.intro}
          aria-labelledby="contact-title"
        >
          <h1 id="contact-title">
            We’re here to <em>help.</em>
          </h1>

          <HeartDivider />

          <p>
            Have a question or want to learn more about
            <br />
            JPO Retirement? We’d love to hear from you.
          </p>
        </section>

        <div className={styles.cards}>
          <section
            className={`${styles.card} ${styles.formCard}`}
            aria-labelledby="message-heading"
          >
            <h2 id="message-heading">Send us a message</h2>
            <ContactForm />
          </section>

          <section
            className={`${styles.card} ${styles.infoCard}`}
            aria-labelledby="information-heading"
          >
            <h2 id="information-heading">Contact Information</h2>

            <HeartDivider />

            <address className={styles.contactList}>
              <div className={styles.contactRow}>
                <ContactIcon name="phone" />

                <div>
                  <h3>Phone</h3>
                  <a href={jpo.phoneHref}>
                    {jpo.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className={styles.contactRow}>
                <ContactIcon name="email" />

                <div>
                  <h3>Email</h3>
                  <a href={`mailto:${jpo.email}`}>
                    {jpo.email}
                  </a>
                </div>
              </div>

              <div className={styles.contactRow}>
                <ContactIcon name="address" />

                <div>
                  <h3>Address</h3>

                  <p>
                    {jpo.addressLine1}
                    <br />
                    {jpo.addressLine2}
                  </p>
                </div>
              </div>

              <div className={styles.contactRow}>
                <ContactIcon name="hours" />

                <div>
                  <h3>Hours</h3>

                  <p>
                    {jpo.hours.map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </address>
          </section>
        </div>

        {/* GOOGLE MAPS SECTION */}

        <section
          className={styles.mapSection}
          aria-labelledby="contact-map-title"
        >
          <div className={styles.mapHeading}>
            <h2 id="contact-map-title">Find Us</h2>

            <p>
              119 Saunders St., Dalzell, IL 61320
            </p>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=119%20Saunders%20St%2C%20Dalzell%2C%20IL%2061320"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Directions ↗
            </a>
          </div>

          <div className={styles.mapFrame}>
            <iframe
              title="Google Maps location of JPO Retirement"
              src="https://www.google.com/maps?q=119%20Saunders%20St%2C%20Dalzell%2C%20IL%2061320&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>
      </main>
    </div>
  );
}
