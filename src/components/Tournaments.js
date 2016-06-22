import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'
import {Constants} from '../constants/Constants';
import { browserHistory, Link } from 'react-router';
import auth from '../services/AuthService';

const title = 'Tournaments';


export default AuthenticatedComponent(class Tournaments extends Component {

  constructor(props) {
    super(props);
    this.state = { tournaments: [] };
  }

  componentWillMount() {
    this.fetchData();
  }

  checkResponseStatus(response) {
    if (response.status !== 403 || response.status !== 401) {
      return response;
    } else {
      auth.logout();
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }

  fetchData() {
    var userId = LoginStore.getUserId();
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    fetch(Constants.USER_URL + userId, {
      method: 'get',
      headers: myHeaders
    })
    .then(this.checkResponseStatus)
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        tournaments: data.tournaments
      });
    })
    .catch(e => console.log(e));
  }

  render() {
    var tournaments = this.state.tournaments;
    return (
      <div className="tournaments">
        <h2>Your tournaments</h2>
        {tournaments.map(function(tournament) {
          var url = '/tournaments/' + tournament._id;
          return <div className="tournament-name" key={tournament._id}><Link className="tournament-link" to={url}>{tournament.name}</Link></div>;
        })}
      </div>
    );
  }

});
