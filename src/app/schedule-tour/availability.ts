// Demo availability only. Replace this module with an availability API later.
export const tourTimeZone = "America/Chicago";
export const demoBookingWindowDays = 90;

export const demoTimeSlots = [
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "2:30 PM",
  "4:00 PM",
] as const;

// Sunday is unavailable in this prototype; these are not JPO's actual hours.
const demoAvailableWeekdays = [1, 2, 3, 4, 5, 6];

export function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(value: string, count: number): string {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + count);
  return dateKey(date);
}

export function getDemoTimes(date: string, today: string): readonly string[] {
  if (date <= today || date > addDays(today, demoBookingWindowDays)) {
    return [];
  }

  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  return demoAvailableWeekdays.includes(weekday) ? demoTimeSlots : [];
}

export function formatTourDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}
