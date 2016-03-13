import React, { Component } from 'react';
import MatchesPage from './components/Matches.js';
import LoginActions from './actions/LoginActions';
import auth from './services/AuthService'
import LoginStore from './stores/LoginStore'
import { browserHistory, Router, Route, Link } from 'react-router'

export default class App extends Component {

  logout() {
    auth.logout();
  }

  render() {
    let jwt = localStorage.getItem('jwt');
    console.log(jwt);
    if (jwt) {
      LoginActions.loginUser(jwt);
    }
    return (
      <div>
      <Link to="/matches">Matches</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign up</Link>
      {function() {
        if (LoginStore.isLoggedIn()) {
          return <span>Logged in</span>;
        }
      }}

      <input type="button" value="logout" onClick={this.logout.bind(this)}/>
      {this.props.children}
      </div>
    );
  }
}
