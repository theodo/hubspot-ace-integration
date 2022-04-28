import defaults from "lodash/defaults";

import { hubspotClient } from "@libs/hubspot/client";
import type { HubspotCompany, HubspotDeal } from "@libs/types";
import { companyPropertiesNeeded } from "@libs/types";

export const getDealCompany = async (
  dealId: number,
  deal: HubspotDeal<string>
): Promise<HubspotCompany> => {
  const {
    body: { results: companies },
  } = await hubspotClient.crm.deals.associationsApi.getAll(
    dealId.toString(),
    "Companies"
  );

  const defaultHubspotCompany: HubspotCompany = {
    name: deal.dealname,
    domain: "client.fr",
    country: "France",
    zip: "75017",
  };

  const [company] = companies;

  if (!company) {
    return defaultHubspotCompany;
  }

  const { id: companyId } = company;

  const {
    body: { properties: fetchedCompany },
  } = await hubspotClient.crm.companies.basicApi.getById(
    companyId,
    companyPropertiesNeeded
  );

  return defaults(fetchedCompany, defaultHubspotCompany);
};
