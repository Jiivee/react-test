import React, { Component } from 'react';
import MatchesPage from './components/Matches.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import LoginActions from './actions/LoginActions';
import LoginStore from './stores/LoginStore';

import styles from './components/main.scss';

export default class App extends Component {

  render() {
    let jwt = localStorage.getItem('jwt');
    if (jwt) {
      LoginActions.loginUser(jwt);
    }

    return (
      <div>
      <Header/>
      {this.props.children}
      <Footer/>
      </div>
    );
  }
}
