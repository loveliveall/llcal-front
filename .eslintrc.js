module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    project: './tsconfig.json',
  },
  plugins: [
    "import",
    "react",
    "jsx-a11y",
    "@typescript-eslint",
  ],
  extends: [
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
  ],
  settings: {
    "import/resolver": {
      alias: {
        map: [
          ["@", "./src"],
        ],
        extensions: [".ts", ".tsx"],
      },
    },
  },
  rules: {
    "import/prefer-default-export": "off",
    "max-len": ["error", {
      code: 120,
      tabWidth: 2,
      ignoreComments: true,
    }],
    "react/prop-types": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/member-delimiter-style": ["error", {
      multiline: {
        delimiter: 'comma',
        requireLast: true,
      },
      singleline: {
        delimiter: 'comma',
        requireLast: true,
      },
    }],
    "@typescript-eslint/no-explicit-any": "off",
  },
};
