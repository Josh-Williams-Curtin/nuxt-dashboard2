import { reorderTree, type ReorderData } from '~~/server/services/pillarsService'

export default defineEventHandler(async (event) => {
  const body = await readBody<ReorderData>(event)
  await reorderTree(body)
  return { success: true }
})
