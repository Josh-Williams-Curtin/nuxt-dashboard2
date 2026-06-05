import { getContact } from "~~/server/services/contactsService";

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, "id"));
  const contact = getContact(id);
  if (!contact)
    throw createError({ statusCode: 404, message: "Contact not found" });
  return contact;
});
