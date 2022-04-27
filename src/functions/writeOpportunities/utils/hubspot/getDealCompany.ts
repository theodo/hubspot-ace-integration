import defaults from "lodash/defaults";

import { hubspotClient } from "@libs/hubspot/client";
import type { Company } from "@libs/types";
import { companyPropertiesNeeded } from "@libs/types";

export const getDealCompany = async (dealId: number): Promise<Company> => {
  const defaultCompany: Company = {
    secteur_gics: "",
    country: "France",
    domain: "client.fr",
    zip: "75017",
    name: "",
  };

  const {
    body: { results: companies },
  } = await hubspotClient.crm.deals.associationsApi.getAll(
    dealId.toString(),
    "Companies"
  );

  if (companies.length === 0) {
    return defaultCompany;
  }

  const [{ id: companyId }] = companies;

  if (!companyId) return undefined;

  const {
    body: { properties: fetchedCompany },
  } = await hubspotClient.crm.companies.basicApi.getById(
    companyId,
    companyPropertiesNeeded
  );

  return defaults(fetchedCompany, defaultCompany);
};
