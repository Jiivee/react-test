import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'
import {Constants} from '../constants/Constants';
import { browserHistory } from 'react-router'

import styles from './playoffbet.scss';

const title = 'Playoff Bet';


export default AuthenticatedComponent(class PlayoffBetOther extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playoffbets: []
    };
  }

  componentWillMount() {
    this.fetchPlayOffBets();
  }

  fetchPlayOffBets() {
    var userId = LoginStore.getUserId();
    var tournamentId = this.props.tournamentId;
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    var path = Constants.PLAYOFF_BETS_URL + userId + '/' + tournamentId;
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
    .catch(e => console.log(e));
  }

  handleChange(e) {
    var playoffid = Math.log2(this.props.selectNumberTeams);
    var teamId = e.target.id;
    if (this.state.playoffbets[playoffid].teams.length < this.props.selectNumberTeams) {
      if (document.getElementById(teamId).checked) {
        this.state.playoffbets[playoffid].teams.push(teamId);
      }
      else {
        this.state.playoffbets[playoffid].teams.splice(this.state.playoffbets[playoffid].teams.indexOf(teamId), 1);
      }
    }
    else {
      if (document.getElementById(teamId).checked) {
        document.getElementById(teamId).checked = false;
      }
      else {
        this.state.playoffbets[playoffid].teams.splice(this.state.playoffbets[playoffid].teams.indexOf(teamId), 1);
      }
    }
  }

  saveBets() {
    console.log(this.state.bets);
    var jwt = LoginStore.getjwt()
    $.ajax({
      type: "PUT",
      url: Constants.PLAYOFF_BETS_URL,
      headers: {
        'x-access-token': jwt
      },
      data: JSON.stringify(this.state.playoffbets),
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

  isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

  render() {
    var playoffid = this.props.selectNumberTeams;
    console.log(this.state);
    var teamsToSelect = this.state.playoffbets[playoffid*2].teams;
    return (
      <div className="make-playoff-bets">
          <h1>Playoff BETS</h1>
          <div>{this.props.description}</div>
          {teamsToSelect.map(function(team) {
            var teams = group.teams;
            return (
              <span key={team}>
                <input className="bet-mark" id={team} name="round16" defaultChecked={this.isInArray(team, this.state.playoffbets[playoffid].teams)} onChange={this.handleChange.bind(this)} type="checkbox"/>
                <label htmlFor={team}>{team}</label>
              </span>
            );
          }, this)}
          <input type="button" onClick={this.saveBets.bind(this)} value="Save bets"/>
      </div>
    );
  }

});
