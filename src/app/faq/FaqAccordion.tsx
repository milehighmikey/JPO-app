
"use client";

import { useState } from "react";
import styles from "./page.module.css";

const faqs = [
  [
    "What types of care and support do you offer?",
    "JPO Retirement provides 24-hour care and assistance, home-cooked meals, help with daily routines, medication reminders, companionship, and specialized support for women living with memory or dementia needs.",
  ],
  [
    "How many residents live at JPO Retirement?",
    "JPO is an intimate residential home with space for a small number of women, allowing our caregivers to provide personal attention and create a close, family-like environment.",
  ],
  [
    "What is a typical day like for residents?",
    "Every day is a little different. Residents enjoy home-cooked meals, conversation, personal care, relaxing activities, time together, and the comfort of a familiar home environment while receiving the support they need.",
  ],
  [
    "How do you support residents with memory or dementia needs?",
    "Our caregivers provide patient, compassionate support in a calm and familiar environment. We focus on consistent routines, personal attention, safety, comfort, and treating every resident with dignity.",
  ],
  [
    "Can residents personalize their rooms?",
    "Yes. We encourage residents and their families to bring familiar belongings, photographs, decorations, and other personal touches that help make their space feel comfortable and familiar.",
  ],
  [
    "Can family members visit whenever they'd like?",
    "Family visits are always welcome. We encourage loved ones to stay involved and ask that visits be coordinated with our staff when necessary to respect residents' routines.",
  ],
  [
    "What happens if a resident's care needs change?",
    "We regularly assess each resident's needs and communicate with families about changes. If additional care becomes necessary, we'll work with the family to discuss appropriate options.",
  ],
  [
    "How do I schedule a tour?",
    "You can schedule a tour by using the Schedule a Tour button on our website or by calling us directly. We would be happy to show you the home, answer your questions, and learn more about your family’s needs.",
  ],
] as const;

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={styles.accordion}>
      {faqs.map(([question, answer], index) => {
        const open = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const triggerId = `faq-trigger-${index}`;

        return (
          <section
            className={`${styles.item} ${open ? styles.itemOpen : ""}`}
            key={question}
          >
            <h2>
              <button
                id={triggerId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
              >
                <span>{question}</span>
                <span className={styles.symbol} aria-hidden>
                  {open ? "−" : "+"}
                </span>
              </button>
            </h2>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={styles.answer}
              inert={!open ? true : undefined}
            >
              <div>
                <p>{answer}</p>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
