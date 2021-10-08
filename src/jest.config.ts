import type { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
    forceExit: true,
    bail: 1,
    verbose: true,
    clearMocks: true,
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts?$': 'ts-jest'
    },
    setupFilesAfterEnv: ['jest-extended'],
    globals: {
      'ts-jest': {
        diagnostics: false
      }
    },
    testMatch: [
      '**/*_test.ts'
    ],
    testPathIgnorePatterns: [
      '/node_modules/'
    ],
    collectCoverage: true,
    collectCoverageFrom: [
      '**/*_test.ts',
      './modules/**/*.ts',
      '!./modules/**/*_handler.ts',
      '!./modules/**/*_schema.ts',
    ],
    coverageReporters: ['lcov'],
    detectOpenHandles: true
  }
}
