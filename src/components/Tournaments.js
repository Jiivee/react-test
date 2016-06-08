import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'
import {Constants} from '../constants/Constants';
import { browserHistory, Link } from 'react-router';

const title = 'Tournaments';


export default AuthenticatedComponent(class Tournaments extends Component {

  constructor(props) {
    super(props);
    this.state = { tournaments: [] };
  }

  componentWillMount() {
    this.fetchData();
  }
  ComponentDidMount() {
    this.fetchData();
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
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      this.setState({
        tournaments: data.tournaments
      });
    })
    .catch(e => console.log(e));
  }

  render() {
    var tournaments = this.state.tournaments;
    console.log('tournaments:');
    console.log(tournaments);
    return (
      <div className="tournaments">
        <h2>Your tournaments</h2>
        {tournaments.map(function(tournament) {
          var url = '/tournaments/' + tournament._id;
          return <div className="tournament" key={tournament._id}><Link className="tournament-link" to={url}>{tournament.name}</Link></div>;
        })}
        <h3>Or create new tournament:</h3>
        <Link className="tournament-link" to="/newtournament">Create new tournament</Link>
      </div>
    );
  }

});
