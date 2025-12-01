import { errorHandler } from "../../src/middlewares/errorHandler";

describe("Error Handler", () => {
  it("devuelve 500 por defecto", () => {
    const err = new Error("Test error");

    const req: any = {};
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    errorHandler(err, req, res, () => {});

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
