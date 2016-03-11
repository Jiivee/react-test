import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Matches from './components/Matches'
import Login from './components/Login'
import { browserHistory, Router, Route, Link } from 'react-router'

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="matches" component={Matches} />
      <Route path="login" component={Login} />
    </Route>
  </Router>
), document.getElementById('root'))

//ReactDOM.render(<App />, document.getElementById('root'));
