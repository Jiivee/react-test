import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'

import { browserHistory } from 'react-router'

const title = 'Tournaments';


export default AuthenticatedComponent(class Tournaments extends Component {

  constructor(props) {
    super(props);
    this.state = { tournaments: [] };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    fetch('http://localhost:3002/matches')
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          matches: data
        });
      })
      .catch(e => console.log(e));
  }

  handleSubmit(event) {
    event.preventDefault();
    const name = this.refs.name.value;
    var userId = LoginStore.getUserId();
    var jwt = LoginStore.getjwt()

    $.ajax({
      type: "POST",
      url: 'http://localhost:3002/tournaments',
      headers: {
        'x-access-token': jwt
      },
      data: {
        name: name,
        owner: userId,
        game_modes: {
            goals: true,
            mark: true,
            eighth_finals: false,
            quater_finals: false,
            semi_finals: false,
            finals: false,
            winner: false
          },
          points: {
          goals: 1,
          mark: 2,
          extra: 1,
          eighth_finals: 0,
          quater_finals: 0,
          semi_finals: 0,
          finals: 0,
          winner: 0
          }
      },
      success: function(data) {
        console.log(data);
        browserHistory.push('/');
      },
      error: function(data) {
        console.log(data);
      }
    });
  }

  render() {
    var matches = this.state.matches;
    console.log(matches);
    return (
      <div>
        <h1>Hello {this.props.user ? this.props.user.name : ''}</h1>

        <h1>Tournaments</h1>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <label><input ref="name" placeholder="name" /></label>
          <button type="submit">Create new tournament</button>
        </form>
      </div>
    );
  }

});
