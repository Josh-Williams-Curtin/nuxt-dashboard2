import { getContacts } from "~~/server/services/contactsService";

export default defineEventHandler(() => {
  return getContacts();
});
