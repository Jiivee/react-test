
import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import MatchComponent from './MatchComponent.js';

const title = 'Matches';

class Matches extends Component {

  constructor(props) {
    super(props);
    this.state = { matches: [] };
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

  render() {
    var matches = this.state.matches;
    //matches = [{a: 1},{b: 1},{c: 3}];
    matches.map(function(match) {
      console.log(match);
    })

    return (
      <div>
        <div>

          <h1>aaaaaa</h1>
          {matches.map(function(match) {
            return <MatchComponent match={match} />;
          })}
        </div>
      </div>
    );
  }

}

export default Matches;
