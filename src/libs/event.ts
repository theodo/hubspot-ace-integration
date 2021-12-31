import { EventBridge } from "aws-sdk";
import { Bus, Event } from "typebridge";

export const EventBus = new Bus({
  name: process.env.ACE_BUS_NAME,
  EventBridge: new EventBridge(),
});

export const newlyCreatedOpprutinityPayloadSchema = {
  type: "object",
  properties: {
    apnCrmUniqueIdentifier: { type: "string" },
    partnerCrmUniqueIdentifier: { type: "string" },
  },
  additionalProperties: false,
} as const;

export const newlyCreatedOpprutinityEvent = new Event({
  name: "newlyCreatedOpprutinityEvent",
  bus: EventBus,
  schema: newlyCreatedOpprutinityPayloadSchema,
  source: "mySource",
});
