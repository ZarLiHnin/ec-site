// jest.config.ts
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  moduleNameMapper: {
    '^store/(.*)$': '<rootDir>/store/$1',
    '^hooks/(.*)$': '<rootDir>/hooks/$1',
    '^components/(.*)$': '<rootDir>/components/$1',
    '^lib/(.*)$': '<rootDir>/lib/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
};
