import type { Config } from 'jest';

export default {
  displayName: 'ts-only',
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/test/$1'
  },

  testTimeout: 30000,
  testPathIgnorePatterns: ['<rootDir>/dist/'],

} satisfies Config;