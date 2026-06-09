import { updateItem } from '~~/server/services/pillarsService'

export default defineEventHandler(async (event) => {
  const { type, symbol, name, order } = await readBody(event)
  return await updateItem(type, symbol, name, order)
})
