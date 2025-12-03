import { sendPasswordResetEmail } from "../../src/utils/email";

describe("Email Utils", () => {
  it("envía un correo de restablecimiento sin lanzar error", async () => {
    await expect(sendPasswordResetEmail("test@test.com", "http://reset.url")).resolves.toBeUndefined();
  });
});
