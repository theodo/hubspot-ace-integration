import axios from "axios";

import { hubspotClient } from "./client";

const DEFAULT_DESCRIPTION = "OPPORTUNITE AWS M33 GROUP - DESCRIPTION A VENIR";

const cleanTextFromHtmlTags = (html: string) => html.replace(/<[^>]+>/g, "");

const getNote = async (noteId: string) => {
  const { data: note } = await axios.get(
    `${process.env.HUBSPOT_API_BASE_URL}/objects/notes/${noteId}?archived=false`,
    {
      headers: {
        authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
      },
      params: { properties: "hs_note_body" },
    }
  );

  return cleanTextFromHtmlTags(note.properties.hs_note_body);
};

export const getDealNotes = async (dealId: string): Promise<string> => {
  const {
    body: { results: associatedNoteIds },
  } = await hubspotClient.crm.deals.associationsApi.getAll(dealId, "Notes");

  const noteIds = associatedNoteIds.map(({ id: noteId }) => noteId);

  const notes = (await Promise.all(noteIds.map(getNote))).join("\n");

  if (notes.length <= 25) {
    return DEFAULT_DESCRIPTION;
  }

  return notes;
};
