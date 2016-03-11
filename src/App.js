import React, { Component } from 'react';
import MatchesPage from './components/Matches.js';
import { browserHistory, Router, Route, Link } from 'react-router'

export default class App extends Component {
  render() {
    return (
      <div>
      <Link to="/matches">Matches</Link>
      <Link to="/login">Login</Link>
      {this.props.children}
      </div>
    );
  }
}
