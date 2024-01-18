module.exports = {
    env: {
        "jest/globals": true
    },
    extends: [
        "koa",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
        "prettier",
        "plugin:jest/recommended"
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["jest", "@typescript-eslint"],
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
    },
     overrides: [
        {
            "files": ["*.test.ts", "*.spec.ts"],
            "rules": {
                "no-unused-expressions": "off",
                "@typescript-eslint/unbound-method": "off"
            }
        }
    ],
    root: true,
    rules: {
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error"
    }
};
