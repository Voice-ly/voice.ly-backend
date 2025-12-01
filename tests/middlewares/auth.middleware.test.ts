import { verifyToken } from "../../src/middlewares/auth.middleware";

describe("Auth Middleware", () => {
  it("debe rechazar sin token", () => {
    const req: any = { headers: {} };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    verifyToken(req, res, () => {});

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
