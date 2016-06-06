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
    var homeClasses = classNames(home, 'flag');
    var away = this.props.matchbet.match.away_team.short_name;
    var awayClasses = classNames(away, 'flag');

    //Date stuff
    var date = new Date(this.props.matchbet.match.time);

    var dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var dayName = dayNames[date.getDay()];

    var dd = date.getDate();
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear();
    var dateFormat = dd+'.'+mm+'.'+yyyy;

    var hh = date.getHours();
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

    return (
      <div className="match">
        <span className="time">{dayName} {dateFormat} {timeFormat}</span>
        <span className="group">{this.props.matchbet.match.group.name}</span>
        <span className={homeClasses}></span>
        <span className="home-name">{this.props.matchbet.match.home_team.name}</span>
        <span className="home-score">{homeScore}</span>
        <span className="divider">-</span>
        <span className="away-score">{awayScore}</span>
        <span className="away-name">{this.props.matchbet.match.away_team.name}</span>
        <span className={awayClasses}></span>
        <span className="home-score">{homeBet}</span>
        <span className="divider">-</span>
        <span className="away-score">{awayBet}</span>
        <span className="away-score">{markBet}</span>
        <span className="away-score">{this.props.matchbet.points}</span>
      </div>
    );
  }

}

export default ResultComponent;
