import * as repo from "../../src/repositories/user.repository";
const firebase = require("firebase-admin");

describe("User Repository", () => {
  beforeEach(() => jest.clearAllMocks());

  it("createUserInDb should call add and return id", async () => {
    // our setup.ts mocked add to resolve { id: "mock-id" }
    const id = await repo.createUserInDb({
      firstName: "x",
      email: "a@a.com",
      password: "x",
      createdAt: new Date(),
    } as any);
    expect(id).toBe("mock-id");
  });

  it("findUserByEmailInDb returns user when not empty", async () => {
    // setup.ts returns where().get() docs with one doc
    const u = await repo.findUserByEmailInDb("a@a.com");
    expect(u).not.toBeNull();
    expect(u).toHaveProperty("id");
  });
});
