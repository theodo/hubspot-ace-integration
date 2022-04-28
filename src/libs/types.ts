import { EventBridgeEvent } from "aws-lambda/trigger/eventbridge";

import { AceIndustry } from "@libs/constants/ace/industry";

import { AceStage } from "./constants/ace/stage";

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
  updatedByUserId?: number | null;
}

export type WebhookEventBridgeEvent = EventBridgeEvent<
  "Webhook",
  HubspotWebhook<HubspotValue>
>;

export type WebhookEventBridgeEventWrapped = EventBridgeEvent<
  "Webhook",
  HubspotWebhook<string>
>;

// Hubspot defined properties
export type HubspotDeal<T> = {
  dealname: T;
  pipeline: T;
  dealstage: T;
} & Partial<{
  closedate: T;
  hs_analytics_source: T;
  hs_analytics_source_data_1: T;
  hs_analytics_source_data_2: T;
  hs_lastmodifieddate: T;
  amount: T;
  amount_in_home_currency: T;
  closed_lost_reason: T;
  closed_won_reason: T;
  createdate: T;
  description: T;
  engagements_last_meeting_booked: T;
  engagements_last_meeting_booked_campaign: T;
  engagements_last_meeting_booked_medium: T;
  engagements_last_meeting_booked_source: T;
  hs_acv: T;
  hs_arr: T;
  hs_deal_stage_probability: T;
  hs_forecast_amount: T;
  hs_forecast_probability: T;
  hs_manual_forecast_category: T;
  hs_mrr: T;
  hs_next_step: T;
  hs_object_id: T;
  hs_priority: T;
  hs_projected_amount: T;
  hs_projected_amount_in_home_currency: T;
  hs_tcv: T;
  hubspot_owner_assigneddate: T;
  hubspot_owner_id: T;
  hubspot_team_id: T;
  notes_last_contacted: T;
  notes_last_updated: T;
  notes_next_activity_date: T;
  num_associated_contacts: T;
  num_contacted_notes: T;
  num_notes: T;
}> &
  Record<string, T>;

// Hubspot defined properties
export type HubspotCompany = {
  domain: string;
  name: string;
} & Partial<{
  days_to_close: string;
  hs_analytics_first_timestamp: string;
  hs_analytics_first_touch_converting_campaign: string;
  hs_analytics_first_visit_timestamp: string;
  hs_analytics_last_timestamp: string;
  hs_analytics_last_touch_converting_campaign: string;
  hs_analytics_last_visit_timestamp: string;
  hs_analytics_num_page_views: string;
  hs_analytics_num_visits: string;
  hs_analytics_source: string;
  hs_analytics_source_data_1: string;
  hs_analytics_source_data_2: string;
  hs_lastmodifieddate: string;
  about_us: string;
  address: string;
  address2: string;
  annualrevenue: string;
  city: string;
  closedate: string;
  country: string;
  createdate: string;
  description: string;
  engagements_last_meeting_booked: string;
  engagements_last_meeting_booked_campaign: string;
  engagements_last_meeting_booked_medium: string;
  engagements_last_meeting_booked_source: string;
  first_contact_createdate: string;
  first_deal_created_date: string;
  founded_year: string;
  hs_createdate: string;
  hs_last_booked_meeting_date: string;
  hs_last_logged_call_date: string;
  hs_last_open_task_date: string;
  hs_last_sales_activity_timestamp: string;
  hs_lead_status: string;
  hs_num_child_companies: string;
  hs_num_open_deals: string;
  hs_object_id: string;
  hs_parent_company_id: string;
  hs_total_deal_value: string;
  hubspot_owner_assigneddate: string;
  hubspot_owner_id: string;
  hubspot_team_id: string;
  industry: string;
  is_public: string;
  lifecyclestage: string;
  notes_last_contacted: string;
  notes_last_updated: string;
  notes_next_activity_date: string;
  num_associated_contacts: string;
  num_associated_deals: string;
  num_contacted_notes: string;
  numberofemployees: string;
  phone: string;
  recent_deal_amount: string;
  recent_deal_close_date: string;
  state: string;
  timezone: string;
  total_money_raised: string;
  total_revenue: string;
  type: string;
  web_technologies: string;
  website: string;
  zip: string;
  first_conversion_date: string;
  first_conversion_event_name: string;
  num_conversion_events: string;
  recent_conversion_date: string;
  recent_conversion_event_name: string;
  facebook_company_page: string;
  facebookfans: string;
  googleplus_page: string;
  linkedin_company_page: string;
  linkedinbio: string;
  twitterbio: string;
  twitterfollowers: string;
  twitterhandle: string;
  hs_ideal_customer_profile: string;
  hs_is_target_account: string;
  hs_num_blockers: string;
  hs_num_contacts_with_buying_roles: string;
  hs_num_decision_makers: string;
}> &
  Record<string, string>;

export interface HubspotWebhook<T> {
  portalId: number;
  objectType: string;
  objectTypeId: string;
  objectId: number;
  properties: HubspotDeal<T>;
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

export const hubspotToAceIndustryMapping: Record<string, AceIndustry> = {
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

export interface Deal {
  apnCrmUniqueidentifier: string;
}

export const hubspotToAceStageMapping: Record<string, AceStage> = {
  "34facc48-0dd1-4e2c-abc8-e88ea6b8889c": AceStage.Prospect,
  "5107775": AceStage.Qualified,
  presentationscheduled: AceStage.ClosedLost,
  "1057888": AceStage.Prospect,
  qualifiedtobuy: AceStage.Qualified,
  closedwon: AceStage.BusinessValidation,
  "982695": AceStage.ClosedLost,
  appointmentscheduled: AceStage.Committed,
  "1573504": AceStage.Launched,
};

export const aceToHubspotStageMapping = {
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
