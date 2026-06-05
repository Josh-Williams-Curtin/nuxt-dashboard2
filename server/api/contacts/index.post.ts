import { createContact } from '~~/server/services/contactsService'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = contactSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.issues[0]?.message ?? 'Invalid input'
    })
  }
  return createContact(result.data)
})
