import { EventBridge } from "aws-sdk";
import { Bus, Event } from "typebridge";

export const EventBus = new Bus({
  name: process.env.ACE_BUS_NAME as string,
  EventBridge: new EventBridge(),
});

export const opportunityCreatedPayloadSchema = {
  type: "object",
  properties: {
    fileKey: { type: "string" },
  },
  required: ["fileKey"],
  additionalProperties: false,
} as const;

export const opportunityCreatedEvent = new Event({
  name: "OpportunityCreatedEvent",
  bus: EventBus,
  schema: opportunityCreatedPayloadSchema,
  source: "Lambda",
});
