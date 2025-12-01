import * as userRepo from "../../src/repositories/user.repository";
import { createUserService, sanitizeUser } from "../../src/services/user.service";

jest.mock("../../src/repositories/user.repository");

describe("User Service", () => {
  beforeEach(() => jest.clearAllMocks());

  it("createUserService should call repo and return id", async () => {
    const fakeId = "abc123";
    (userRepo.createUserInDb as jest.Mock).mockResolvedValue(fakeId);

    const user = {
      firstName: "Brandon",
      lastName: "Jimenez",
      age: 25,
      email: "test@test.com",
      createdAt: new Date(),
      password: "plainpass",
    };

    const id = await createUserService(user as any);
    expect(id).toBe(fakeId);
    expect(userRepo.createUserInDb).toHaveBeenCalledTimes(1);
  });

  it("sanitizeUser removes password and token", () => {
    const user = {
      id: "1",
      firstName: "A",
      email: "a@a.com",
      password: "x",
      resetPasswordToken: "tok",
      createdAt: new Date(),
    } as any;

    const s = sanitizeUser(user);
    expect((s as any).password).toBeUndefined();
    expect((s as any).resetPasswordToken).toBeUndefined();
    expect(s).toHaveProperty("email");
  });
});
