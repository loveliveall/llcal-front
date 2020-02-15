module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    project: './tsconfig.json',
  },
  plugins: ["@typescript-eslint"],
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
};
