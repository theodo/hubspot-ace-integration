import moment from "moment";

import { AceFileOpportunityInbound, HubspotWebhook } from "@libs/types";
import {
  hubspotToAceIndustryMapping,
  hubspotToAceStageMapping,
} from "@libs/types";
import { AceIndustry } from "@libs/constants/ace/industry";
import { DEFAULT_ACE_STAGE } from "@libs/constants/ace/stage";

import { getDealCompany, getDealNotes, getOwner } from "./hubspot";

export const createOpportunityObject = async (
  event: HubspotWebhook<string>
): Promise<AceFileOpportunityInbound> => {
  const { objectId: dealId, properties: dealProperties } = event;
  const { hubspot_owner_id, dealstage } = dealProperties;

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
        // company
        customerCompanyName,
        country,
        postalCode,
        customerWebsite,
        industry: aceIndustry,

        // owner
        primaryContactLastName,
        primaryContactFirstName,
        primaryContactEmail,

        // notes
        projectDescription: notes,

        status: "Draft",
        stage: hubspotToAceStageMapping[dealstage] || DEFAULT_ACE_STAGE,

        // We do not want to give customer data but have to provide keys
        customerTitle: "",
        customerPhone: "",
        customerLastName: "",
        customerFirstName: "",
        customerEmail: "",

        partnerProjectTitle: event.properties.dealname,
        deliveryModel: "Managed Services",
        expectedMonthlyAwsRevenue: 100.0,
        partnerPrimaryNeedFromAws: "For Visibility - No Assistance Needed",

        targetCloseDate: (event.properties.closedate
          ? moment(parseInt(event.properties.closedate))
          : moment().add({ days: 7 })
        ).format("YYYY-MM-DD"),

        partnerCrmUniqueIdentifier: dealId.toString(),
        useCase: "Containers & Serverless",
      },
    ],
  };
};
