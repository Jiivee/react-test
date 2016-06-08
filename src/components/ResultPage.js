
import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import ResultComponent from './ResultComponent.js';
import AuthenticatedComponent from './AuthenticatedComponent.js';
import {Constants} from '../constants/Constants';
import LoginStore from '../stores/LoginStore'

const title = 'Matches';


export default AuthenticatedComponent(class ResultPage extends Component {

  constructor(props) {
    super(props);
    this.state = { matchbets: [] };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    var tournamentId = this.props.params.tournamentId;
    var userId = this.props.params.userId;
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
        matchbets: data
      });
    })
    .catch(e => {console.log(e)});
  }

  render() {
    var matchbets = this.state.matchbets;
    console.log(matchbets);
    return (
      <div className="matches">
        <div>
          {matchbets.map(function(matchbet) {
            return <ResultComponent key={matchbet._id} matchbet={matchbet} />;
          })}
        </div>
      </div>
    );
  }

});
