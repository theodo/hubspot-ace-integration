import {
  getLambdaArn,
  getStateName,
  LambdaServiceExceptionRetryPolicy,
} from "@libs/utils/stepFunctions";

import { logEvent } from "src/functions/logEvent";

import { Success } from "./endStates";

export const LogEvent = {
  Type: "Task",
  Resource: getLambdaArn({ logEvent }),
  ResultPath: "$.draftOptyVersions",
  Retry: [LambdaServiceExceptionRetryPolicy],
  Next: getStateName({ Success }),
};
