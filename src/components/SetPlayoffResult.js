import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'
import {Constants} from '../constants/Constants';
import { browserHistory } from 'react-router'

import styles from '../styles/playoffbet.scss';

const title = 'Playoff Bet';


export default AuthenticatedComponent(class SetPlayoffResult extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playoffs: [],
      groups: []
    };
  }

  componentWillMount() {
    this.fetchPlayOffs();
    this.fetchGroups();
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
    var targetId = e.target.id;
    var teamId = targetId.split('-')[1];
    var index = e.target.name.split('-')[1];
    var numberOfTeams = Math.pow(2, Math.abs(index-4));
    if (this.state.playoffs[index].teams.length < numberOfTeams) {
      if (document.getElementById(targetId).checked) {
        this.state.playoffs[index].teams.push(teamId);
      }
      else {
        this.state.playoffs[index].teams.splice(this.state.playoffs[index].teams.indexOf(teamId), 1);
      }
    }
    else {
      if (document.getElementById(targetId).checked) {
        document.getElementById(targetId).checked = false;
      }
      else {
        this.state.playoffs[index].teams.splice(this.state.playoffs[index].teams.indexOf(teamId), 1);
      }
    }
  }

  saveBets() {
    console.log('saving');
    var jwt = LoginStore.getjwt()
    var tournamentId = this.props.params.tournamentId;
    $.ajax({
      type: "PUT",
      url: Constants.SAVE_RESULTS_URL + 'playoff',
      headers: {
        'x-access-token': jwt
      },
      data: JSON.stringify(this.state.playoffs),
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

  isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

  render() {
    var groups = this.state.groups;
    var playoffs = this.state.playoffs;
    return (
      <div className="playoff-playoff-bets">
        <div className="playoff-bet-container">
          <h2>Set Knockout stage results</h2>
        </div>
          {playoffs.map(function(bets, index) {
            var betsKey = index + '-bets';
            var text = [];
            text[0] = 'Select 16 teams for round of 16';
            text[1] = 'Select 8 teams for quarter finals';
            text[2] = 'Select 4 teams for semi finals';
            text[3] = 'Select 2 finalists';
            text[4] = 'Select winner';
            return (
              <div className="playoff-bet-container" key={betsKey}>
                <div className="section-header">{text[index]}</div>
                {groups.map(function(group) {
                  var teams = group.teams;
                  var groupKey = index + '-' + group.name;
                  return (
                    <div key={groupKey}>
                      <span className="group-name">Group {group.name}</span>
                      {teams.map(function(team) {
                        var teamKey = index + '-' + team._id;
                        var roundName = 'round-' + index;
                        return (
                          <span key={team._id}>
                            <input className="bet-mark" id={teamKey} name={roundName} defaultChecked={this.isInArray(team._id, this.state.playoffs[index].teams)} onChange={this.handleChange.bind(this)} type="checkbox"/>
                            <label htmlFor={teamKey}>{team.name}</label>
                          </span>
                        );
                      }, this)}
                    </div>
                  );
                }, this)}
              </div>
            );
          }, this)}

        <div className="save-bets-container">
          <input className="save-bets-button" type="button" onClick={this.saveBets.bind(this)} value="Continue"/>
        </div>
      </div>
    );
  }

});
