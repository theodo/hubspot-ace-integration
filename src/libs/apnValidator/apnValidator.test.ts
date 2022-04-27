import {
  DEFAULT_DESCRIPTION,
  descriptionValidator,
  industryValidator,
} from "./apnValidator";

describe("industryValidator", () => {
  it("should validate if industry is in the list", async () => {
    const industry = "Professional Services";
    expect(await industryValidator.validate(industry)).toBe(industry);
  });

  it('should return "Other" if industry is undefined or empty', async () => {
    expect(await industryValidator.validate(undefined)).toBe("Other");
    expect(await industryValidator.validate("")).toBe("Other");
  });

  it("should trow error if industry is not in the list", async () => {
    await expect(() =>
      industryValidator.validate("Not an industry")
    ).rejects.toThrow();
  });
});

describe("projectDescriptionValidator", () => {
  it("should validate if description is >= 50 char", async () => {
    const description =
      "RATP dev serverless - prolongation - squad agile - 4 months";
    expect(await descriptionValidator.validate(description)).toBe(description);
  });

  it("should return default description if description is undefined or empty", async () => {
    expect(await descriptionValidator.validate(undefined)).toBe(
      DEFAULT_DESCRIPTION
    );
    expect(await descriptionValidator.validate("")).toBe(DEFAULT_DESCRIPTION);
  });

  it("should trow error if description is < 50 chars", async () => {
    await expect(() =>
      descriptionValidator.validate("This is a short description")
    ).rejects.toThrow();
  });
});
