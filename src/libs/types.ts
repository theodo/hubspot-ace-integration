import { EventBridgeEvent } from 'aws-lambda/trigger/eventbridge';

export type WebhookEventBridgeEvent = EventBridgeEvent<
  'Webhook',
  HubspotWebhook
>;

export interface HubspotWebhook {
  portalId: number;
  objectType: string;
  objectTypeId: string;
  objectId: number;
  properties: Object;
  version: number;
  secondaryIdentifier: null;
  isDeleted: boolean
}