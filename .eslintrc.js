module.exports = {
  root: true,
  extends: ["plugin:vue/essential"],
  rules: {
    indent: "off",
    "space-before-function-paren": "off",
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 8,
    sourceType: "module",
  },
};
