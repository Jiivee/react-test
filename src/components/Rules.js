import React, { Component, PropTypes } from 'react';

class Rules extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="rules">
        <h2>Group stage bets</h2>
        <h3>Group stage bets</h3>
        <div >
          <p>Select the amount of goals for home and away team. Also select whether home team wins (1), teams draw (X) or away team wins (2). The score bet and the 1X2 bet may conflict: for example, you can select 3 goals for home team and 1 goal for away team and still select X.</p>
          <p>Points:</p>
          <ul>
            <li>1 point for right amount of home team goals</li>
            <li>1 point for right amount of away team goals</li>
            <li>2 points for right 1X2 bet</li>
            <li>1 extra point if all are right</li>
          </ul>
          <p>So the maximum points from each game are 5 points.</p>
        </div>
        <h3>Knockout stage bets</h3>
        <div>
          <p>Select for each round the amount of teams told in the headline. Teams on different rounds do not have to depend on each other: for example, you can select that Albania and France are the two finalists but then select that Romania will be the winner.</p>
          <p>Points:</p>
          <ul>
            <li>2 points for each right team in round of 16</li>
            <li>3 points for each right team in quarter-finals</li>
            <li>5 points for each right team in semi-finals</li>
            <li>8 points for each right team in final</li>
            <li>13 points for right winner</li>
          </ul>
        </div>
        <h3>Top scorer bet</h3>
        <div>
          <p>Select first the team of the top scorer. After selecting the team, you can select the player you think will be the top scorer. If two players have scored same amount of goals, the one with most assists will be the winner. If also the amount of assists is same, then the player with least minutes played in the tournament will be the winner.</p>
          <p>Select also the amount of goals scored by the top scorer.</p>
          <p>Points:</p>
          <ul>
            <li>13 points for right top scorer</li>
            <li>5 points for right amount of goals scored by the top scorer</li>
          </ul>
        </div>
      </div>
    )
  }

}

export default Rules;
