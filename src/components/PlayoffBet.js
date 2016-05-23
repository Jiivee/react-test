import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'
import {Constants} from '../constants/Constants';
import { browserHistory } from 'react-router'

import styles from './playoffbet.scss';

const title = 'Playoff Bet';


export default AuthenticatedComponent(class PlayoffBet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bets: [],
      groups: [],
      selected16: []
    };
  }

  componentWillMount() {
    this.fetchGroups();
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
    //console.log(this.state.selected16);
    var teamId = e.target.id;
    var selected16 = this.state.selected16;
    console.log(document.getElementById(teamId).checked);
    if (selected16.length < 16) {
      if (document.getElementById(teamId).checked) {
        this.state.selected16.push(teamId);
      }
      else {
        this.state.selected16.splice(this.state.selected16.indexOf(teamId), 1);
      }
    }
    else {
      if (document.getElementById(teamId).checked) {
        document.getElementById(teamId).checked = false;
      }
      else {
        this.state.selected16.splice(this.state.selected16.indexOf(teamId), 1);
      }
    }
    console.log(this.state.selected16);
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
    var groups = this.state.groups;
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
                      <input className="bet-mark" id={team._id} name="round16" onClick={this.handleChange.bind(this)} type="checkbox"/>
                      <label htmlFor={team._id}>{team.name}</label>
                    </span>
                  );
                }, this)}
              </div>
            );
          }, this)}
      </div>
    );
  }

});
