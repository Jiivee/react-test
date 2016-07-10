import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'
import {Constants} from '../constants/Constants';
import { browserHistory } from 'react-router'

import styles from '../styles/topscorerbet.scss';

const title = 'Top Scorer Bet';


export default AuthenticatedComponent(class SetTopScorerResult extends Component {

  constructor(props) {
    super(props);
    this.state = {
      topscorer: {},
      players: [],
      teams: [],
      selectedTeam: null
    };
  }

  componentWillMount() {
    this.fetchTeams();
    this.fetchTopScorer();
  }

  fetchTopScorer() {
    fetch(Constants.TOPSCORER_URL)
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        topscorer: data
      });
    })
    .catch(e => console.log(e));
  }

  fetchTeams() {
    var path = Constants.TEAMS_URL + 'players';
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

  saveTopScorer() {
    var jwt = LoginStore.getjwt()

    var tournamentId = this.props.params.tournamentId;
    $.ajax({
      type: "PUT",
      url: Constants.SAVE_RESULTS_URL + 'topscorer',
      headers: {
        'x-access-token': jwt
      },
      data: JSON.stringify(this.state.topscorer),
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      success: function(data) {
        browserHistory.push('/');
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
    var teams = this.state.teams;
    this.setState({
      players: teams[index].players,
      selectedTeam: teamId
    });
  }

  handlePlayerChange(e) {
    var target = e.target.id;
    var playerId = target.split('-')[0];
    this.state.topscorer.player = playerId;
  }

  handleGoalChange(e) {
    var target = e.target.id;
    var goalsNumber = target.split('-')[1];
    this.state.topscorer.goals = parseInt(goalsNumber);
  }

  render() {
    var teams = this.state.teams;
    var players = this.state.players;
    var goals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    return (
      <div className="make-topscorer-bets">
        <div className="topscorer-bet-container">
          <h2>Top scorer bet</h2>
          <div>
            <p>Select first the team of the top scorer. After selecting the team, you can select the player you think will be the top scorer. If two players have scored same amount of goals, the one with most assists will be the winner. If also the amount of assists is same, then the player with least minutes played in the tournament will be the winner.</p>
            <p>Select also the amount of goals scored by the top scorer.</p>
            <p>Points:</p>
            <ul>
              <li>13 points for right top scorer</li>
              <li>5 points for right amount of goals scored by the top scorer</li>
            </ul>
          </div>
        </div>
        <div className="topscorer-bet-container">
          <div>
            <div className="section-header">Select team of top scorer:</div>
            {teams.map(function(team, index) {
              var id = team._id + '-' + index;
              return (
                <span key={team._id}>
                  <input id={id} name='team' onChange={this.handleTeamChange.bind(this)} type="radio"/>
                  <label htmlFor={id} className="top-scorer-team">{team.name}</label>
                </span>
              );
            }, this)}
          </div>
          <div>
            <div className="section-header">Select top scorer:</div>
            {players.map(function(player, index) {
              var id = player._id + '-' + index;
              return (
                <span key={player._id}>
                  <input id={id} name='player' onChange={this.handlePlayerChange.bind(this)} type="radio"/>
                  <label htmlFor={id} className="top-scorer-player">{player.name}</label>
                </span>
              );
            }, this)}
          </div>
        </div>
        <div className="topscorer-bet-container">
          <div className="section-header">Select number of goals scored by the top scorer:</div>
          {goals.map(function(goal) {
            var id = 'goal-' + goal;
            var goalName = goal;
            if (goal === 15) {
              goalName = '15+';
            }
            return (
              <span key={id}>
                <input id={id} name='goal' defaultChecked={goal===this.state.topscorer.goals} onChange={this.handleGoalChange.bind(this)} type="radio"/>
                <label htmlFor={id} className="top-scorer-goals">{goalName}</label>
              </span>
            );
          }, this)}
        </div>
        <div className="save-bets-container">
          <input className="save-bets-button" type="button" onClick={this.saveTopScorer.bind(this)} value="Save bets"/>
        </div>
      </div>
    );
  }

});
