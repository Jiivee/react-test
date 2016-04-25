import React from 'react';
import { render } from 'react-dom'
import App from './App';
import Matches from './components/Matches'
import Tournaments from './components/Tournaments'
import Bet from './components/Bet'
import Login from './components/Login'
import Signup from './components/Signup'
import LoginStore from './stores/LoginStore'
import LoginActions from './actions/LoginActions';
import { browserHistory, Router, Route, Link } from 'react-router'

function requireAuth(nextState, replace) {
  let jwt = localStorage.getItem('jwt');
  if (jwt) {
    LoginActions.loginUser(jwt);
  }
  const authStatus = LoginStore.isLoggedIn();
  if (!authStatus) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="matches" component={Matches} onEnter={requireAuth}/>
      <Route path="bet" component={Bet} onEnter={requireAuth}/>
      <Route path="tournaments" component={Tournaments} onEnter={requireAuth}/>
      <Route path="login" component={Login} />
      <Route path="signup" component={Signup} />
    </Route>
  </Router>
), document.getElementById('root'))
