import { z } from "zod";

// Shared schema: imported by the client form (for inline validation) and
// the API route (for server-side validation, which is the one that
// actually matters for security — client validation is UX only).
export const SERVICE_TYPES = [
  { value: "COMMUNITY_MANAGEMENT", label: "Community Management" },
  { value: "MODERATOR", label: "Moderator" },
  { value: "AMBASSADOR", label: "Ambassador" },
  { value: "CONTENT_CREATION", label: "Content Creation" },
  { value: "GRAPHIC_DESIGN", label: "Graphic Design" },
  { value: "SOCIAL_MEDIA_MANAGEMENT", label: "Social Media Management" },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "OTHER", label: "Other" },
] as const;

const serviceValues = SERVICE_TYPES.map((s) => s.value) as [
  string,
  ...string[]
];

export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  telegramHandle: z
    .string()
    .trim()
    .max(60)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  projectName: z.string().trim().min(2, "Enter your project name").max(150),
  projectWebsite: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  serviceType: z.enum(serviceValues, {
    errorMap: () => ({ message: "Select a service type" }),
  }),
  budget: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  deadline: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  description: z
    .string()
    .trim()
    .min(20, "Please provide a bit more detail (min 20 characters)")
    .max(4000),
  // Honeypot field — real users never fill this in; bots that
  // auto-fill every input will, letting us silently drop the submission.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
