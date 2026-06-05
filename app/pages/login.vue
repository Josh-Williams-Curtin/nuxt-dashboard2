<script setup lang="ts">
import { loginSchema } from '~~/shared/utils/validators'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import type { LoginSchema } from '~~/shared/utils/validators'

const { fetch: fetchSession } = useUserSession()
const toast = useToast()

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'you@example.com',
    defaultValue: 'admin@example.com'
  },
  { name: 'password', type: 'password', label: 'Password', defaultValue: 'password123' },
  {
    name: 'remember',
    label: 'Remember me',
    type: 'checkbox',
    defaultValue: true
  }
]

async function onSubmit(payload: FormSubmitEvent<LoginSchema>) {
  try {
    console.log('payload:', payload)
    await $fetch('/api/auth/login', { method: 'POST', body: payload.data })
    await fetchSession()
    await navigateTo('/')
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    toast.add({
      title: 'Login failed',
      description: err.data?.message ?? 'Something went wrong',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="loginSchema"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>
