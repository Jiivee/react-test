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
    this.state = {
      tournament: {},
      points: []
    };
  }

  componentWillMount() {
    this.fetchTournament();
    this.fetchPoints();
  }

  fetchTournament() {
    var tournamentId = this.props.params.tournamentId;
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    var path = Constants.TOURNAMENTS_URL + tournamentId;
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

  fetchPoints() {
    var tournamentId = this.props.params.tournamentId;
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    var path = Constants.POINTS_URL + tournamentId;
    console.log(path);
    fetch(path, {
      method: 'get',
      headers: myHeaders
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        points: data
      });
    })
    .catch(e => {console.log(e)});
  }

  handleSubmit(event) {
    event.preventDefault();
    const email = this.refs.email.value;
    const tournamentId = this.props.params.tournamentId;
    const jwt = LoginStore.getjwt()
    $.ajax({
      type: "PUT",
      url: Constants.TOURNAMENTS_URL + 'invite-user/',
      headers: {
        'x-access-token': jwt
      },
      data: {
        email: email,
        tournamentId: tournamentId
      },
      success: function(data) {
        console.log(data);
      },
      error: function(data) {
        console.log(data);
      }
    });
  }

  render() {
    var tournament = this.state.tournament;
    var tournamentId = this.props.params.tournamentId;
    var url = '/tournaments/' + tournamentId + '/makebets/match';
    var points = this.state.points;
    console.log('tournament:');
    console.log(tournament);
    console.log(points);
    return (
      <div>
        <h1>Tournament {tournament.name}</h1>

        <Link to={url}>Make bets</Link>

        <div>Invite user:</div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <label><input type="email" ref="email" placeholder="email" /></label>
          <button type="submit">Invite</button>
        </form>

        <div>Points</div>
        {points.map(function(point) {
          return (
            <div key={point._id}>
              <span>{point.user.name} </span>
              <span>{point.points}</span>
            </div>
          );
        })}


      </div>
    );
  }

});
