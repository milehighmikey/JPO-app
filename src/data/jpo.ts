export const jpo = {
  name: "JPO Retirement",
  phoneDisplay: "(815) 663-4233",
  phoneHref: "tel:+18156634233",
  email: "info@jpo-retirement.com",
  addressLine1: "1234 Meadow Lane",
  addressLine2: "Riverside, CA 92501",
  description: "An intimate home for just women, where compassionate care, meaningful connections, and peace of mind come together every day.",
  hours: ["We’re here for you,", "24 hours a day,", "7 days a week."],
  navigation: [
    { label: "Home", href: "/" },
    
    { label: "Care & Services", href: "/care-services" },
    
    { label: "Gallery", href: "/gallery" },
    { label: "FAQ", href: "/faq" },
    { label: "Employment", href: "/employment" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export const careItems = [
  { icon: "clock", title: "24-Hour Care & Assistance", description: "Compassionate support around the clock for peace of mind, day and night." },
  { icon: "meal", title: "Home-Cooked Meals", description: "Nutritious, homemade meals prepared with care and served with love." },
  { icon: "memory", title: "Memory & Dementia Support", description: "Specialized care in a safe, supportive environment that honors every memory." },
] as const;
