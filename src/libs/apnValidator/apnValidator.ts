import * as yup from "yup";

import { AceIndustry } from "@libs/constants/ace/industry";

export const industryValidator = yup
  .string()
  .oneOf(Object.values(AceIndustry))
  .transform((value) => (value === "" ? undefined : value))
  .required()
  .default(() => "Other");

export const DEFAULT_DESCRIPTION =
  "OPPORTUNITE AWS M33 GROUP ---- DESCRIPTION A VENIR";

export const descriptionValidator = yup
  .string()
  .min(50)
  .transform((value) => (value === "" ? undefined : value))
  .required()
  .default(() => DEFAULT_DESCRIPTION);

export const opportunityValidator = yup.object({
  customerCompanyName: yup.string().required(),
  industry: industryValidator,
  description: descriptionValidator,
});
