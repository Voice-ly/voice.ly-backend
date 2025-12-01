import request from "supertest";
import app from "../../src/app";
import * as meetingService from "../../src/services/meeting.service";

// Mock auth
jest.mock("../../src/middlewares/auth.middleware", () => ({
  verifyToken: (req: any, res: any, next: any) => {
    req.user = { uid: "test-uid", email: "test@test.com" };
    next();
  },
}));

// Mock ALL service functions
jest.mock("../../src/services/meeting.service", () => ({
  createMeetingService: jest.fn(),
  getMeetingByIdService: jest.fn(),
  listMeetingsService: jest.fn(),
  joinMeetingService: jest.fn(),
  updateMeetingService: jest.fn(),
  deleteMeetingService: jest.fn(),
}));

describe("Meeting Controller", () => {

  beforeEach(() => jest.clearAllMocks());

  it("should create meeting", async () => {
    (meetingService.createMeetingService as jest.Mock).mockResolvedValue({
      success: true,
      status: 201,
      message: "Reunión creada",
      data: { id: "m1", meetLink: "link" },
    });

    const res = await request(app)
      .post("/api/meetings")
      .send({ title: "Test meeting" });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("m1");
  });

});
