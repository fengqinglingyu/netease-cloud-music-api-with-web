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
      require('postcss-px-to-viewport')({
        viewportWidth: 325,
        viewportHeight: 568,
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
