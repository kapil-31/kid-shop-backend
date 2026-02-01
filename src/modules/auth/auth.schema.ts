import { z } from "zod";

export const authSchema = z.object({
  email: z.string('Email Required').email(),
  password: z.string('Password Required').min(8),
  rememberMe:z.undefined().or(z.boolean())
});

export type authSchema = z.infer<typeof authSchema>;
