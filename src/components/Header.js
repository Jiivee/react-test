import React, { Component, PropTypes } from 'react';
import LoginStore from '../stores/LoginStore';
import auth from '../services/AuthService';
import { browserHistory, Router, Route, Link } from 'react-router';

import styles from '../styles/header.scss';

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
    var links;
    if (LoginStore.isLoggedIn()) {
      links = (
        <div className="links">
          <Link className="header-link" to="/rules">Rules</Link>
          <Link className="header-link" to="/tournaments">Tournaments</Link>
        </div>
      );
      loginStatus = (
        <span className="login-status">
          <input className="header-logout" type="button" value="logout" onClick={this.logout.bind(this)}/>
        </span>
      );
    } else {
      loginStatus = (
        <span className="login-status">
          <Link className="header-link-log" to="/login">Login</Link>
          <Link className="header-link-log" to="/signup">Sign up</Link>
        </span>
      );
    }

    return (
      <header>
        <div className="centerer">
          <Link className="header-link" to="/">Euro 2016 betting</Link>
          {loginStatus}
          {links}
        </div>
      </header>
    );
  }
}

export default Header;
