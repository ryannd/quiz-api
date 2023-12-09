export default {
    moduleFileExtensions: ["ts", "js"],
    collectCoverage: true,
    collectCoverageFrom: [
        "src/controllers/*.ts",
        "src/services/*.ts",
        "!**/node_modules/**",
        "!**/build/**",
        "!**/coverage/**",
    ],
    transform: {
        "\\.ts$": "ts-jest",
    },
    coverageReporters: ["text", "text-summary"],
    testRegex: "(/tests/|(\\.|/)(test|spec))\\.(js|ts)x?$",
    testPathIgnorePatterns: ["/node_modules/", "/build/", "/coverage/"],
};
