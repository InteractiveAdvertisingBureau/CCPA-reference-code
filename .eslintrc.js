module.exports = {
  "extends": "eslint:recommended",
  "plugins": [
      "import"
  ],
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module",
    "allowImportExportEverywhere": true
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "rules": {
    "no-console": "warn",
    "no-prototype-builtins": "off",
    "max-len": ["error", 100, 2, {
      "ignoreUrls": true,
      "ignoreComments": true,
      "ignoreRegExpLiterals": true,
      "ignoreStrings": true,
      "ignoreTemplateLiterals": true,
    }],
    'no-param-reassign': 'off',
    'no-cond-assign': 'error',
  }
};
