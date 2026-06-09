import { deleteItem } from '~~/server/services/pillarsService'

export default defineEventHandler(async (event) => {
  const { type, symbol } = await readBody(event)
  return await deleteItem(type, symbol)
})
