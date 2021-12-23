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
    hubspot_owner_id: {
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
  secteur_gics: string | undefined;
  country: string | undefined;
  domain: string | undefined;
  zip: string | undefined;
  name: string | undefined;
}

export const industryHubspotToAceMappingObject = {
  "": "Other and other",
  Energy: "Power and Utilities",
  "Bien d'équipement d'industrie": "Manufacturing",
  "Fabrication de Matériaux": "Manufacturing",
  "Services Commerciaux et Professionnels": "Professional Services",
  Transports: "Transportation",
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
  "Logiciels et services IT": "Software and internet",
  "Matériel IT": "Software and internet",
  "Semi-conducteurs": "Manufacturing",
  Télécommunication: "Telecommunication",
  "Services aux collectivités": "Professional Services",
};

export const companyPorpertiesNeeded = [
  "secteur_gics",
  "country",
  "zip",
  "name",
  "domain",
];
