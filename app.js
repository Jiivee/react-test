if (process.env.NODE_ENV !== 'production') {
  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');
  var config = require('./webpack.config');

  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true
  }).listen(3000, 'localhost', function (err, result) {
    if (err) {
      return console.log(err);
    }

    console.log('Listening at http://localhost:3000/');
  });
}
else {
  const Server = require('./src/server.js')
  const port = (process.env.PORT || 8080)
  const app = Server.app()
  app.listen(port)
  console.log(`Listening at http://localhost:${port}`)
}

