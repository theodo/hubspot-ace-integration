import { IsOppFromMarketingActivity } from "@libs/constants/ace/marketing";
import { AceFileOpportunityInbound } from "@libs/types";

export const aceOpportunityMock: AceFileOpportunityInbound = {
  version: "1",
  spmsId: "1588143",
  opportunities: [
    {
      customerCompanyName: "",
      country: "France",
      postalCode: "75017",
      customerWebsite: "client.fr",
      industry: "other",
      primaryContactLastName: "Gauvrit",
      primaryContactFirstName: "Adèle",
      primaryContactEmail: "adeleg@theodo.fr",
      projectDescription: "OPPORTUNITE AWS M33 GROUP - DESCRIPTION A VENIR",
      status: "Draft",
      stage: "Qualified",
      customerTitle: "",
      customerPhone: "",
      customerLastName: "",
      customerFirstName: "",
      customerEmail: "",
      partnerProjectTitle: "TEST ACE 3",
      deliveryModel: "Managed Services",
      expectedMonthlyAwsRevenue: 100,
      partnerPrimaryNeedFromAws: "For Visibility - No Assistance Needed",
      targetCloseDate: "2022-04-27",
      partnerCrmUniqueIdentifier: "8665646438",
      useCase: "Containers & Serverless",
      IsOppFromMarketingActivity: IsOppFromMarketingActivity.No,
    },
  ],
};
