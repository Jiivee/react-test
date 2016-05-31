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
      playoffbets: [],
      chosenTeams: []
    };
  }

  componentWillMount() {
    var selectNumberTeams = this.props.selectNumberTeams;
    this.fetchChosenTeams(selectNumberTeams*2);
    this.fetchPlayOffBets(selectNumberTeams);
  }

  fetchPlayOffBets(number_of_teams) {
    var userId = LoginStore.getUserId();
    var tournamentId = this.props.tournamentId;
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    var path = Constants.PLAYOFF_BETS_URL + userId + '/' + tournamentId + '/' + number_of_teams + '/team-ids';
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

  fetchChosenTeams(number_of_teams) {
    var userId = LoginStore.getUserId();
    var tournamentId = this.props.tournamentId;
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    var path = Constants.PLAYOFF_BETS_URL + userId + '/' + tournamentId + '/' + number_of_teams;
    fetch(path, {
      method: 'get',
      headers: myHeaders
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        chosenTeams: data
      });
    })
    .catch(e => console.log(e));
  }

  handleChange(e) {
    var teamId = e.target.id;
    if (this.state.playoffbets[0].teams.length < this.props.selectNumberTeams) {
      if (document.getElementById(teamId).checked) {
        this.state.playoffbets[0].teams.push(teamId);
      }
      else {
        this.state.playoffbets[0].teams.splice(this.state.playoffbets[0].teams.indexOf(teamId), 1);
      }
    }
    else {
      if (document.getElementById(teamId).checked) {
        document.getElementById(teamId).checked = false;
      }
      else {
        this.state.playoffbets[0].teams.splice(this.state.playoffbets[0].teams.indexOf(teamId), 1);
      }
    }
  }

  saveBets() {
    console.log(this.state.bets);
    var jwt = LoginStore.getjwt()
    var next = this.props.selectNumberTeams/2;
    var tournamentId = this.props.tournamentId;
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
        if (next === 1/2) {
          browserHistory.push('/tournaments/' + tournamentId);
        }
        else {
          browserHistory.push('/tournaments/' + tournamentId + '/makebets/playoff/' + next);
        }
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
    var chosenTeams = this.state.chosenTeams;
    //var teamsToSelect = playoffbets.teams;
    //console.log(teamsToSelect);
    return (
      <div className="make-playoff-bets">
        <h1>Playoff BETS</h1>
        <div>{this.props.description}</div>
        {chosenTeams.map(function(chosen) {
            var teams = chosen.teams;
            console.log(teams);
            return (
              <div key={chosen._id}>
              {teams.map(function(team) {
                return (
                  <span key={team._id}>
                    <input className="bet-mark" id={team._id} name="roundx" defaultChecked={this.isInArray(team._id, this.state.playoffbets[0].teams)} onChange={this.handleChange.bind(this)} type="checkbox"/>
                    <label htmlFor={team._id}>{team.name}</label>
                  </span>
                );
              }, this)}
              <input type="button" onClick={this.saveBets.bind(this)} value="Save bets"/>
              </div>
            );
        }, this)}
      </div>
    );
  }

});
