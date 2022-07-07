import { Role, ServicePrincipal } from "@aws-cdk/aws-iam";

import { stack } from "serverless";

export const ACES3BucketAccessRoleSfn = new Role(
  stack,
  "ACES3BucketAccessRoleSfnSfn",
  {
    assumedBy: new ServicePrincipal("states.eu-west-1.amazonaws.com"),
    roleName: "APN-ACE-Theodo-AccessRole-Sfn-${sls:stage}",
  }
);
