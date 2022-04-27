import moment from "moment";

import type { AceFileOpportunityInbound, HubspotWebhook } from "@libs/types";
import {
  hubspotToAceIndustryMappingObject,
  stagesHubspotToAceMappingObject,
} from "@libs/types";

import { getDealCompany, getDealNotes, getOwner } from "./hubspot";

export const createOpportunityObject = async (
  event: HubspotWebhook<string>
): Promise<AceFileOpportunityInbound> => {
  const {
    objectId: dealId,
    properties: { hubspot_owner_id, identifiant_ace, dealstage },
  } = event;

  const [notes, company, owner] = await Promise.all([
    getDealNotes(dealId),
    getDealCompany(dealId),
    getOwner(hubspot_owner_id),
  ]);

  // company
  const {
    name: customerCompanyName = event.properties.dealname,
    country,
    zip: postalCode,
    domain: customerWebsite,
    secteur_gics: hubspotIndustry,
  } = company;

  // owner
  const {
    lastName: primaryContactLastName,
    firstName: primaryContactFirstName,
    email: primaryContactEmail,
  } = owner;

  return {
    version: "1",
    spmsId: process.env.SPMS_ID,
    opportunities: [
      {
        // company
        customerCompanyName,
        country,
        postalCode,
        customerWebsite,
        industry: hubspotToAceIndustryMappingObject[hubspotIndustry],

        // owner
        primaryContactLastName,
        primaryContactFirstName,
        primaryContactEmail,

        // notes
        projectDescription: notes,

        status: !identifiant_ace && "Draft",
        stage: stagesHubspotToAceMappingObject[dealstage],
        customerTitle: "",
        customerPhone: "",
        customerLastName: "",
        customerFirstName: "",
        customerEmail: "",
        partnerProjectTitle: event.properties.dealname,
        deliveryModel: "Managed Services",
        expectedMonthlyAwsRevenue: 100.0,
        partnerPrimaryNeedFromAws: "For Visibility - No Assistance Needed",
        targetCloseDate: moment(parseInt(event.properties.closedate)).format(
          "YYYY-MM-DD"
        ),

        partnerCrmUniqueIdentifier: dealId.toString(),
        useCase: "Containers & Serverless",
      },
    ],
  };
};
