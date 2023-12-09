export default {
    moduleFileExtensions: ["ts", "js"],
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.ts",
        "!**/node_modules/**",
        "!**/build/**",
        "!**/coverage/**",
    ],
    transform: {
        "\\.ts$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
    },
    coverageReporters: ["text", "text-summary"],
    testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(js|ts)x?$",
    testPathIgnorePatterns: ["/node_modules/", "/build/", "/coverage/"],
};
