import { writable } from 'svelte/store';
import PocketBase from 'pocketbase'
import type { TypedPocketBase } from './pocketTypes';

export const pb = new PocketBase('/') as TypedPocketBase;

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange(() => {
  currentUser.set(pb.authStore.model);
});
