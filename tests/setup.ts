// tests/setup.ts
// Global mocks for firebase-admin, nodemailer, jsonwebtoken, bcrypt
jest.mock("firebase-admin", () => {
  return {
    apps: [], // <- necesario para if (!admin.apps.length)
    initializeApp: jest.fn(),
    credential: {
      cert: jest.fn(() => ({})),
    },
    auth: () => ({
      verifyIdToken: jest.fn().mockResolvedValue({ uid: "test-uid", email: "test@test.com" }),
    }),
    firestore: () => ({
      collection: () => ({
        doc: (id?: string) => ({
          id: id || "mock-doc",
          set: jest.fn().mockResolvedValue(true),
          get: jest.fn().mockResolvedValue({ exists: true, id: id || "mock-doc", data: () => ({}) }),
          update: jest.fn().mockResolvedValue(true),
          delete: jest.fn().mockResolvedValue(true),
        }),
        add: jest.fn().mockResolvedValue({ id: "mock-id" }),
        where: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            empty: false,
            docs: [{ id: "mock-id", data: () => ({}) }],
          }),
        }),
        get: jest.fn().mockResolvedValue({
          docs: [],
        }),
      }),
    }),
  };
});

jest.mock("nodemailer", () => ({
  createTransport: () => ({
    sendMail: jest.fn().mockResolvedValue({ accepted: ["test@test.com"] }),
  }),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mock-jwt"),
  verify: jest.fn().mockReturnValue({ uid: "test-uid", email: "test@test.com" }),
}));

// Keep env minimal for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
process.env.NODE_ENV = "test";
