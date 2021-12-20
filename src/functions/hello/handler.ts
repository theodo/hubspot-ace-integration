import type { WebhookEventBridgeEvent } from '@libs/types';

export const main = async (event: WebhookEventBridgeEvent): Promise<void> => {
  console.log(JSON.stringify(event));
  return;
}
