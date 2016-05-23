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
    this.state = { tournament: {} };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    var tournamentId = this.props.params.tournamentId;
    var jwt = LoginStore.getjwt()
    console.log(jwt);
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    var path = Constants.TOURNAMENTS_URL + 'id/' + tournamentId;
    console.log(path);
    fetch(path, {
      method: 'get',
      headers: myHeaders
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        tournament: data
      });
    })
    .catch(e => {console.log(e)});
  }

  render() {
    var tournament = this.state.tournament;
    var tournamentId = this.props.params.tournamentId;
    var url = '/tournaments/' + tournamentId + '/makebets/match';
    console.log('tournament:');
    console.log(tournament);
    return (
      <div>
        <h1>Tournament {tournament.name}</h1>

        <Link to={url}>Make bets</Link>


      </div>
    );
  }

});
