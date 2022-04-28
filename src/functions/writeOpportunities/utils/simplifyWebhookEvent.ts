import type {
  HubspotDeal,
  WebhookEventBridgeEvent,
  WebhookEventBridgeEventWrapped,
} from "@libs/types";

export const simplifyWebhookEvent = (
  originalEvent: WebhookEventBridgeEvent
): WebhookEventBridgeEventWrapped => {
  const {
    detail: { properties: originalProperties },
  } = originalEvent;

  const simplifiedProperties = Object.entries(originalProperties).reduce(
    (o, key) => ({ ...o, [key[0]]: key[1].value }),
    {} as HubspotDeal<string>
  );

  return {
    ...originalEvent,
    detail: { ...originalEvent.detail, properties: simplifiedProperties },
  };
};
