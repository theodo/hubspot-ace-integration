import { EventBridgeEvent } from "aws-lambda/trigger/eventbridge";

import { AceIndustry } from "@libs/constants/ace/industry";

interface HubspotValue {
  versions: {
    name: string;
    value: string;
    timestamp: number;
    sourceId: string;
    source: string;
    sourceVid: unknown[];
    requestId?: string;
    updatedByUserId?: number;
  }[];
  value: string;
  timestamp: number;
  source: string;
  sourceId: string;
  updatedByUserId?: number;
}

export type WebhookEventBridgeEvent = EventBridgeEvent<
  "Webhook",
  HubspotWebhook<HubspotValue>
>;

export type WebhookEventBridgeEventWrapped = EventBridgeEvent<
  "Webhook",
  HubspotWebhook<string>
>;

export interface HubspotWebhook<T> {
  portalId: number;
  objectType: string;
  objectTypeId: string;
  objectId: number;
  properties: Record<string, T>;
  version: number;
  secondaryIdentifier: null;
  isDeleted: boolean;
}

export interface AceFileOpportunityInbound {
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
  stage: string;
  country: string;
  postalCode: string;
  primaryContactLastName: string;
  primaryContactFirstName: string;
  primaryContactEmail: string;
  industry: string;
  projectDescription: string;
  partnerCrmUniqueIdentifier: string;
  useCase: string;
}

export interface Company {
  secteur_gics: string | undefined;
  country: string | undefined;
  domain: string | undefined;
  zip: string | undefined;
  name: string | undefined;
}

export const hubspotToAceIndustryMappingObject: Record<string, AceIndustry> = {
  "": AceIndustry.Other,
  Energie: AceIndustry["Power & Utilities"],
  "Bien d'équipement industrie": AceIndustry.Manufacturing,
  "Fabrication de Matériaux": AceIndustry.Manufacturing,
  "Services Commerciaux et Professionnels":
    AceIndustry["Professional Services"],
  Transports: AceIndustry["Transportation & Logistics"],
  Automobile: AceIndustry.Automotive,
  "Biens de consommation durable et habillement": AceIndustry["Consumer Goods"],
  "Services consommateurs": AceIndustry["Professional Services"],
  Médias: AceIndustry["Media & Entertainment"],
  "Vente au détail": AceIndustry["Wholesale & Distribution"],
  "Vente au détail de produits alimentaires":
    AceIndustry["Wholesale & Distribution"],
  "Produits Alimentaires, Boissons et Tabac": AceIndustry["Consumer Goods"],
  "Produits domestiques et de soins personnels": AceIndustry["Consumer Goods"],
  "Equipements et services de santé": AceIndustry.Healthcare,
  "Pharmaceutique et biotechnologies": AceIndustry.Healthcare,
  Banque: AceIndustry["Financial Services"],
  "Services financiers": AceIndustry["Financial Services"],
  Assurance: AceIndustry["Financial Services"],
  Immobilier: AceIndustry["Real Estate & Construction"],
  "Logiciels et services IT": AceIndustry["Software & Internet"],
  "Matériel IT": AceIndustry["Software & Internet"],
  "Semi-conducteurs": AceIndustry["Manufacturing"],
  Télécommunication: AceIndustry["Telecommunications"],
  "Services aux collectivités": AceIndustry["Professional Services"],
};

export const companyPropertiesNeeded = [
  "secteur_gics",
  "country",
  "zip",
  "name",
  "domain",
];

export const stageHubspotToAceMappingObject = {};

export interface Deal {
  apnCrmUniqueidentifier: string;
}

export const stagesHubspotToAceMappingObject = {
  "34facc48-0dd1-4e2c-abc8-e88ea6b8889c": "Prospect",
  "5107775": "Qualified",
  presentationscheduled: "Closed Lost",
  "1057888": "Prospect",
  qualifiedtobuy: "Qualified",
  closedwon: "Business Validation",
  "982695": "Closed Lost",
  appointmentscheduled: "Committed",
  "1573504": "Launched",
};

export const stagesAceToHubspotMappingObject = {
  Prospect: "34facc48-0dd1-4e2c-abc8-e88ea6b8889c",
  "Closed Lost": "presentationscheduled",
  Qualified: "qualifiedtobuy",
  "Business Validation": "closedwon",
  Committed: "appointmentscheduled",
  Launched: "1573504",
};

export interface OpportunityResult {
  success: string;
  spmsId: string;
  isApiError: boolean;
  inboundApiResults: InboundApiResult[];
  fileName: string;
  fileApnProcessedDT: string;
  apiErrors: string | null;
}

export interface InboundApiResult {
  warnings: string | null;
  partnerCrmUniqueIdentifier: string | null;
  isSuccess: boolean;
  errors: string | null;
  apnCrmUniqueIdentifier: string;
}
