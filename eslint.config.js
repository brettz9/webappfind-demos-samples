import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    ignores: [
      'demos/ckeditor',
      'demos/CodeMirror',
      'demos/pdf.js',

      'demos/blockly_compressed.js',
      'demos/blocks_compressed.js',
      'demos/csslint.js',
      'demos/en.js',
      'demos/fabric.min.js',
      'demos/gocr.js',
      'demos/jshint.js',
      'demos/jsonlint.js',
      'demos/jquery.csv.js',
      'demos/ocrad.js',
      'sample-test-files/blockly-files.js',
      'sample-test-files/test.js'
    ]
  },
  ...ashNazg(['sauron', 'browser']),
  {
    settings: {
      polyfills: [
        'FileReader',
        'Number.isNaN',
        'Object.assign',
        'Object.entries',
        'Promise',
        'Uint8Array',
        'URLSearchParams'
      ]
    },
    rules: {
      'no-alert': 0,

      // Todo; See about reenabling
      'import-x/unambiguous': 0,
      'n/shebang': 0,
      'jsdoc/require-jsdoc': 0,
      '@stylistic/max-len': 0,
      'require-unicode-regexp': 0,
      'prefer-named-capture-group': 0,
      'unicorn/no-this-outside-of-class': 0,
      'unicorn/no-top-level-assignment-in-function': 0,
      'unicorn/prefer-number-coercion': 0,
      'unicorn/no-undeclared-class-members': 0
    }
  }
];
