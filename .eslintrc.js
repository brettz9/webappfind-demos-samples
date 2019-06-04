module.exports = {
  "extends": ["ash-nazg/sauron-node"],
  "env": {
    "browser": true
  },
  "settings": {
    "polyfills": [
      "Number.isNaN",
      "Object.assign",
      "Object.entries",
      "Promise",
      "Uint8Array"
    ]
  },
  "rules": {
    "indent": ["error", 4, {"outerIIFEBody": 0}],
    // Todo: Reenable when PR accepted to fix
    "jsdoc/check-types": 0,
    // Todo; See about reenabling
    "import/unambiguous": 0,
    "node/shebang": 0,
    "jsdoc/require-jsdoc": 0
  }
};
