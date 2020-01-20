module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: ["@typescript-eslint", "simple-import-sort", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier/@typescript-eslint",
  ],
  rules: {
    "simple-import-sort/sort": [
      "error",
      {
        groups: [
          ["^(react|relay)"],
          ["^next"],
          [`^(${require("module").builtinModules.join("|")})(/|$)`],
          ["^\\u0000"],
          ["^[^.]"],
          [
            "^(lib/|components/|hocs/|utils/|@pages/|@mutations/|@generated/|@repositories/|@services/|tailwind.config)",
          ],
          ["^\\."],
          ["^.+\\.s?css$"],
        ],
      },
    ],
    "sort-imports": "off",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/explicit-function-return-type": [
      "warn",
      { allowExpressions: true },
    ],
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars-experimental": "warn",
    "@typescript-eslint/unbound-method": "off",
  },
}
