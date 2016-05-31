import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'
import {Constants} from '../constants/Constants';
import { browserHistory } from 'react-router'

import styles from './playoffbet.scss';

const title = 'Playoff Bet';


export default AuthenticatedComponent(class PlayoffBet16 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playoffbets: [],
      groups: []
    };
  }

  componentWillMount() {
    this.fetchGroups();
    this.fetchPlayOffBets();
  }

  fetchPlayOffBets() {
    var userId = LoginStore.getUserId();
    var tournamentId = this.props.params.tournamentId;
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    var path = Constants.PLAYOFF_BETS_URL + userId + '/' + tournamentId + '/16/team-ids';
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

  fetchGroups() {
    var path = Constants.GROUPS_URL;
    fetch(path, {
      method: 'get'
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        groups: data
      });
    })
    .catch(e => console.log(e));
  }

  handleChange(e) {
    var teamId = e.target.id;
    if (this.state.playoffbets[0].teams.length < 16) {
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
    var tournamentId = this.props.params.tournamentId;
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
        browserHistory.push('/tournaments/' + tournamentId + '/makebets/playoff/8');
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
    var groups = this.state.groups;
    console.log(this.state.playoffbets[0]);
    return (
      <div className="make-playoff-bets">
          <h1>Playoff BETS</h1>
          <div>Select 16 countries for round of 16</div>
          {groups.map(function(group) {
            var teams = group.teams;
            return (
              <div key={group._id}>
                <span>Group {group.name}</span>
                {teams.map(function(team) {
                  return (
                    <span key={team._id}>
                      <input className="bet-mark" id={team._id} name="round16" defaultChecked={this.isInArray(team._id, this.state.playoffbets[0].teams)} onChange={this.handleChange.bind(this)} type="checkbox"/>
                      <label htmlFor={team._id}>{team.name}</label>
                    </span>
                  );
                }, this)}
              </div>
            );
          }, this)}
          <input type="button" onClick={this.saveBets.bind(this)} value="Save bets"/>
      </div>
    );
  }

});
