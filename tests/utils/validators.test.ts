import { isValidEmail } from "../../src/utils/validators";

describe("Validators Utils", () => {
  it("valida correos correctamente", () => {
    expect(isValidEmail("test@test.com")).toBe(true);
    expect(isValidEmail("wrong-email")).toBe(false);
  });
});
