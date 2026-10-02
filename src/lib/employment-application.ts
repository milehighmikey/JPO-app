export type ApplicationField = {
  name: string;
  label: string;
  required?: boolean;
  type?: "text" | "email" | "tel" | "date" | "number" | "textarea";
  autoComplete?: string;
  options?: readonly string[];
  maxLength?: number;
  wide?: boolean;
};

export const applicationSections: { title: string; note?: string; fields: ApplicationField[] }[] = [
  { title: "Personal information", fields: [
    { name: "fullName", label: "Full Name", required: true, autoComplete: "name" },
    { name: "phone", label: "Phone Number", type: "tel", required: true, autoComplete: "tel", maxLength: 40 },
    { name: "email", label: "Email Address", type: "email", required: true, autoComplete: "email", maxLength: 254 },
    { name: "street", label: "Street Address", required: true, autoComplete: "street-address" },
    { name: "city", label: "City", required: true, autoComplete: "address-level2" },
    { name: "state", label: "State", required: true, autoComplete: "address-level1", maxLength: 60 },
    { name: "zip", label: "ZIP Code", required: true, autoComplete: "postal-code", maxLength: 10 },
  ] },
  { title: "Employment information", fields: [
    { name: "position", label: "Position Applying For", required: true },
    { name: "preference", label: "Employment Preference", required: true, options: ["Full-Time", "Part-Time", "Either"] },
    { name: "startDate", label: "Available Start Date", type: "date" },
  ] },
  { title: "Experience", fields: [
    { name: "experience", label: "Do you have previous caregiving or healthcare experience?", options: ["Yes", "No"], wide: true },
    { name: "years", label: "Years of Experience", type: "number", maxLength: 5 },
    { name: "employer", label: "Current or Most Recent Employer" },
    { name: "jobTitle", label: "Previous Position / Job Title" },
  ] },
  { title: "Qualifications", note: "These are application questions, not requirements for employment.", fields: [
    { name: "cna", label: "CNA Certification", options: ["Yes", "No"] },
    { name: "cpr", label: "CPR Certification", options: ["Yes", "No"] },
    { name: "license", label: "Valid Driver’s License", options: ["Yes", "No"] },
  ] },
  { title: "About you", fields: [
    { name: "interest", label: "Why are you interested in working at JPO?", type: "textarea", maxLength: 3000, wide: true },
    { name: "additional", label: "Is there anything else you would like us to know?", type: "textarea", maxLength: 3000, wide: true },
  ] },
];

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export const shifts = ["Morning", "Afternoon", "Evening", "Overnight"] as const;
export type ApplicationErrors = Record<string, string>;
export type ApplicationData = { fields: Record<string, string>; availability: string[]; acknowledgment: boolean };

// Shared validation has no environment access; the endpoint always runs it again.
export function validateApplication(input: unknown): { data: ApplicationData; errors: ApplicationErrors } {
  const raw = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  const errors: ApplicationErrors = {};
  const fields: Record<string, string> = {};
  for (const field of applicationSections.flatMap(section => section.fields)) {
    const value = raw[field.name];
    if (value !== undefined && typeof value !== "string") errors[field.name] = "Enter a valid value.";
    const text = typeof value === "string" ? value.trim() : "";
    fields[field.name] = text;
    if (field.required && !text) errors[field.name] = `${field.label} is required.`;
    if (text.length > (field.maxLength ?? 160)) errors[field.name] = `Use no more than ${field.maxLength ?? 160} characters.`;
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text) || (field.type !== "textarea" && /[\r\n]/.test(text))) errors[field.name] = "Remove unsupported characters.";
    if (text && field.options && !field.options.includes(text)) errors[field.name] = "Choose one of the listed options.";
  }
  if (fields.email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(fields.email)) errors.email = "Enter a valid email address.";
  if (fields.phone && (!/^[+\d().\s\-xext]+$/i.test(fields.phone) || fields.phone.replace(/\D/g, "").length < 7)) errors.phone = "Enter a valid phone number, including area code.";
  if (fields.zip && !/^\d{5}(?:-\d{4})?$/.test(fields.zip)) errors.zip = "Enter a five-digit ZIP code or ZIP+4.";
  if (fields.years && (!/^\d+(\.\d)?$/.test(fields.years) || Number(fields.years) > 80)) errors.years = "Enter a number from 0 to 80.";
  if (fields.startDate && (!/^\d{4}-\d{2}-\d{2}$/.test(fields.startDate) || !Number.isFinite(Date.parse(fields.startDate)) || new Date(fields.startDate).toISOString().slice(0, 10) !== fields.startDate)) errors.startDate = "Enter a valid start date.";
  const allowed = new Set(days.flatMap(day => shifts.map(shift => `${day}: ${shift}`)));
  const availability = Array.isArray(raw.availability) ? raw.availability : [];
  if ((raw.availability !== undefined && !Array.isArray(raw.availability)) || availability.length > 28 || availability.some(value => typeof value !== "string" || !allowed.has(value))) errors.availability = "Choose availability from the days and times listed.";
  if (raw.acknowledgment !== true) errors.acknowledgment = "Please confirm that your information is accurate.";
  return { data: { fields, availability: [...new Set(availability.filter((v): v is string => typeof v === "string" && allowed.has(v)))], acknowledgment: raw.acknowledgment === true }, errors };
}

export function applicationEmail(data: ApplicationData): string {
  const sections = applicationSections.map(section => {
    const lines = section.fields.map(field => `${field.label}:\n${data.fields[field.name] || "Not provided"}`);
    if (section.title === "Employment information") lines.push(`Availability:\n${data.availability.join("\n") || "Not provided"}`);
    return `${section.title.toUpperCase()}\n\n${lines.join("\n\n")}`;
  });
  return `NEW JPO EMPLOYMENT APPLICATION\n\n${sections.join("\n\n--------------------\n\n")}\n\nACKNOWLEDGMENT\nApplicant certified that the information is accurate to the best of their knowledge.`;
}
