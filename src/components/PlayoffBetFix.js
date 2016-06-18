import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'
import {Constants} from '../constants/Constants';
import { browserHistory } from 'react-router'

import styles from '../styles/playoffbet.scss';

const title = 'Playoff Bet';


export default AuthenticatedComponent(class PlayoffBetFix extends Component {

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
    var userId = this.props.params.userId;
    var tournamentId = this.props.params.tournamentId;
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
    console.log(this.state.playoffbets[index].teams.length);
    if (this.state.playoffbets[index].teams.length < numberOfTeams) {
      if (document.getElementById(targetId).checked) {
        this.state.playoffbets[index].teams.push(teamId);
      }
      else {
        this.state.playoffbets[index].teams.splice(this.state.playoffbets[index].teams.indexOf(teamId), 1);
      }
    }
    else {
      if (document.getElementById(targetId).checked) {
        document.getElementById(targetId).checked = false;
      }
      else {
        this.state.playoffbets[index].teams.splice(this.state.playoffbets[index].teams.indexOf(teamId), 1);
      }
    }
  }

  saveBets() {
    if (this.state.playoffbets[0].teams.length !== 16) {
      alert('Select 16 teams for round of 16');
    }
    else if (this.state.playoffbets[1].teams.length !== 8) {
      alert('Select 8 teams for quarter-finals');
    }
    else if (this.state.playoffbets[2].teams.length !== 4) {
      alert('Select 4 teams for semi-finals');
    }
    else if (this.state.playoffbets[3].teams.length !== 2) {
      alert('Select 2 teams for final');
    }
    else if (this.state.playoffbets[4].teams.length !== 1) {
      alert('Select winner');
    }
    else {
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
          browserHistory.push('/tournaments/' + tournamentId);
        },
        error: function(data) {
          console.log(data);
        }
      });
    }
  }

  isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

  render() {
    var groups = this.state.groups;
    var playoffbets = this.state.playoffbets;
    console.log(playoffbets);
    return (
      <div className="playoff-playoff-bets">
        <div className="playoff-bet-container">
          <h2>Knockout stage bets</h2>
          <div>
            <p>Select for each round the amount of teams told in the headline. Teams on different rounds do not have to depend on each other: for example, you can select that Albania and France are the two finalists but then select that Romania will be the winner.</p>
            <p>Points:</p>
            <ul>
              <li>2 points for each right team in round of 16</li>
              <li>3 points for each right team in quarter-finals</li>
              <li>5 points for each right team in semi-finals</li>
              <li>8 points for each right team in final</li>
              <li>13 points for right winner</li>
            </ul>
          </div>
        </div>
          {playoffbets.map(function(bets, index) {
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
                            <input className="bet-mark" id={teamKey} name={roundName} defaultChecked={this.isInArray(team._id, this.state.playoffbets[index].teams)} onChange={this.handleChange.bind(this)} type="checkbox"/>
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
