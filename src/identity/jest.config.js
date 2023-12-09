module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 120000,
  testMatch: ['**/*.test.ts'],
  runner: 'jest-serial-runner'
};
