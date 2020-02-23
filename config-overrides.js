const {
  override,
  fixBabelImports,
  addLessLoader,
  overrideDevServer,
  addPostcssPlugins,
} = require('customize-cra');

// 跨域配置
const devServerConfig = () => config => {
  return {
    ...config,
    proxy: {
      '/': {
        target: 'http://127.0.0.1:2999',
        changeOrigin: true,
      },
    },
  };
};

const px2Viewport = 'postcss-px-to-viewport';
module.exports = {
  webpack: override(
    fixBabelImports('import', {
      libraryName: 'antd-mobile',
      style: true,
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: {
        'brand-primary': '#D43C33',
      },
    }),
    addPostcssPlugins([
      require(px2Viewport)({
        viewportWidth: 375,
        viewportHeight: 667,
        unitPrecision: 3,
        viewportUnit: 'vw',
        selectorBlackList: [],
        minPixelValue: 1,
        mediaQuery: false,
      }),
    ])
  ),
  devServer: overrideDevServer(devServerConfig()),
};
