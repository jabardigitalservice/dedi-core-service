import type { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
    bail: 1,
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
      './src/helpers/test/*.ts',
      './src/modules/cities/*.ts',
      './src/modules/districts/*.ts',
      './src/modules/pages/*.ts',
      './src/modules/partners/*.ts',
      './src/modules/testimonials/*.ts',
      './src/modules/users/*.ts',
      './src/modules/villages/*.ts',
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
