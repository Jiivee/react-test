
import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import MatchComponent from './MatchComponent.js';
import AuthenticatedComponent from './AuthenticatedComponent.js';
import {Constants} from '../constants/Constants';
import { browserHistory, Link } from 'react-router';
import LoginStore from '../stores/LoginStore'

const title = 'Matches';


export default AuthenticatedComponent(class Matches extends Component {

  constructor(props) {
    super(props);
    this.state = { matches: [] };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    fetch(Constants.MATCHES_URL)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          matches: data
        });
      })
      .catch(e => console.log(e));
  }

  render() {
    var matches = this.state.matches;
    var user = LoginStore.getUser();
    var playoffs;
    if (user !== null && user.email==='joni.vayrynen@gmail.com') {
        playoffs = <Link to="/playoffs/setresults">Set Knockout stage teams</Link>;
    }
    return (
      <div className="matches">
        <h2>Matches</h2>
        <div>
          {matches.map(function(match) {
            return <MatchComponent key={match._id} match={match} />;
          })}
        </div>
        <h2>Playoffs</h2>
        {playoffs}
      </div>
    );
  }

});
