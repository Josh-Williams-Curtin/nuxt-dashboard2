import { deleteContact } from "~~/server/services/contactsService";

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, "id"));
  const ok = deleteContact(id);
  if (!ok) throw createError({ statusCode: 404, message: "Contact not found" });
  return { success: true };
});
