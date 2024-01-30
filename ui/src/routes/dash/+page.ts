import { pb } from '$lib/pocketbase';
import { z } from 'zod';
import type { PageLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/client';

export const _schema = z.object({
  text: z.string().min(1),
});

export const load: PageLoad = async ({ fetch }) => {
  return {
    notes: await pb.collection('notes').getFullList({ fetch, sort: '+created' }),
    form: await superValidate(_schema),
  }
}
