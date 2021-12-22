import { StringParameter } from "@aws-cdk/aws-ssm";
import { stack } from "../../serverless";

export const hubspotAccessToken = new StringParameter(
  stack,
  "HubspotAccessToken",
  {
    stringValue: "replace me",
  }
);
