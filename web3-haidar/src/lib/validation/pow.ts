import { z } from "zod";

export const powEntrySchema = z.object({
  section: z.enum(["ONGOING_JOB", "OTHER_GIG"]),
  category: z.string().trim().min(1, "Category is required").max(80),
  role: z.string().trim().min(1, "Role is required").max(80),
  projectName: z.string().trim().min(1, "Project name is required").max(150),
  description: z.string().trim().min(1, "Description is required").max(600),
  fullDetails: z
    .string()
    .trim()
    .max(8000)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  projectLink: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  status: z.enum(["ACTIVE", "COMPLETED", "WON", "ARCHIVED"]),
  eventDate: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  featured: z.coerce.boolean().optional().default(false),
  pinned: z.coerce.boolean().optional().default(false),
  hidden: z.coerce.boolean().optional().default(false),
});

export type PowEntryFormValues = z.infer<typeof powEntrySchema>;
