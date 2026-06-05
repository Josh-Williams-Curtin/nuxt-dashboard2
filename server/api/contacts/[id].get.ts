import { getContact } from "~~/server/services/contactsService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const contact = await getContact(id)
  if (!contact)
    throw createError({ statusCode: 404, message: 'Contact not found' })
  return contact
})
