import { getContacts } from "~~/server/services/contactsService";

export default defineEventHandler(async () => {
  return getContacts()
})
