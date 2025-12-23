import { z } from "zod";

export const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(), // Generated if empty, or can be required
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  readTime: z.string().optional(),
  image: z.string().optional(),
  published: z.boolean().default(false),
});

export type PostFormData = z.infer<typeof PostSchema>;
