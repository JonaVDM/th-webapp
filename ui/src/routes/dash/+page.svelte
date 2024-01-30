<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { currentUser, pb } from '$lib/pocketbase';
  import { setError, setMessage, superForm } from 'sveltekit-superforms/client';
  import { _schema } from './+page';
  import type { ClientResponseError } from 'pocketbase';
  import TextInput from '$lib/inputs/TextInput.svelte';
  import { get } from 'svelte/store';

  export let data;

  const form = superForm(data.form, {
    SPA: true,
    validators: _schema,
    invalidateAll: false,
    async onUpdate({ form }) {
      if (!form.valid) {
        return;
      }

      let id = get(currentUser)?.id;

      try {
        await pb.collection('notes').create({ ...form.data, user: id });

        invalidateAll();
      } catch (e) {
        const err = e as ClientResponseError;

        setMessage(form, err.data.message);
        for (const k in err.response.data) {
          setError(form, k, err.response.data[k].message);
        }

        return;
      }
    },
  });
  const { message, enhance } = form;

  function logout() {
    pb.authStore.clear();
    invalidateAll();
  }

  function removeNote(id: string) {
    pb.collection('notes').delete(id);
    invalidateAll();
  }
</script>

<h1 class="font-light text-2xl">Notes</h1>

<p>
  Current user: {$currentUser?.username}
  <button class="underline" on:click={logout}>Logout</button>
</p>

<form method="post" use:enhance>
  <p class="text-red">{$message}</p>
  <TextInput {form} label="Body" field="text" />
  <button class="underline">Create</button>
</form>

<div class="py-4">
  {#each data.notes as note}
    <div class="border-y py-4 flex justify-between">
      <p>{note.text}</p>
      <button on:click={() => removeNote(note.id)}>x</button>
    </div>
  {/each}
</div>
