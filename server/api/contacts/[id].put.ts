import { updateContact } from "~~/server/services/contactsService";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  const body = await readBody(event);
  const contact = updateContact(id, body);
  if (!contact)
    throw createError({ statusCode: 404, message: "Contact not found" });
  return contact;
});
