import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string('Email Required').email(),
  password: z.string('Password Required').min(8)
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
