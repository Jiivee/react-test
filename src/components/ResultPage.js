
import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import ResultComponent from './ResultComponent.js';
import AuthenticatedComponent from './AuthenticatedComponent.js';
import {Constants} from '../constants/Constants';
import LoginStore from '../stores/LoginStore'

const title = 'Matches';


export default AuthenticatedComponent(class ResultPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      matchbets: [],
      playoffbets: [],
      topscorerbets: {}
    };
  }

  componentWillMount() {
    this.fetchMatchbets();
    this.fetchPlayoffbets();
    this.fetchTopscorerbets();
  }

  fetchTopscorerbets() {
    var tournamentId = this.props.params.tournamentId;
    var userId = this.props.params.userId;
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    var path = Constants.TOPSCORER_BETS_URL + userId + '/' + tournamentId;
    fetch(path, {
      method: 'get',
      headers: myHeaders
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        topscorerbets: data
      });
    })
    .catch(e => {console.log(e)});
  }

  fetchPlayoffbets() {
    var tournamentId = this.props.params.tournamentId;
    var userId = this.props.params.userId;
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    var path = Constants.PLAYOFF_BETS_URL + userId + '/' + tournamentId + '/teams';
    fetch(path, {
      method: 'get',
      headers: myHeaders
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        playoffbets: data
      });
    })
    .catch(e => {console.log(e)});
  }

  fetchMatchbets() {
    var tournamentId = this.props.params.tournamentId;
    var userId = this.props.params.userId;
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    var path = Constants.MATCH_BETS_URL + userId + '/' + tournamentId;
    fetch(path, {
      method: 'get',
      headers: myHeaders
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        matchbets: data
      });
    })
    .catch(e => {console.log(e)});
  }

  render() {
    var matchbets = this.state.matchbets;
    var playoffbets = this.state.playoffbets;
    var topscorerbets = this.state.topscorerbets;
    var userName;
    var topscorerstats = '';
    if (topscorerbets.user !== undefined) {
      userName = topscorerbets.user.name;
    }
    if (topscorerbets.player !== undefined && topscorerbets.player !== null) {
      topscorerstats = (
        <div className="result-section">
          <div>Top scorer: {topscorerbets.goals}</div>
          <div>Number of goals: {topscorerbets.player.name}</div>
        </div>
      );
    }
    return (
      <div className="matches">
        <h2>Bets of {userName}</h2>
        <h3>Group stage</h3>
        <div className="result-section">
          <div className="match-header">
            <span className="header-time">Time</span>
            <span className="header-home">Home team</span>
            <span className="header-result">Result</span>
            <span className="header-away">Away team</span>
            <span className="header-bets">Bets</span>
            <span className="header-points">Points</span>
          </div>
          {matchbets.map(function(matchbet) {
            return <ResultComponent key={matchbet._id} matchbet={matchbet} />;
          }, this)}
        </div>
        <h3>Knockout stage</h3>
        <div className="result-section">
          {playoffbets.map(function(playoffbet) {
            var teams = playoffbet.teams;
            var numberTeams = teams.length;
            return (
              <div key={playoffbet._id}>
                <div className="playoff-section">Round of {playoffbet.round_of}, selected teams: {numberTeams}</div>
                {teams.map(function(team) {
                  return (
                    <span key={team._id}>{team.name} </span>
                  );
                })}
              </div>
            );
          }, this)}
        </div>
        <h3>Top scorer bet</h3>
        {topscorerstats}
      </div>
    );
  }

});
