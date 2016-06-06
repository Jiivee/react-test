var path = require('path');
var express = require('express');
var app = express();
var React = require('react')
var Router = require('react-router')
var PORT = process.env.PORT || 8080

// using webpack-dev-server and middleware in development environment
if(process.env.NODE_ENV !== 'production') {
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpack = require('webpack');
  var config = require('./webpack.config');
  var compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

app.get('/matches', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

app.get('/matches/:matchId/setresult', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

app.get('/tournaments', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

app.get('/tournaments/:tournamentId', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

app.get('/tournaments/:tournamentId/makebets/match', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

app.get('/tournaments/:tournamentId/makebets/playoff', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

app.get('/tournaments/:tournamentId/makebets/topscorer', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

app.get('/tournaments/:tournamentId/results/:userId', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

app.get('/newtournament', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

app.get('/login', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

app.get('/signup', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

app.listen(PORT, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  }
});
