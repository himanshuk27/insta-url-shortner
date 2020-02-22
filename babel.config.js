module.exports = {
  presets: ["@babel/env"],
  plugins: [
    [
      "transform-imports",
      {
        quasar: {
          transform: "quasar/dist/babel-transforms/imports.js",
          preventFullImport: true
        }
      }
    ],
    ["@babel/plugin-transform-runtime"]
  ]
};
