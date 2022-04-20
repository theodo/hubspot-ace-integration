import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";
import type {
  AceFileOpportunityInbound,
  Company,
  HubspotWebhook,
  Properties,
  WebhookEventBridgeEvent,
  WebhookEventBridgeEventSimplified,
} from "@libs/types";
import {
  companyPropertiesNeeded,
  industryHubspotToAceMappingObject,
  stagesHubspotToAceMappingObject,
} from "@libs/types";
import { Client } from "@hubspot/api-client";
import { middyfy } from "@libs/lambda";
import moment from "moment";
import axios, { AxiosRequestConfig } from "axios";
import _ from "lodash";
import { PublicOwner } from "@hubspot/api-client/lib/codegen/crm/owners/api";

const s3Client = new S3Client({
  region: "us-west-2",
  credentials: fromTemporaryCredentials({
    params: {
      RoleArn: process.env.ACE_ASSUME_ROLE_ARN,
      RoleSessionName: "ACE_session",
    },
  }),
});

const fileExtension = "json";

const writeOpportunity = async (
  event: WebhookEventBridgeEvent
): Promise<void> => {
  const hubspotClient = new Client({
    accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
  });
  console.log("event", JSON.stringify(event));

  const initProperties: Properties<string> = {
    dealname: undefined,
    dealstage: undefined,
    closedate: undefined,
    hubspot_owner_id: undefined,
    identifiant_ace: undefined,
    source_du_deal: undefined,
  };
  const properties = Object.entries(event.detail.properties).reduce(
    (o, key) => ({ ...o, [key[0]]: key[1].value }),
    initProperties
  );
  const simplifiedEvent: WebhookEventBridgeEventSimplified = {
    ...event,
    detail: { ...event.detail, properties },
  };

  const opportunity = await createOpportunityObject(
    simplifiedEvent.detail,
    hubspotClient
  );

  console.log("opportunity", opportunity);

  // TODO: remove test from filename
  const fileName = `opportunity-inbound/TEST_${moment().format(
    "DD-MM-YYYY_HH:mm:SS"
  )}`;
  const fileOpportunityPath = `${fileName}.${fileExtension}`;
  console.log("File Name :", fileOpportunityPath);

  const input: PutObjectCommandInput = {
    Key: fileOpportunityPath,
    Bucket: process.env.BUCKET_NAME,
    Body: JSON.stringify(opportunity),
    ACL: "bucket-owner-full-control",
  };
  await s3Client.send(new PutObjectCommand(input));

  return;
};

export const createOpportunityObject = async (
  event: HubspotWebhook<string>,
  hubspotClient: Client
): Promise<AceFileOpportunityInbound> => {
  const {
    objectId: dealId,
    properties: { hubspot_owner_id, identifiant_ace, dealstage },
  } = event;

  const notes = await getNotes(dealId, hubspotClient);

  const company = await getCompany(dealId, hubspotClient);

  const owner = await getOwner(hubspot_owner_id, hubspotClient);

  return {
    version: "1",
    spmsId: process.env.SPMS_ID,
    opportunities: [
      {
        status: !identifiant_ace && "Draft",
        stage: stagesHubspotToAceMappingObject[dealstage],
        customerCompanyName: company.name || event.properties.dealname,
        country: company.country,
        postalCode: company.zip,
        customerTitle: "",
        customerPhone: "",
        customerLastName: "",
        customerFirstName: "",
        customerEmail: "",
        customerWebsite: company.domain,
        partnerProjectTitle: event.properties.dealname,
        deliveryModel: "Managed Services",
        expectedMonthlyAwsRevenue: 100.0,
        partnerPrimaryNeedFromAws: "For Visibility - No Assistance Needed",
        targetCloseDate: moment(parseInt(event.properties.closedate)).format(
          "YYYY-MM-DD"
        ),
        primaryContactLastName: owner.lastName,
        primaryContactFirstName: owner.firstName,
        primaryContactEmail: owner.email,
        industry: mapIndustry(company.secteur_gics),
        projectDescription: notes,
        partnerCrmUniqueIdentifier: dealId.toString(),
        useCase: "Containers & Serverless",
      },
    ],
  };
};

const getCompany = async (
  dealId: string | undefined,
  hubspotClient: Client
): Promise<Company> => {
  const defaultCompany: Company = {
    secteur_gics: "",
    country: "France",
    domain: "theodo.fr",
    zip: "75017",
    name: "",
  };

  const {
    body: {
      results: [{ id: companyId }],
    },
  } = await hubspotClient.crm.deals.associationsApi.getAll(dealId, "Companies");

  const fetchedCompany = companyId
    ? (
        await hubspotClient.crm.companies.basicApi.getById(
          companyId,
          companyPropertiesNeeded
        )
      ).body.properties
    : undefined;

  return _.defaults(fetchedCompany, defaultCompany);
};

const getNotes = async (
  dealId: string,
  hubspotClient: Client
): Promise<string> => {
  const {
    body: { results: noteIds },
  } = await hubspotClient.crm.deals.associationsApi.getAll(dealId, "Notes");

  return (
    await Promise.all(
      noteIds.map(
        async ({ id }) =>
          await getCleanNoteBody(id, process.env.HUBSPOT_ACCESS_TOKEN)
      )
    )
  ).join("\n");
};

const getOwner = async (
  hubspot_owner_id: string,
  hubspotClient: Client
): Promise<PublicOwner> =>
  (await hubspotClient.crm.owners.ownersApi.getById(parseInt(hubspot_owner_id)))
    .body;

const mapIndustry = (secteur_gics: string) => {
  return industryHubspotToAceMappingObject[secteur_gics];
};

const getNoteById = async (id: string, hubspotToken: string) => {
  const config: AxiosRequestConfig = {
    headers: {
      authorization: `Bearer ${hubspotToken}`,
    },
    params: {
      properties: "hs_note_body",
    },
  };

  return (
    await axios.get(
      `${process.env.HUBSPOT_API_BASE_URL}/objects/notes/${id}?archived=false`,
      config
    )
  ).data;
};

const getCleanNoteBody = async (id: string, hubspotToken: string) =>
  cleanTextFromHtmlTags(
    (await getNoteById(id, hubspotToken)).properties.hs_note_body
  );

const cleanTextFromHtmlTags = (html: string) => {
  return html.replace(/<[^>]+>/g, "");
};

export const main = middyfy(writeOpportunity);
