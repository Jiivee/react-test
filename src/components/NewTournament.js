import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'
import {Constants} from '../constants/Constants';
import { browserHistory } from 'react-router'

const title = 'Tournaments';


export default AuthenticatedComponent(class NewTournaments extends Component {

  constructor(props) {
    super(props);
  }

  handleSubmit(event) {
    event.preventDefault();
    const name = this.refs.name.value;
    var userId = LoginStore.getUserId();
    var jwt = LoginStore.getjwt()

    var tournamentData = {
      name: name,
      owner: userId,
      game_modes: {
        goals: document.getElementById("goals").checked,
        mark: document.getElementById("mark").checked,
        eighth_finals: document.getElementById("eighth_finalists").checked,
        quarter_finals: document.getElementById("quarter_finalists").checked,
        semi_finals: document.getElementById("semi_finalists").checked,
        finals: document.getElementById("finalists").checked,
        winner: document.getElementById("winner").checked
      },
      points: {
        goals: 1,
        mark: 2,
        extra: 1,
        eighth_finals: 0,
        quarter_finals: 0,
        semi_finals: 0,
        finals: 0,
        winner: 0
      }
    }
    console.log(tournamentData);
    $.ajax({
      type: "POST",
      url: Constants.TOURNAMENTS_URL,
      headers: {
        'x-access-token': jwt
      },
      data: JSON.stringify({ 'tournament': tournamentData }),
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
    return (
      <div>
        <h1>Hello {this.props.user ? this.props.user.name : ''}</h1>

        <form onSubmit={this.handleSubmit.bind(this)}>
          <label><input ref="name" placeholder="name" /></label>
          <div>Select game modes</div>
          <div>
            <span>1X2</span>
            <input id="mark" type="radio" value="on"/>
            <input type="radio" value="off"/>
          </div>
          <div>
            <span>Goals</span>
            <input id="goals" type="radio" value="on"/>
            <input type="radio" value="off"/>
          </div>
          <div>
            <span>Eighth finalists</span>
            <input id="eighth_finalists" type="radio" value="on"/>
            <input type="radio"  value="off"/>
          </div>
          <div>
            <span>Quarter finalists</span>
            <input type="radio" id="quarter_finalists" value="on"/>
            <input type="radio" value="off"/>
          </div>
          <div>
            <span>Semi finalists</span>
            <input type="radio" id="semi_finalists" value="on"/>
            <input type="radio" value="off"/>
          </div>
          <div>
            <span>Finalists</span>
            <input type="radio" id="finalists" value="on"/>
            <input type="radio" value="off"/>
          </div>
          <div>
            <span>Winner</span>
            <input type="radio" id="winner" value="on"/>
            <input type="radio" value="off"/>
          </div>

          <button type="submit">Create new tournament</button>
        </form>
      </div>
    );
  }

});
