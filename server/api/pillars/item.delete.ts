import { deleteItem } from '~~/server/services/pillarsTreeService'

export default defineEventHandler(async (event) => {
  const { type, symbol } = await readBody(event)
  return await deleteItem(type, symbol)
})
