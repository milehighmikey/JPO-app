"use client";

import { useEffect } from "react";
import styles from "./HomeMotion.module.css";

export function HomeMotion() {
  useEffect(() => {
    const root = document.documentElement;

    const hero = document.querySelector<HTMLElement>(
      'section[aria-labelledby="hero-title"]',
    );

    const homeCta = document.querySelector<HTMLElement>(
      'section[aria-labelledby="home-cta-title"]',
    );

    if (!hero || !homeCta) {
      return;
    }

    hero.classList.add(styles.motionHero);
    homeCta.classList.add(styles.motionCta);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (reducedMotion.matches) {
      homeCta.classList.add(styles.ctaVisible);

      return () => {
        hero.classList.remove(styles.motionHero);
        homeCta.classList.remove(
          styles.motionCta,
          styles.ctaVisible,
        );
      };
    }

    let frameId: number | null = null;

    function clamp(
      value: number,
      minimum: number,
      maximum: number,
    ) {
      return Math.min(Math.max(value, minimum), maximum);
    }

    function updateMotion() {
      frameId = null;

      const viewportHeight = window.innerHeight;

      /*
       * HERO
       *
       * Measure the hero relative to the viewport rather than
       * using the page's total scroll position.
       */
      const heroRect = hero!.getBoundingClientRect();

      const heroCenter =
        heroRect.top + heroRect.height / 2;

      const viewportCenter =
        viewportHeight / 2;

      const heroDistance =
        viewportCenter - heroCenter;

      /*
       * LEFT FLOWERS
       *
       * Foreground layer, so this receives the strongest
       * movement.
       */
        const leftFlowerMovement = clamp(
        heroDistance * 0.1,
        -90,
        90,
      );

      /*
       * HERO PHOTO
       *
       * Much slower than the flowers, creating depth.
       */
      const photoMovement = clamp(
        heroDistance * 0.06,
        -32,
        32,
      );

      /*
       * CTA / BOTTOM FLOWERS
       */
      const ctaRect = homeCta!.getBoundingClientRect();

      const ctaCenter =
        ctaRect.top + ctaRect.height / 2;

      const ctaDistance =
        viewportCenter - ctaCenter;

      /*
       * Different speed and direction from the left flowers.
       */
      const bottomFlowerMovement = clamp(
        ctaDistance * -0.15,
        -72,
        72,
      );

      root.style.setProperty(
        "--jpo-left-flower-parallax",
        `${leftFlowerMovement}px`,
      );

      root.style.setProperty(
        "--jpo-photo-parallax",
        `${photoMovement}px`,
      );

      root.style.setProperty(
        "--jpo-bottom-flower-parallax",
        `${bottomFlowerMovement}px`,
      );
    }

    function requestMotionUpdate() {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(updateMotion);
    }

    /*
     * CTA TEXT REVEAL
     */
    const ctaObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        homeCta.classList.add(styles.ctaVisible);
        ctaObserver.disconnect();
      },
      {
        threshold: 0.15,
      },
    );

    ctaObserver.observe(homeCta);

    updateMotion();

    window.addEventListener(
      "scroll",
      requestMotionUpdate,
      { passive: true },
    );

    window.addEventListener(
      "resize",
      requestMotionUpdate,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        requestMotionUpdate,
      );

      window.removeEventListener(
        "resize",
        requestMotionUpdate,
      );

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      ctaObserver.disconnect();

      root.style.removeProperty(
        "--jpo-left-flower-parallax",
      );

      root.style.removeProperty(
        "--jpo-photo-parallax",
      );

      root.style.removeProperty(
        "--jpo-bottom-flower-parallax",
      );

      hero.classList.remove(styles.motionHero);

      homeCta.classList.remove(
        styles.motionCta,
        styles.ctaVisible,
      );
    };
  }, []);

  return null;
}