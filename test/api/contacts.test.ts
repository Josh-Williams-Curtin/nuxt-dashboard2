import { describe, it, expect, afterAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import type { Contact } from '../../shared/types/contact'

const testContact = {
  name: 'Test Contact',
  email: 'test@example.com',
  phone: '0400000000',
  status: 'active' as const
}

const updatedContact = {
  name: 'Updated Contact',
  email: 'updated@example.com',
  phone: '0411111111',
  status: 'inactive' as const
}

describe('Contacts API', async () => {
  await setup({ rootDir: fileURLToPath(new URL('../..', import.meta.url)) })

  let id: string

  /* CREATE */
  // id is assigned by the database; save it for subsequent tests
  it('POST /api/contacts creates a contact', async () => {
    const contact = await $fetch<Contact>('/api/contacts', {
      method: 'POST',
      body: testContact
    })
    expect(contact.name).toBe(testContact.name)
    expect(contact.email).toBe(testContact.email)
    expect(contact.id).toBeDefined()
    id = contact.id
  })

  // empty name and malformed email should both fail zod validation
  it('POST /api/contacts returns 400 for invalid body', async () => {
    await expect(
      $fetch('/api/contacts', { method: 'POST', body: { name: '', email: 'not-an-email' } })
    ).rejects.toThrow()
  })

  /* READ */
  // should include the contact just created, not just any non-empty array
  it('GET /api/contacts returns array including new contact', async () => {
    const contacts = await $fetch<Contact[]>('/api/contacts')
    expect(Array.isArray(contacts)).toBe(true)
    expect(contacts.some((c) => c.id === id)).toBe(true)
  })

  // round-trip: fetched fields should match what was posted
  it('GET /api/contacts/:id returns the contact', async () => {
    const contact = await $fetch<Contact>(`/api/contacts/${id}`)
    expect(contact.id).toBe(id)
    expect(contact.name).toBe(testContact.name)
  })

  // nil UUID is valid format but will never match a real row
  it('GET /api/contacts/:id returns 404 for unknown id', async () => {
    await expect($fetch('/api/contacts/00000000-0000-0000-0000-000000000000')).rejects.toThrow()
  })

  /* UPDATE */
  // verifies both field update and status change active → inactive
  it('PUT /api/contacts/:id updates the contact', async () => {
    const updated = await $fetch<Contact>(`/api/contacts/${id}`, {
      method: 'PUT',
      body: updatedContact
    })
    expect(updated.name).toBe(updatedContact.name)
    expect(updated.status).toBe(updatedContact.status)
  })

  it('PUT /api/contacts/:id returns 404 for unknown id', async () => {
    await expect(
      $fetch('/api/contacts/00000000-0000-0000-0000-000000000000', {
        method: 'PUT',
        body: updatedContact
      })
    ).rejects.toThrow()
  })

  /* DELETE */
  // success flag confirms the row was found and removed
  it('DELETE /api/contacts/:id deletes the contact', async () => {
    const result = await $fetch<{ success: boolean }>(`/api/contacts/${id}`, { method: 'DELETE' })
    expect(result.success).toBe(true)
  })

  // contact should no longer be reachable after deletion
  it('GET /api/contacts/:id returns 404 after delete', async () => {
    await expect($fetch(`/api/contacts/${id}`)).rejects.toThrow()
  })

  it('DELETE /api/contacts/:id returns 404 for unknown id', async () => {
    await expect(
      $fetch('/api/contacts/00000000-0000-0000-0000-000000000000', { method: 'DELETE' })
    ).rejects.toThrow()
  })

  afterAll(async () => {
    // safety net in case the delete test didn't run
    if (id) await $fetch(`/api/contacts/${id}`, { method: 'DELETE' }).catch(() => {})
  })
})
