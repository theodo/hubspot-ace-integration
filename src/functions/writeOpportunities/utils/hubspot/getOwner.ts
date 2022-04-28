import type { PublicOwner } from "@hubspot/api-client/lib/codegen/crm/owners/api";
import defaults from "lodash/defaults";

import { hubspotClient } from "@libs/hubspot/client";

const defaultOwner = {
  lastName: "Perennec",
  firstName: "Yann",
  email: "yannp@theodo.fr",
};

export const getOwner = async (
  ownerId: string | undefined
): Promise<Required<Pick<PublicOwner, "lastName" | "firstName" | "email">>> => {
  if (!ownerId) return defaultOwner;

  const { body: owner } = await hubspotClient.crm.owners.ownersApi.getById(
    parseInt(ownerId)
  );

  const { email, firstName, lastName } = owner;

  return defaults({ email, firstName, lastName }, defaultOwner);
};
