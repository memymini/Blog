import { z } from "zod";

export const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tech: z.string().transform((str) =>
    str
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  ), // Comma separated string -> array
  link: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  image: z.string().optional(),
  period: z.string().optional(),
  detail: z.string().optional(), // JSON string
  order: z.number().optional(),
});

export type ProjectFormData = z.infer<typeof ProjectSchema>;
