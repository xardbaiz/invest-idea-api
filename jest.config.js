/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/build/", "/dist/"],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transformIgnorePatterns: [
    "node_modules/(?!(vectra|uuid|react-markdown|remark-.*|rehype-.*|vfile.*|unist-.*|mdast-.*|micromark.*|devlop|estree-util-.*|decode-named-character-reference|character-entities|html-.*|property-information|hast-util-.*|space-separated-tokens|comma-separated-tokens|ccount|markdown-table|trim-lines|longest-streak|unified|zwitch|bail|is-plain-obj|trough|escape-string-regexp)/)",
  ],
  transform: {
    "^.+\\.m?[tj]sx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
