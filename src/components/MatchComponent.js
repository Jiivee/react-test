import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { browserHistory, Router, Route, Link } from 'react-router';
import LoginStore from '../stores/LoginStore'

class MatchComponent extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    //Classes for flags
    var home = this.props.match.home_team.short_name;
    var homeClasses = classNames(home, 'home-flag');
    var away = this.props.match.away_team.short_name;
    var awayClasses = classNames(away, 'away-flag');

    //Date stuff
    var date = new Date(this.props.match.time);

    var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var dayName = dayNames[date.getDay()];

    var dd = date.getDate();
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear();
    var dateFormat = dd+'.'+mm+'.'+yyyy;

    var hh = date.getHours() -1;
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
    if (this.props.match.score.home === null) {
      homeScore = 'X';
      awayScore = 'X';
    }
    else {
      homeScore = this.props.match.score.home;
      awayScore = this.props.match.score.away;
    }

    var id = this.props.match._id;
    var setResultRoute = '/matches/' + id + '/setresult';

    var user = LoginStore.getUser();

    var link = '';
    if (user !== null && user.email==='joni.vayrynen@gmail.com') {
        link = <Link to={setResultRoute}>EDIT</Link>;
    }

    return (
      <div className="match">
        {link}
        <span className="time">{dayName} {dateFormat} {timeFormat}</span>
        <span className="group">{this.props.match.group.name}</span>
        <div className="teams-container">
            <div className="home-team-container">
                <span className={homeClasses}></span>
                <span className="home-name">{this.props.match.home_team.name}</span>
                <span className="home-score">{homeScore}</span>
            </div>
            <span className="divider">-</span>
            <div className="away-team-container">
                <span className="away-score">{awayScore}</span>
                <span className={awayClasses}></span>
                <span className="away-name">{this.props.match.away_team.name}</span>
            </div>
        </div>
      </div>
    );
  }

}

export default MatchComponent;
