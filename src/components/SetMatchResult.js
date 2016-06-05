
import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import MatchComponent from './MatchComponent.js';
import AuthenticatedComponent from './AuthenticatedComponent.js';
import {Constants} from '../constants/Constants';
import LoginStore from '../stores/LoginStore'

const title = 'Matches';


export default AuthenticatedComponent(class SetMatchResult extends Component {

  constructor(props) {
    super(props);
    this.state = { match: [] };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    var matchId = this.props.params.matchId;
    fetch(Constants.MATCHES_URL + matchId)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          match: data
        });
      })
      .catch(e => console.log(e));
  }

  handleSubmit(e) {
    e.preventDefault();
    const homeGoals = this.refs.homeGoals.value;
    const awayGoals = this.refs.awayGoals.value;
    this.state.match[0].score.home = homeGoals;
    this.state.match[0].score.away = awayGoals;
    var jwt = LoginStore.getjwt()
    var matchId = this.props.params.matchId;
    $.ajax({
      type: "PUT",
      url: Constants.SAVE_RESULTS_URL + 'match/' + matchId,
      headers: {
        'x-access-token': jwt
      },
      data: JSON.stringify(this.state.match[0]),
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      success: function(data) {
        browserHistory.push('/matches');
      },
      error: function(data) {
        console.log(data);
      }
    });
  }

  calculatePoints(e) {
    e.preventDefault();
    var jwt = LoginStore.getjwt()
    $.ajax({
      type: "GET",
      url: Constants.POINTS_URL + 'calculate',
      headers: {
        'x-access-token': jwt
      },
      contentType: "application/json; charset=utf-8",
      dataType: "text",
      success: function(data) {
        console.log(data);
      },
      error: function(data) {
        console.log(data);
      }
    });
  }


  render() {
    var matchData = this.state.match;
    console.log(matchData);
    return (
      <div>
        {matchData.map(function(match) {
          return (
            <form key={match._id} onSubmit={this.handleSubmit.bind(this)}>
              <div>
                <span>{match.home_team.name}</span>
                <input ref="homeGoals" type="number"/>
              </div>
              <div>
                <span>{match.away_team.name}</span>
                <input ref="awayGoals" type="number"/>
              </div>
              <button type="submit">Set Result</button>
            </form>
          );
        }, this)}
        <input type="button" onClick={this.calculatePoints.bind(this)} value="Calculate points"/>
      </div>
    );
  }

});
