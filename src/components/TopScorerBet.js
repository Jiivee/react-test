import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'
import {Constants} from '../constants/Constants';
import { browserHistory } from 'react-router'

import styles from './topscorerbet.scss';

const title = 'Top Scorer Bet';


export default AuthenticatedComponent(class TopScorerBet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      topscorerbet: {},
      players: [],
      teams: [],
      selectedTeam: null
    };
  }

  componentWillMount() {
    this.fetchTeams();
    this.fetchTopScorerBets();
  }

  fetchTopScorerBets() {
    var userId = LoginStore.getUserId();
    var tournamentId = this.props.params.tournamentId;
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
        topscorerbet: data
      });
    })
    .catch(e => console.log(e));
  }

  fetchTeams() {
    var path = Constants.TEAMS_URL + 'players';
    console.log(path)
    fetch(path, {
      method: 'get'
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        teams: data
      });
    })
    .catch(e => console.log(e));
  }

  saveBets() {
    var jwt = LoginStore.getjwt()
    var tournamentId = this.props.params.tournamentId;
    $.ajax({
      type: "PUT",
      url: Constants.TOPSCORER_BETS_URL,
      headers: {
        'x-access-token': jwt
      },
      data: JSON.stringify(this.state.topscorerbet),
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      success: function(data) {
        browserHistory.push('/tournaments/' + tournamentId);
      },
      error: function(data) {
        console.log(data);
      }
    });
  }

  handleTeamChange(e) {
    var target = e.target.id;
    var teamId = target.split('-')[0];
    var index = target.split('-')[1];
    console.log(index);
    var teams = this.state.teams;
    console.log(teams[index]);
    this.setState({
      players: teams[index].players,
      selectedTeam: teamId
    });
  }

  handlePlayerChange(e) {
    var target = e.target.id;
    var playerId = target.split('-')[0];
    this.state.topscorerbet.player = playerId;
    this.state.topscorerbet.player_team = this.state.selectedTeam;
  }

  handleGoalChange(e) {
    var target = e.target.id;
    var goalsNumber = target.split('-')[1];
    this.state.topscorerbet.goals = parseInt(goalsNumber);
  }

  render() {
    console.log(this.state);
    var teams = this.state.teams;
    console.log(teams);
    var players = this.state.players;
    var goals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    return (
      <div className="make-topscorer-bets">
        <div>
          <div>Select team of top scorer:</div>
          {teams.map(function(team, index) {
            var id = team._id + '-' + index;
            return (
              <span key={team._id}>
                <input id={id} name='team' onChange={this.handleTeamChange.bind(this)} type="radio"/>
                <label htmlFor={id}>{team.name}</label>
              </span>
            );
          }, this)}
        </div>
        <div>
          <div>Select top scorer:</div>
          {players.map(function(player, index) {
            var id = player._id + '-' + index;
            return (
              <span key={player._id}>
                <input id={id} name='player' onChange={this.handlePlayerChange.bind(this)} type="radio"/>
                <label htmlFor={id}>{player.name}</label>
              </span>
            );
          }, this)}
        </div>
        <div>
          <div>Select number of goals scored by the top scorer:</div>
          {goals.map(function(goal) {
            var id = 'goal-' + goal;
            var goalName = goal;
            if (goal === 15) {
              goalName = '15+';
            }
            return (
              <span key={id}>
                <input id={id} name='goal' defaultChecked={goal===this.state.topscorerbet.goals} onChange={this.handleGoalChange.bind(this)} type="radio"/>
                <label htmlFor={id}>{goalName}</label>
              </span>
            );
          }, this)}
        </div>
        <input type="button" onClick={this.saveBets.bind(this)} value="Save bets"/>
      </div>
    );
  }

});
