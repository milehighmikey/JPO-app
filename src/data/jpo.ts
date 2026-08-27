export const jpo = {
  name: "JPO Retirement",
  phoneDisplay: "(909) 555-1234",
  phoneHref: "tel:+19095551234",
  email: "info@jpo-retirement.com",
  addressLine1: "1234 Meadow Lane",
  addressLine2: "Riverside, CA 92501",
  description: "An intimate home for just women, where compassionate care, meaningful connections, and peace of mind come together every day.",
  hours: ["We’re here for you,", "24 hours a day,", "7 days a week."],
  navigation: [
    { label: "Home", href: "/" },
    { label: "Our Home", href: "/our-home" },
    { label: "Care & Services", href: "/care-services" },
    { label: "Life at JPO", href: "/life-at-jpo" },
    { label: "Gallery", href: "/gallery" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export const careItems = [
  { icon: "clock", title: "24-Hour Care & Assistance", description: "Compassionate support around the clock for peace of mind, day and night." },
  { icon: "meal", title: "Home-Cooked Meals", description: "Nutritious, homemade meals prepared with care and served with love." },
  { icon: "memory", title: "Memory & Dementia Support", description: "Specialized care in a safe, supportive environment that honors every memory." },
] as const;
