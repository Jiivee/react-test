import React, { Component, PropTypes } from 'react';
import AuthenticatedComponent from './AuthenticatedComponent.js';
import PlayOffBetOther from './PlayOffBetOther.js';

const title = 'Playoff Bet 8';


export default AuthenticatedComponent(class PlayoffBet2 extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.params.tournamentId);
    return <PlayOffBetOther tournamentId = {this.props.params.tournamentId} selectNumberTeams={2} description={'Select 2 countries for final'}/>;
  }

});
