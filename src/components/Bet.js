import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'
import {Constants} from '../constants/Constants';
import { browserHistory } from 'react-router'

import styles from './bet.scss';

const title = 'Bet';


export default AuthenticatedComponent(class Bet extends Component {

  constructor(props) {
    super(props);
    this.state = { bets: [] };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    var userId = LoginStore.getUserId();
    var tournamentId = this.props.params.tournamentId;
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
        bets: data
      });
    })
    .catch(e => console.log(e));
  }

  handleChange(e) {
    var radioId = e.target.id;
    var radioData = radioId.split('-');
    const team = radioData[1];
    const matchNumber = radioData[2];
    const goalsBet = radioData[3];
    if (team === 'home') {
      this.state.bets[matchNumber-1].score.home = goalsBet;
    }
    else if (team === 'away') {
      this.state.bets[matchNumber-1].score.away = goalsBet;
    }
  }

  saveBets() {
    console.log(this.state.bets);
    var jwt = LoginStore.getjwt()
    $.ajax({
      type: "PUT",
      url: Constants.MATCH_BETS_URL,
      headers: {
        'x-access-token': jwt
      },
      data: JSON.stringify(this.state.bets),
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      success: function(data) {
        browserHistory.push('/tournaments');
      },
      error: function(data) {
        console.log(data);
      }
    });
  }

  render() {
    var bets = this.state.bets;
    console.log(this.state.bets[0]);
    console.log(this);
    var goalBets = [0, 1, 2, 3, 4, 5, 6, 7, '+'];

    var betRows = bets.map(function(bet) {
      var matchNumber = bet.match.match_number;
      var matchBetKey = 'bet-' + matchNumber;
      return (
        <div key={matchBetKey} className="match-bet-container">
          <div>
            <span key={bet.match.home_team._id}>{bet.match.home_team.name}</span>
            {goalBets.map(function(goalNumber) {
              var betRadioName = 'bet-home-' + matchNumber;
              var betGoalId = 'bet-home-' + matchNumber + '-' + goalNumber;

              return (
                <span key={betGoalId}>
                  <input className="bet-number-of-goals" id={betGoalId} name={betRadioName} defaultChecked={bet.score.home === goalNumber} onChange={this.handleChange.bind(this)} type="radio"/>
                  <label htmlFor={betGoalId}>{goalNumber}</label>
                </span>
              );
            }, this)}
          </div>
          <div>
            <span key={bet.match.away_team._id}>{bet.match.away_team.name}</span>
            {goalBets.map(function(goalNumber) {
              var betRadioName = 'bet-away-' + matchNumber;
              var betGoalId = 'bet-away-' + matchNumber + '-' + goalNumber;
              return (
                <span key={betGoalId}>
                  <input className="bet-number-of-goals" id={betGoalId} name={betRadioName} defaultChecked={bet.score.away === goalNumber} onChange={this.handleChange.bind(this)} type="radio"/>
                  <label htmlFor={betGoalId}>{goalNumber}</label>
                </span>
              );
            }, this)}
          </div>
        </div>

      );
    }, this);


    return (
      <div className="make-bets">
          <h1>BETS</h1>
          {betRows}
          <input type="button" onClick={this.saveBets.bind(this)} value="Save bets"/>
      </div>
    );
  }

});
