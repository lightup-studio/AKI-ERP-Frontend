import { Config } from 'jest';

const config: Config = {
  displayName: 'aki-erp',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/aki-erp',
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
};

export default config;
