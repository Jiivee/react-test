import React, { Component, PropTypes } from 'react';

class MatchComponent extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
      {this.props.match.home_team.name}-{this.props.match.away_team.name}
      </div>
    );
  }

}

export default MatchComponent;
