import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { pb } from '$lib/pocketbase';

export const load: LayoutLoad = () => {
  if (!pb.authStore.isValid) {
    throw redirect(303, "/login")
  }
}
