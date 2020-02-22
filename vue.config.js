const { VueLoaderPlugin } = require("vue-loader");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");

module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: false
    }
  },
  transpileDependencies: ["quasar"],
  configureWebpack: () => {
    [new VueLoaderPlugin(), new MomentLocalesPlugin()];
  },
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        // modify the options...
        return options;
      });
  }
};
