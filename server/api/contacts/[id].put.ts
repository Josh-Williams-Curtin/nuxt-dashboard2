import { updateContact } from '~~/server/services/contactsService'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const result = contactSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.issues[0]?.message ?? 'Invalid input'
    })
  }
  const contact = updateContact(id, result.data)
  if (!contact) throw createError({ statusCode: 404, message: 'Contact not found' })
  return contact
})
