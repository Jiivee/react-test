import React, { Component, PropTypes } from 'react';
import AuthenticatedComponent from './AuthenticatedComponent.js';
import PlayOffBetOther from './PlayOffBetOther.js';

const title = 'Playoff Bet 8';


export default AuthenticatedComponent(class PlayoffBet4 extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.params.tournamentId);
    return <PlayOffBetOther tournamentId = {this.props.params.tournamentId} selectNumberTeams={4} description={'Select 4 countries for semi-finals'}/>;
  }

});
