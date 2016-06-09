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
    var makeBetsUrl = '/tournaments/' + tournamentId + '/makebets/match';
    var points = this.state.points;
    var userId = LoginStore.getUserId();
    var ownResultsUrl = '/tournaments/' + tournamentId + '/results/' + userId;

    var user = LoginStore.getUser();
    var adNewUser = '';
    if (user !== null && tournament.owner !== undefined && user.email===tournament.owner.email) {
        adNewUser = (
          <div>
            <div>Invite user:</div>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <label><input type="email" ref="email" placeholder="email" /></label>
              <button type="submit">Invite</button>
            </form>
          </div>
        );
    }

    return (
      <div className="tournament">
        <h2>{tournament.name}</h2>

        <div><Link to={makeBetsUrl}>Make/edit your bets</Link></div>
        <div><Link to={ownResultsUrl}>Show your bets</Link></div>

        {adNewUser}

        <h3>Points</h3>
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Points</td>
            </tr>
          </thead>
          <tbody>
          {points.map(function(point) {
            if (point.user !== null && point.user.name !== undefined) {
              var userId = point.user._id;
              var pointId = point._id;
              var urlResults = '/tournaments/' + tournamentId + '/results/' + userId;
              return (
                <tr key={point._id}>
                  <td>{point.user.name}</td>
                  <td>{point.match_points}</td>
                </tr>
              );
            }
          })}
          </tbody>
        </table>


      </div>
    );
  }

});
