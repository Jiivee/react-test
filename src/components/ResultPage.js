
import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import ResultComponent from './ResultComponent.js';
import AuthenticatedComponent from './AuthenticatedComponent.js';
import {Constants} from '../constants/Constants';
import LoginStore from '../stores/LoginStore';
import auth from '../services/AuthService';

const title = 'Matches';


export default AuthenticatedComponent(class ResultPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      matchbets: [],
      playoffbets: [],
      topscorerbets: {},
      playoffs: []
    };
  }

  componentWillMount() {
    this.fetchMatchbets();
    this.fetchPlayOffs();
    this.fetchPlayoffbets();
    this.fetchTopscorerbets();
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
    .then(this.checkResponseStatus)
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
    .then(this.checkResponseStatus)
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
    .then(this.checkResponseStatus)
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        matchbets: data
      });
    })
    .catch(e => {console.log(e)});
  }

  fetchPlayOffs() {
    fetch(Constants.PLAYOFFS_URL)
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        playoffs: data
      });
    })
    .catch(e => console.log(e));
  }

  isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

  render() {
    var matchbets = this.state.matchbets;
    var playoffbets = this.state.playoffbets;
    var playoffs = this.state.playoffs;
    var topscorerbets = this.state.topscorerbets;
    var userName;
    var topscorerstats = '';
    if (topscorerbets.user !== undefined) {
      userName = topscorerbets.user.name;
    }
    if (topscorerbets.player !== undefined && topscorerbets.player !== null) {
      topscorerstats = (
        <div className="result-section">
          <div>Top scorer: {topscorerbets.player.name}</div>
          <div>Number of goals: {topscorerbets.goals}</div>
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
          {playoffbets.map(function(playoffbet, index) {
            var teams = playoffbet.teams;
            var rightTeams = playoffs[index].teams;
            return (
              <div className="playoff-section" key={playoffbet._id}>
                <div>Round of {playoffbet.round_of}</div>
                {teams.map(function(team) {
                  var teamSpan;
                  if (this.isInArray(team._id, rightTeams)) {
                    teamSpan = <span className="playoff-bet-result-right" key={team._id}>{team.short_name}</span>;
                  }
                  else if (rightTeams.length === playoffbet.round_of) {
                    teamSpan = <span className="playoff-bet-result-wrong" key={team._id}>{team.short_name}</span>;
                  }
                  else {
                    teamSpan = <span className="playoff-bet-result" key={team._id}>{team.short_name}</span>;
                  }
                  return (
                    teamSpan
                  );
                }, this)}
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
