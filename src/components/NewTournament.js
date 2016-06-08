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
      owner: userId
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

        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="auth-form">
            <div><input ref="name" placeholder="Tournament name" /></div>
            <div><button type="submit">Create new tournament</button></div>
          </div>
        </form>
      </div>
    );
  }

});
