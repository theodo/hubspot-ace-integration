import { EventBus } from "@aws-cdk/aws-events";
import { stack } from "serverless";

export const aceBus = new EventBus(stack, "AceBus");
