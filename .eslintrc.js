module.exports = {
  "extends": ["ash-nazg/sauron-node"],
  "env": {
    "browser": true
  },
  "settings": {
    "polyfills": [
      "FileReader",
      "Number.isNaN",
      "Object.assign",
      "Object.entries",
      "Promise",
      "Uint8Array",
      "URLSearchParams"
    ]
  },
  "rules": {
    "no-alert": 0,

    // Todo; See about reenabling
    "import/unambiguous": 0,
    "node/shebang": 0,
    "jsdoc/require-jsdoc": 0,
    "max-len": 0,
    "require-unicode-regexp": 0,
    "prefer-named-capture-group": 0
  }
};
