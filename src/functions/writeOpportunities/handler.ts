import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import type {
  Company,
  HubspotWebhook,
  WebhookEventBridgeEvent,
} from "@libs/types";
import { industryHubspotToAceMappingObject } from "@libs/types";
import { Client } from "@hubspot/api-client";
import {
  AceFileOppurtunityInbound,
  companyPorpertiesNeeded,
} from "@libs/types";
import { middyfy } from "@libs/lambda";
import moment from "moment";

const s3Client = new S3Client({ region: "us-west-2" });

const writeOpprtunity = async (
  event: WebhookEventBridgeEvent
): Promise<void> => {
  const opportunity = await createOpportunityObject(event.detail);
  console.log(opportunity);

  const input: PutObjectCommandInput = {
    Key: "opportunity-inbound/TEST_3.json",
    Bucket: process.env.BUCKET_NAME,
    Body: JSON.stringify(opportunity),
    ACL: "bucket-owner-full-control",
  };
  const putCommand = new PutObjectCommand(input);
  await s3Client.send(putCommand);

  return;
};

export const createOpportunityObject = async (
  event: HubspotWebhook
): Promise<AceFileOppurtunityInbound> => {
  const hubspotClient = new Client({
    accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
  });
  const { objectId: dealId } = event;
  const {
    body: { results: companyIds },
  } = await hubspotClient.crm.deals.associationsApi.getAll(dealId, "Companies");

  let company: Company = {
    secteur_gics: "",
    country: "",
    domain: "",
    zip: "",
    name: "",
  };

  if (companyIds.length > 0) {
    company = (
      await hubspotClient.crm.companies.basicApi.getById(
        companyIds[0].id,
        companyPorpertiesNeeded
      )
    ).body.properties as unknown as Company;
    console.log("company", company);
  }

  const opportunity = {
    version: "1",
    spmsId: "spmsId",
    opportunities: [
      {
        status: "Draft",
        customerCompanyName: company.name || event.properties.dealname.value,
        country: company.country || "France",
        postalCode: company.zip || "75017",
        customerTitle: "",
        customerPhone: "",
        customerLastName: "",
        customerFirstName: "",
        customerEmail: "",
        customerWebsite: company.domain || "theodo.fr",
        partnerProjectTitle: event.properties.dealname.value,
        deliveryModel: "Managed Services",
        expectedMonthlyAwsRevenue: 100.0,
        partnerPrimaryNeedFromAws: "For Visibility - No assistance needed",
        targetCloseDate: moment(
          parseInt(event.properties.closedate.value)
        ).format("YYYY-MM-DD"),
        industry: mapIndustry(company.secteur_gics),
      },
    ],
  };

  return opportunity;
};

const mapIndustry = (secteur_gics: string) => {
  return industryHubspotToAceMappingObject[secteur_gics];
};
export const main = middyfy(writeOpprtunity);
