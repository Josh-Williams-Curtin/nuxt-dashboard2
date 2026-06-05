import { deleteContact } from "~~/server/services/contactsService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ok = await deleteContact(id)
  if (!ok) throw createError({ statusCode: 404, message: 'Contact not found' })
  return { success: true }
})
