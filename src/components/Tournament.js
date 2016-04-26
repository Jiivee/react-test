import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'
import {Constants} from '../constants/Constants';
import { browserHistory, Link } from 'react-router';

const title = 'Tournament';


export default AuthenticatedComponent(class Tournament extends Component {

  constructor(props) {
    super(props);
    this.state = { tournaments: [] };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    var tournamentId = '571f6f5ef3e49a404efdab5d';
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    fetch(Constants.TOURNAMENT_URL + tournamentId, {
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
      <div>
        <h1>Hello {this.props.user ? this.props.user.name : ''}</h1>
        <Link to="/newtournament">Create new tournament</Link>
        <h1>Tournaments</h1>
        {tournaments.map(function(tournament) {
          var url = '/tournaments/' + tournament._id;
          return <div key={tournament._id}><Link to={url}>{tournament.name}</Link></div>;
        })}

      </div>
    );
  }

});
