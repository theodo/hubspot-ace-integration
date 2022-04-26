import defaults from "lodash/defaults";

import type { Company } from "@libs/types";
import { companyPropertiesNeeded } from "@libs/types";

import { hubspotClient } from "./client";

export const getDealCompany = async (
  dealId: string | undefined
): Promise<Company> => {
  const defaultCompany: Company = {
    secteur_gics: "",
    country: "France",
    domain: "theodo.fr",
    zip: "75017",
    name: "",
  };

  const {
    body: { results: companies },
  } = await hubspotClient.crm.deals.associationsApi.getAll(dealId, "Companies");

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
