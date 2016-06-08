
import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import MatchComponent from './MatchComponent.js';
import AuthenticatedComponent from './AuthenticatedComponent.js';
import {Constants} from '../constants/Constants';

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
    return (
      <div className="matches">
        <h2>Matches</h2>
        <div>
          {matches.map(function(match) {
            return <MatchComponent key={match._id} match={match} />;
          })}
        </div>
      </div>
    );
  }

});
