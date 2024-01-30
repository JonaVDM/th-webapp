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
        await pb.collection('users').create(form.data);
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
    Already have an account?
    <a href="/login" class="link link-primary">Login</a>
  </p>

  {#if $message}
    <div class="alert alert-error my-4">
      <span>{$message}</span>
    </div>
  {/if}

  <TextInput {form} label="Username" field="username" />
  <TextInput {form} label="Email" field="email" />
  <TextInput {form} type="password" label="Password" field="password" />
  <TextInput
    {form}
    type="password"
    label="Repeat password"
    field="passwordConfirm"
  />

  <button class="btn btn-primary">Login</button>
</form>
