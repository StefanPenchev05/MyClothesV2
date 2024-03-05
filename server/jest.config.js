export default {
  // ... other Jest configuration options

  transform: {
    "^.+\\.jsx?$": ["babel-jest", { configFile: "./babel.config.cjs" }],
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  transformIgnorePatterns: ["/node_modules/"],

  testEnvironment: "node",
};
