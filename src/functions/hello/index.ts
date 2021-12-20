import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      eventBridge: {
        eventBus: '${construct:hubspot-webhook.busName}',
        pattern: {
          'detail-type': [
            'Webhook',
          ],
        },
      },
    },
  ],
  environment: {
    BUCKET_NAME: '${construct:hubspot-s3.bucketName}'
  }
}
