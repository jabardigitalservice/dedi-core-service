import type { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
    bail: 1,
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
      './src/helpers/test/*.ts',
      './src/modules/**/*.ts',
      '!./src/modules/auth/*.ts',
      '!./src/modules/files/*.ts',
    ],
    coverageReporters: ['lcov'],
    detectOpenHandles: true,
    forceExit: true,
    globals: {
      'ts-jest': {
        diagnostics: false,
      },
    },
    testEnvironment: 'node',
    testMatch: ['**/*_test.ts'],
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    setupFilesAfterEnv: [
      'jest-extended',
      './src/config/jest.ts'
    ],
    verbose: true,
  };
}
