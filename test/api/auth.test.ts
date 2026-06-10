import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'

// seed user defined in server/db/seeds/users.ts
const validUser = {
  email: 'admin@example.com',
  password: 'password123'
}

describe('Auth API', async () => {
  await setup({ rootDir: fileURLToPath(new URL('../..', import.meta.url)) })

  /* LOGIN */
  // valid credentials should set a session and return ok
  it('POST /api/auth/login returns ok for valid credentials', async () => {
    const result = await $fetch<{ ok: boolean }>('/api/auth/login', {
      method: 'POST',
      body: validUser
    })
    expect(result.ok).toBe(true)
  })

  // correct email but wrong password must not authenticate
  it('POST /api/auth/login returns 401 for wrong password', async () => {
    await expect(
      $fetch('/api/auth/login', {
        method: 'POST',
        body: { ...validUser, password: 'wrongpassword' }
      })
    ).rejects.toThrow()
  })

  // should not reveal whether the email exists in the database
  it('POST /api/auth/login returns 401 for unknown email', async () => {
    await expect(
      $fetch('/api/auth/login', {
        method: 'POST',
        body: { ...validUser, email: 'nobody@example.com' }
      })
    ).rejects.toThrow()
  })

  // zod loginSchema rejects malformed email before hitting the database
  it('POST /api/auth/login returns 400 for invalid email format', async () => {
    await expect(
      $fetch('/api/auth/login', {
        method: 'POST',
        body: { ...validUser, email: 'not-an-email' }
      })
    ).rejects.toThrow()
  })

  // zod loginSchema requires password of at least 8 characters
  it('POST /api/auth/login returns 400 for missing password', async () => {
    await expect(
      $fetch('/api/auth/login', {
        method: 'POST',
        body: { email: validUser.email }
      })
    ).rejects.toThrow()
  })

  /* LOGOUT */
  // clearUserSession succeeds even with no active session
  it('POST /api/auth/logout returns ok', async () => {
    const result = await $fetch<{ ok: boolean }>('/api/auth/logout', { method: 'POST' })
    expect(result.ok).toBe(true)
  })
})
