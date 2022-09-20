import moment from "moment";

import { AceFileOpportunityInbound, HubspotWebhook } from "@libs/types";
import { hubspotToAceIndustryMapping } from "@libs/types";
import { AceIndustry } from "@libs/constants/ace/industry";
import { DEFAULT_ACE_STAGE } from "@libs/constants/ace/stage";

import { getDealCompany, getDealNotes, getOwner } from "./hubspot";

export const createOpportunityObject = async (
  event: HubspotWebhook<string>
): Promise<AceFileOpportunityInbound> => {
  const { objectId: dealId, properties: dealProperties } = event;
  const { hubspot_owner_id, identifiant_ace } = dealProperties;

  const [notes, company, owner] = await Promise.all([
    getDealNotes(dealId),
    getDealCompany(dealId, dealProperties),
    getOwner(hubspot_owner_id),
  ]);

  // company
  const {
    name: customerCompanyName = event.properties.dealname,
    country = "FR",
    zip: postalCode = "75017",
    domain: customerWebsite,
    secteur_gics: hubspotIndustry,
  } = company;

  // owner
  const {
    lastName: primaryContactLastName,
    firstName: primaryContactFirstName,
    email: primaryContactEmail,
  } = owner;

  let aceIndustry: AceIndustry = AceIndustry.Other;
  if (hubspotIndustry) {
    aceIndustry =
      hubspotToAceIndustryMapping[hubspotIndustry] || AceIndustry.Other;
  }

  return {
    version: "1",
    spmsId: process.env.SPMS_ID as string,
    opportunities: [
      {
        useCase: "Containers & Serverless",
        targetCloseDate: (event.properties.closedate
          ? moment(parseInt(event.properties.closedate))
          : moment().add({ days: 7 })
        ).format("YYYY-MM-DD"),
        projectDescription: notes,
        postalCode,
        partnerProjectTitle: event.properties.dealname,
        partnerPrimaryNeedFromAws: "For Visibility - No Assistance Needed",
        partnerCrmUniqueIdentifier: dealId.toString(),
        industry: aceIndustry,
        expectedMonthlyAwsRevenue: 100.0,
        deliveryModel: "Managed Services",
        customerWebsite,
        customerCompanyName,
        country,

        // We test only on Draft status & Prospect stage for now
        status: "Draft",
        // stage: hubspotToAceStageMapping[dealstage] || DEFAULT_ACE_STAGE,
        stage: DEFAULT_ACE_STAGE,

        // contact
        primaryContactLastName,
        primaryContactFirstName,
        primaryContactEmail,

        // Update instead of create if opportunity already exists
        apnCrmUniqueIdentifier: identifiant_ace,

        // Temporary, for Prospecting league
        additionalComments:
          "EMEA-Partner-FY22-MKT-PPL-FR-Sept-Migration-Multi-partner",
      },
    ],
  };
};
