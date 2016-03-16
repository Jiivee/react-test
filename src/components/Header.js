import React, { Component, PropTypes } from 'react';
import LoginStore from '../stores/LoginStore';
import auth from '../services/AuthService';
import { browserHistory, Router, Route, Link } from 'react-router';

import styles from './header.scss';

class Header extends Component {

  constructor(props) {
    super(props);
  }

  logout() {
    auth.logout();
    console.log('logging out');
    browserHistory.push('/');
  }

  render() {


    var loginStatus;
    if (LoginStore.isLoggedIn()) {
      loginStatus = <input type="button" value="logout" onClick={this.logout.bind(this)}/>;
    } else {
      loginStatus = (
        <span>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
        </span>
      );
    }

    return (
      <header>
      Futisveikkaus
      <Link to="/matches">Matches</Link>
      {loginStatus}
      </header>
    );
  }
}

export default Header;
