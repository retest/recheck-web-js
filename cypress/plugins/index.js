const webpack = require('@cypress/webpack-preprocessor');
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = on => {
  const options = {
    // send in the options from your webpack.config.js, so it works the same
    // as your app's code
    webpackOptions: require('../../webpack.config'),
    watchOptions: {},
  };

  on('file:preprocessor', webpack(options));
};
