import { z } from 'zod';
import type { PageLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/client';

export const _schema = z.object({
  username: z.string().nonempty('Username cannot be empty'),
  email: z.string().email(),
  password: z.string().nonempty('Password cannot be empty'),
  passwordConfirm: z.string().nonempty(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ['passwordConfirm'],
});

export const load: PageLoad = async () => {
  const form = await superValidate(_schema);
  return { form };
}
