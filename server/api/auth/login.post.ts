import bcrypt from 'bcryptjs'
import { loginSchema } from '~~/shared/utils/validators'
import { getUserByEmail } from '~~/server/services/usersService'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = loginSchema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, message: result.error.issues[0]?.message ?? 'Invalid input' })
  }
  const user = await getUserByEmail(result.data.email)
  if (!user || !bcrypt.compareSync(result.data.password, user.passwordHash)) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }
  await setUserSession(event, { user: { id: user.id, email: user.email, name: user.name } })
  return { ok: true }
})
