import request from "supertest";
import app from "../../src/app";
import * as userService from "../../src/services/user.service";

jest.mock("../../src/services/user.service");

describe("User Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should create user", async () => {
    (userService.createUserService as jest.Mock).mockResolvedValue("mock-id");

    const res = await request(app)
      .post("/api/users")
      .send({
        firstName: "A",
        lastName: "B",
        age: 21,
        email: "u@test.com",
        password: "Abc123!@",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});
