import type { PublicOwner } from "@hubspot/api-client/lib/codegen/crm/owners/api";

import { hubspotClient } from "./client";

export const getOwner = async (ownerId: string): Promise<PublicOwner> => {
  const { body: ownder } = await hubspotClient.crm.owners.ownersApi.getById(
    parseInt(ownerId)
  );

  return ownder;
};
