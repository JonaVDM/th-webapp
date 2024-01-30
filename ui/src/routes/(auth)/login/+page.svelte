<script lang="ts">
  import { setError, setMessage, superForm } from 'sveltekit-superforms/client';
  import type { PageData } from './$types';
  import TextInput from '$lib/inputs/TextInput.svelte';
  import { _schema } from './+page';
  import { pb } from '$lib/pocketbase';
  import type { ClientResponseError } from 'pocketbase';
  import { goto } from '$app/navigation';

  export let data: PageData;

  const form = superForm(data.form, {
    SPA: true,
    validators: _schema,
    invalidateAll: false,
    async onUpdate({ form }) {
      if (!form.valid) {
        return;
      }

      try {
        await pb
          .collection('users')
          .authWithPassword(form.data.email, form.data.password);
      } catch (e) {
        const err = e as ClientResponseError;

        setMessage(form, err.data.message);
        for (const k in err.response.data) {
          setError(form, k, err.response.data[k].message);
        }

        return;
      }

      goto('/dash');
    },
  });

  const { message, enhance } = form;
</script>

<form method="post" use:enhance>
  <p>
    Not an account yet?
    <a href="/signup" class="link link-primary">Sign up</a>
  </p>

  {#if $message}
    <div class="alert alert-error my-4">
      <span>{$message}</span>
    </div>
  {/if}

  <TextInput label="Email" field="email" {form} />
  <TextInput type="password" label="Password" field="password" {form} />

  <button class="btn btn-primary">Login</button>
</form>
