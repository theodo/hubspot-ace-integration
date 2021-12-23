import { EventBridgeEvent } from "aws-lambda/trigger/eventbridge";

export type WebhookEventBridgeEvent = EventBridgeEvent<
  "Webhook",
  HubspotWebhook
>;

export interface HubspotWebhook {
  portalId: number;
  objectType: string;
  objectTypeId: string;
  objectId: string;
  properties: {
    dealname: {
      value: string;
    };
    closedate: {
      value: string;
    };
  };
  version: number;
  secondaryIdentifier: null;
  isDeleted: boolean;
}

export interface AceFileOppurtunityInbound {
  version: string;
  spmsId: string;
  opportunities: Array<OpportunityInbound>;
}

export interface OpportunityInbound {
  status: string;
  customerCompanyName: string;
  customerTitle: string | undefined;
  customerPhone: string | undefined;
  customerLastName: string | undefined;
  customerFirstName: string | undefined;
  customerEmail: string | undefined;
  customerWebsite: string;
  partnerProjectTitle: string;
  deliveryModel: string;
  expectedMonthlyAwsRevenue: number;
  partnerPrimaryNeedFromAws: string;
  targetCloseDate: string;
}

export interface Company {
  industry: string | undefined;
  country: string | undefined;
  domain: string | undefined;
  zip: string | undefined;
  name: string | undefined;
}

export const companyPorpertiesNeeded = [
  "industry",
  "country",
  "zip",
  "name",
  "domain",
];
