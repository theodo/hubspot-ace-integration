import { EventBridgeEvent } from "aws-lambda/trigger/eventbridge";

export type WebhookEventBridgeEvent = EventBridgeEvent<
  "Webhook",
  HubspotWebhook<stringValue>
>;

export type WebhookEventBridgeEventSimplified = EventBridgeEvent<
  "Webhook",
  HubspotWebhook<string>
>;

interface stringValue {
  value: string;
}

export interface Properties<T> {
  dealname: T;
  closedate: T;
  hubspot_owner_id: T;
}

export interface HubspotWebhook<T> {
  portalId: number;
  objectType: string;
  objectTypeId: string;
  objectId: string;
  properties: Properties<T>;
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
  secteur_gics: string | undefined;
  country: string | undefined;
  domain: string | undefined;
  zip: string | undefined;
  name: string | undefined;
}

export const industryHubspotToAceMappingObject = {
  "": "Other and other",
  Energie: "Power and Utilities",
  "Bien d'équipement industrie": "Manufacturing",
  "Fabrication de Matériaux": "Manufacturing",
  "Services Commerciaux et Professionnels": "Professional Services",
  Transports: "Transportation & Logistics",
  Automobile: "Automotive",
  "Biens de consommation durable et habillement": "Consumer Goods",
  "Services consommateurs": "Professional Services",
  Médias: "Media & Entertainment",
  "Vente au détail": "Wholesale & Distribution",
  "Vente au détail de produits alimentaires": "Wholesale & Distribution",
  "Produits Alimentaires, Boissons et Tabac": "Consumer Goods",
  "Produits domestiques et de soins personnels": "Consumer Goods",
  "Equipements et services de santé": "Healthcare",
  "Pharmaceutique et biotechnologies": "Healthcare",
  Banque: "Financial Services",
  "Services financiers": "Financial Services",
  Assurance: "Financial Services",
  Immobilier: "Real Estate & Construction",
  "Logiciels et services IT": "Software & Internet",
  "Matériel IT": "Software & Internet",
  "Semi-conducteurs": "Manufacturing",
  Télécommunication: "Telecommunications",
  "Services aux collectivités": "Professional Services",
};

export const companyPorpertiesNeeded = [
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
