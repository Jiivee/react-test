import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
//import MatchBetComponent from './MatchBetComponent.js';
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'

const title = 'Bet';


export default AuthenticatedComponent(class Bet extends Component {

  constructor(props) {
    super(props);
    this.state = { bets: [] };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    var userId = LoginStore.getUserId();
    var jwt = LoginStore.getjwt()
    console.log(jwt);

    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    fetch('http://localhost:3002/users/' + userId, {
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

  render() {
    var bets = this.state.bets;
    console.log(bets);
    return (
      <div>
        <div>
        <h1>Hello {this.props.user ? this.props.user.name : ''}</h1>

          <h1>BETS</h1>
          {bets.map(function(match) {
            return <MatchComponent key={match._id} match={match} />;
          })}
        </div>
      </div>
    );
  }

});
