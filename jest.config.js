const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  verbose: true,

  // Dónde están los tests
  roots: ["<rootDir>/tests", "<rootDir>/src"],

  // Aplicar mocks globales
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  // Para TypeScript
  transform: {
    ...tsJestTransformCfg,
  },

  // Para que Jest respete tsconfig.jest.json
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json",
    },
  },

  // Alias (opcional pero recomendado)
  moduleNameMapper: {
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
    "^@repositories/(.*)$": "<rootDir>/src/repositories/$1",
    "^@models/(.*)$": "<rootDir>/src/models/$1",
  },

  // Qué archivos medir en coverage
  collectCoverageFrom: ["src/**/*.ts", "!src/server.ts"],
};
