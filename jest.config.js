/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    verbose: false,
    testPathIgnorePatterns: [
        "/node_modules/",
        "/__tests__/__fixtures__/",
        "/__tests__/__assets__/"
    ],
    testEnvironment: 'node',
};
