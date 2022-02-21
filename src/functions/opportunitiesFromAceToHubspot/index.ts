import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      schedule: "rate(10 hours)",
    },
  ],
  environment: {
    BUCKET_NAME: "${param:aceBucketName}",
  },
};
