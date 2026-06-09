import { createItem } from '~~/server/services/pillarsTreeService'

export default defineEventHandler(async (event) => {
  const { type, parentSymbol, symbol, name, order } = await readBody(event)
  return createItem(type, parentSymbol, symbol, name, order)
})
