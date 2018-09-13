module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);
  const presets = [
    [
      "@babel/preset-env", {
        "targets": {
          "browsers": ["ie >= 10", "chrome >= 45"]
        },
        "modules": false
      }],
    "@babel/preset-flow",
    "@babel/preset-react"
  ];
  const plugins = [
    [
      "import", {
        "libraryName": "antd",
        "style": true
      }
    ],
    ["@babel/plugin-transform-runtime", { "corejs": 2 }],
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-optional-chaining"
  ];

  const env = {
    "production": {},
    "development": {
      "plugins": [
        [
          "dva-hmr", {
            "container": ".react-app",
            "quiet": false
          },
          "@babel/plugin-transform-react-jsx-source"
        ]
      ]
    }
  };

  const comments = true;

  return {
    presets,
    plugins,
    env,
    comments
  };
}