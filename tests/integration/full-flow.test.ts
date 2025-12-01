import request from "supertest";
import app from "../../src/app";
import * as userService from "../../src/services/user.service";
import * as meetingService from "../../src/services/meeting.service";
import bcrypt from "bcrypt";

jest.mock("../../src/services/user.service", () => ({
  createUserService: jest.fn(),
  findUserByEmailService: jest.fn(),
}));

jest.mock("../../src/services/meeting.service", () => ({
  createMeetingService: jest.fn(),
}));

jest.mock("../../src/middlewares/auth.middleware", () => ({
  verifyToken: (req: any, res: any, next: any) => {
    req.user = { uid: "u1", email: "u@t.com" };
    next();
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Full flow (mocked services)", () => {
  it("creates user, logs in, creates meeting", async () => {
    // Mock: findUserByEmailService → 1ª vez NO existe, 2ª vez para login SÍ existe
    (userService.findUserByEmailService as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: "u1",
        email: "u@t.com",
        password: await bcrypt.hash("Pwd#1234", 10), // 8+ caracteres
      });

    // Mock: crear usuario
    (userService.createUserService as jest.Mock).mockResolvedValue("u1");

    // Mock: crear meeting
    (meetingService.createMeetingService as jest.Mock).mockResolvedValue({
      success: true,
      status: 201,
      data: { id: "m1" },
    });

    /* 1. CREATE USER */
    const user = await request(app).post("/api/users").send({
      firstName: "UserTest",
      lastName: "ValidTest",
      age: 30,
      email: "u@t.com",
      password: "Pwd#1234", // ✅ cumple validación
    });

    expect(user.status).toBe(201);
    expect(user.body).toHaveProperty("id", "u1");

    /* 2. LOGIN */
    const login = await request(app).post("/api/auth/login").send({
      email: "u@t.com",
      password: "Pwd#1234",
    });

    expect(login.status).toBe(200);
    expect(login.body).toHaveProperty("token");

    /* 3. CREATE MEETING */
    const meeting = await request(app)
      .post("/api/meetings")
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({ title: "Reunion" });

    expect(meeting.status).toBe(201);
    expect(meeting.body.data).toHaveProperty("id", "m1");
  });
});
