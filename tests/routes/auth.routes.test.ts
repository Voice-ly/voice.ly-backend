import request from "supertest";
import app from "../../src/app";
import * as userService from "../../src/services/user.service";

jest.mock("../../src/services/user.service");

describe("Auth/User Routes", () => {
  beforeEach(() => jest.clearAllMocks());

  it("creates a user via POST /api/users", async () => {
    (userService.createUserService as jest.Mock).mockResolvedValue("mock-id");

    const res = await request(app)
      .post("/api/users")
      .send({
        firstName: "X",
        lastName: "Y",
        age: 20,
        email: "test@test.com",
        password: "Abc123!@#",
      });

    // your controller returns 201 with { id, message } — adjust if different
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("login via POST /api/auth/login returns token when user exists", async () => {
    // mock findUserByEmailService to return a user with hashed password
    const bcrypt = require("bcrypt");
    const hashed = await bcrypt.hash("password123", 10);
    (userService.findUserByEmailService as jest.Mock).mockResolvedValue({
      id: "1",
      email: "test@test.com",
      password: hashed,
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "password123" });

    // controller returns { message, token } on success
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
