import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { browserHistory, Router, Route, Link } from 'react-router';

class ResultComponent extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    //Classes for flags
    var home = this.props.matchbet.match.home_team.short_name;
    var homeClasses = classNames(home, 'home-flag');
    var away = this.props.matchbet.match.away_team.short_name;
    var awayClasses = classNames(away, 'away-flag');

    //Date stuff
    var date = new Date(this.props.matchbet.match.time);

    var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var dayName = dayNames[date.getDay()];

    var dd = date.getDate();
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear();
    var dateFormat = dd+'.'+mm+'.'+yyyy;

    var hh = date.getHours()-1;
    var min = date.getMinutes();
    if (hh<10) {
        hh='0'+hh
    }
    if (min<10) {
        min='0'+min
    }
    var timeFormat = hh+':'+min;

    //Scores: X if not yet set
    var homeScore, awayScore;
    if (this.props.matchbet.match.score.home === null) {
      homeScore = 'X';
      awayScore = 'X';
    }
    else {
      homeScore = this.props.matchbet.match.score.home;
      awayScore = this.props.matchbet.match.score.away;
    }

    var homeBet, awayBet, markBet;
    if (this.props.matchbet.score.home === null) {
      homeBet = ' ';
      awayBet = ' ';
      markBet = ' ';
    }
    else {
      homeBet = this.props.matchbet.score.home;
      awayBet = this.props.matchbet.score.away;
      markBet = this.props.matchbet.mark;
    }

    var id = this.props.matchbet.match._id;
    var setResultRoute = '/matches/' + id + '/setresult';


    var awayBetClasses;
    var homeBetSpan = '';
    var awayBetSpan = '';
    var markBetSpan = '';
    if (this.props.matchbet.match.score.home === null) {
      homeBetSpan = <span className="bet">{homeBet}</span>;
      awayBetSpan = <span className="bet">{awayBet}</span>;
      markBetSpan = <span className="bet">{markBet}</span>;
    }
    else {
      if (this.props.matchbet.match.score.home === this.props.matchbet.score.home) {
        homeBetSpan = <span className="bet-right">{homeBet}</span>;
      }
      else {
        homeBetSpan = <span className="bet-wrong">{homeBet}</span>;
      }

      if (this.props.matchbet.match.score.away === this.props.matchbet.score.away) {
        awayBetClasses = classNames('away-bet-score', 'bet-right');
        awayBetSpan = <span className={awayBetClasses}>{awayBet}</span>;
      }
      else {
        awayBetClasses = classNames('away-bet-score', 'bet-wrong');
        awayBetSpan = <span className={awayBetClasses}>{awayBet}</span>;
      }

      if (this.props.matchbet.match.mark === this.props.matchbet.mark) {
        markBetSpan = <span className="bet-right">{markBet}</span>;
      }
      else {
        markBetSpan = <span className="bet-wrong">{markBet}</span>;
      }
    }


    return (
      <div className="match">
        <div className="time">{dayName} {dateFormat} {timeFormat}</div>
        <span className="group">{this.props.matchbet.match.group.name}</span>
        <div className="teams-container">
          <div className="home-team-container">
            <span className={homeClasses}></span>
            <span className="home-name">{this.props.matchbet.match.home_team.name}</span>
            <span className="home-score">{homeScore}</span>
          </div>
          <span className="divider">-</span>
          <div className="away-team-container">
            <span className="away-score">{awayScore}</span>
            <span className={awayClasses}></span>
            <span className="away-name">{this.props.matchbet.match.away_team.name}</span>
          </div>
        </div>
        <div className="bet-results">
          <div className="bet-results-score">
            {homeBetSpan}
            <span className="divider">-</span>
            {awayBetSpan}
          </div>
          <div  className="bet-results-mark">
            {markBetSpan}
            <span className="points">{this.props.matchbet.points}</span>
          </div>
        </div>
      </div>
    );
  }

}

export default ResultComponent;
