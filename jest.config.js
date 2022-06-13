module.exports = {
    roots: ['<rootDir>'],
    testMatch: [`**/src/**/*.test.+(ts|tsx|js)`],
    testPathIgnorePatterns: ['/dist/', '/lib/', '/node_modules/'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.json',
        },
    },
    moduleNameMapper: {
        '@/(.*)': ['<rootDir>/src/$1'],
    },
    setupFiles: ['<rootDir>/jest.setup.js'],
    verbose: true,
    testResultsProcessor: 'jest-sonar-reporter',
    collectCoverage: false,
    collectCoverageFrom: [`**/src/**/*.ts`],
    coveragePathIgnorePatterns: ['/dist/', '/node_modules/'],
    coverageReporters: ['lcov', 'text'],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
        },
    },
};
