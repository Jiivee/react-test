import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'
import {Constants} from '../constants/Constants';
import { browserHistory } from 'react-router'

import styles from '../styles/matchbet.scss';

const title = 'Match Bet';


export default AuthenticatedComponent(class MatchBet extends Component {

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
    var jwt = LoginStore.getjwt();
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
    const type = radioData[1];
    const matchNumber = radioData[2];
    const bet = radioData[3];
    if (type === 'home') {
      this.state.bets[matchNumber-1].score.home = bet;
    }
    else if (type === 'away') {
      this.state.bets[matchNumber-1].score.away = bet;
    }
    else if (type === 'mark') {
      this.state.bets[matchNumber-1].mark = bet;
    }
  }

  saveBets() {
    var tournamentId = this.props.params.tournamentId;
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
        browserHistory.push('/tournaments/' + tournamentId + '/makebets/playoff/');
      },
      error: function(data) {
        console.log(data);
      }
    });
  }

  render() {
    var bets = this.state.bets;
    console.log(bets);
    var goalBets = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    var markBets = ['1', 'X', '2'];

    var betRows = bets.map(function(bet) {
      var matchNumber = bet.match.match_number;
      var matchBetKey = 'bet-' + matchNumber;
      return (
        <div key={matchBetKey} className="match-bet-container">
          <div className="goals-container">
            <div className="goals-row">
              <span className="team-name" key={bet.match.home_team._id}>{bet.match.home_team.name}</span>
              {goalBets.map(function(goalNumber) {
                var betGoalsRadioName = 'bet-home-' + matchNumber;
                var betGoalId = 'bet-home-' + matchNumber + '-' + goalNumber;

                return (
                  <span key={betGoalId}>
                    <input className="bet-number-of-goals" id={betGoalId} name={betGoalsRadioName} defaultChecked={bet.score.home === goalNumber} onChange={this.handleChange.bind(this)} type="radio"/>
                    {
                      goalNumber === 8
                      ? <label htmlFor={betGoalId}>+</label>
                      : <label htmlFor={betGoalId}>{goalNumber}</label>
                    }
                  </span>
                );
              }, this)}
            </div>
            <div className="goals-row">
              <span className="team-name" key={bet.match.away_team._id}>{bet.match.away_team.name}</span>
              {goalBets.map(function(goalNumber) {
                var betGoalsRadioName = 'bet-away-' + matchNumber;
                var betGoalId = 'bet-away-' + matchNumber + '-' + goalNumber;
                return (
                  <span key={betGoalId}>
                    <input className="bet-number-of-goals" id={betGoalId} name={betGoalsRadioName} defaultChecked={bet.score.away === goalNumber} onChange={this.handleChange.bind(this)} type="radio"/>
                    {
                      goalNumber === 8
                      ? <label htmlFor={betGoalId}>+</label>
                      : <label htmlFor={betGoalId}>{goalNumber}</label>
                    }
                  </span>
                );
              }, this)}
            </div>
          </div>
          <div className="mark-container">
            {markBets.map(function(mark) {
              var betMarkRadioName = 'bet-mark-' + matchNumber;
              var betMarkId = 'bet-mark-' + matchNumber + '-' + mark;
              return (
                <div key={betMarkId}>
                  <input className="bet-mark" id={betMarkId} name={betMarkRadioName} defaultChecked={bet.mark === mark} onChange={this.handleChange.bind(this)} type="radio"/>
                  <label htmlFor={betMarkId}>{mark}</label>
                </div>
              );
            }, this)}
          </div>
        </div>

      );
    }, this);


    return (
      <div className="make-match-bets">
        <div className="match-bet-container">
          <h2>Group stage bets</h2>
          <div className="">
            <p>Select the amount of goals for home and away team. Also select whether home team wins (1), teams draw (X) or away team wins (2). The score bet and the 1X2 bet may conflict: for example, you can select 3 goals for home team and 1 goal for away team and still select X.</p>
            <p>Points:</p>
            <ul>
              <li>1 point for right amount of home team goals</li>
              <li>1 point for right amount of away team goals</li>
              <li>2 points for right 1X2 bet</li>
              <li>1 extra point if all are right</li>
            </ul>
            <p>So the maximum points from each game are 5 points.</p>
          </div>
        </div>
        {betRows}
        <div className="save-bets-container">
          <input className="save-bets-button" type="button" onClick={this.saveBets.bind(this)} value="Continue"/>
        </div>
      </div>
    );
  }

});
