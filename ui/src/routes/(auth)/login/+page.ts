import { z } from 'zod';
import type { PageLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/client';

export const _schema = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
});

export const load: PageLoad = async () => {
  const form = await superValidate(_schema);
  return { form };
}
