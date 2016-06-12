import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'
import {Constants} from '../constants/Constants';
import { browserHistory, Link } from 'react-router';

const title = 'Tournament';


export default AuthenticatedComponent(class Tournament extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tournament: {},
      points: [],
      nextbets: [],
      lastresults: []
    };
  }

  componentWillMount() {
    this.fetchTournament();
    this.fetchPoints();
    this.fetchNextBets();
    this.fetchLastResults();
  }

  fetchLastResults() {
    var tournamentId = this.props.params.tournamentId;
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    var path = Constants.MATCH_BETS_URL + 'lastresults/' + tournamentId;
    fetch(path, {
      method: 'get',
      headers: myHeaders
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        lastresults: data
      });
    })
    .catch(e => {console.log(e)});
  }

  fetchNextBets() {
    var tournamentId = this.props.params.tournamentId;
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    var path = Constants.MATCH_BETS_URL + 'nextbets/' + tournamentId;
    fetch(path, {
      method: 'get',
      headers: myHeaders
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        nextbets: data
      });
    })
    .catch(e => {console.log(e)});
  }

  fetchTournament() {
    var tournamentId = this.props.params.tournamentId;
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    var path = Constants.TOURNAMENTS_URL + tournamentId;
    fetch(path, {
      method: 'get',
      headers: myHeaders
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        tournament: data
      });
    })
    .catch(e => {console.log(e)});
  }

  fetchPoints() {
    var tournamentId = this.props.params.tournamentId;
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    var path = Constants.POINTS_URL + tournamentId;
    fetch(path, {
      method: 'get',
      headers: myHeaders
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        points: data
      });
    })
    .catch(e => {console.log(e)});
  }

  handleSubmit(event) {
    event.preventDefault();
    const email = this.refs.email.value;
    const tournamentId = this.props.params.tournamentId;
    const jwt = LoginStore.getjwt()
    $.ajax({
      type: "PUT",
      url: Constants.TOURNAMENTS_URL + 'invite-user/',
      headers: {
        'x-access-token': jwt
      },
      data: {
        email: email,
        tournamentId: tournamentId
      },
      success: function(data) {
        console.log(data);
      },
      error: function(data) {
        console.log(data);
      }
    });
  }

  render() {
    var tournament = this.state.tournament;
    var nextbets = this.state.nextbets;
    var lastresults = this.state.lastresults;
    var tournamentId = this.props.params.tournamentId;
    var makeBetsUrl = '/tournaments/' + tournamentId + '/makebets/match';
    var points = this.state.points;
    var userId = LoginStore.getUserId();
    var ownResultsUrl = '/tournaments/' + tournamentId + '/results/' + userId;
    var userEmail = LoginStore.getUser().email;

    var user = LoginStore.getUser();
    var adNewUser = '';
    if (user !== null && tournament.owner !== undefined && user.email===tournament.owner.email && 1===2) {
        adNewUser = (
          <div>
            <div>Invite user:</div>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <label><input type="email" ref="email" placeholder="email" /></label>
              <button type="submit">Invite</button>
            </form>
          </div>
        );
    }

    return (
      <div className="tournament">
        <h2>{tournament.name}</h2>

        {/*
        <div><Link to={makeBetsUrl}>Make/edit your bets</Link></div>
        <div><Link to={ownResultsUrl}>Show your bets</Link></div>
        */}
        {adNewUser}

        <h3>Points</h3>
        <table>
          <thead>
            <tr>
              <td className="name-col">Name</td>
              <td>Group stage</td>
              <td>Knockout stage</td>
              <td>Top scorer</td>
              <td>Total</td>
            </tr>
          </thead>
          <tbody>
          {points.map(function(point) {
            if (point.user !== null && point.user.name !== undefined) {
              var userId = point.user._id;
              var pointId = point._id;
              var urlResults = '/tournaments/' + tournamentId + '/results/' + userId;
              return (
                <tr key={point._id}>
                  <td className="name-col"><Link to={urlResults}>{point.user.name}</Link></td>
                  <td>{point.match_points}</td>
                  <td>{point.playoff_points}</td>
                  <td>{point.topscorer_points}</td>
                  <td>{point.total_points}</td>
                </tr>
              );
            }
          })}
          </tbody>
        </table>
        <h3>Bets of the next matches</h3>
        <table>
          {nextbets.slice(0,1).map(function(nextbet) {
            return (
              <thead key="bet-header">
                <tr>
                  <td  className="name-col">Name</td>
                  {nextbet.map(function(bet) {
                    var key = bet._id + '-head';
                    return (
                      <td key={key}>{bet.match.home_team.short_name}-{bet.match.away_team.short_name}</td>
                    );
                  })}
                </tr>
              </thead>
            );
          })}
          <tbody>
            {nextbets.map(function(nextbet) {
              var userId = nextbet[0].user._id;
              var urlResults = '/tournaments/' + tournamentId + '/results/' + userId;
              var key = userId + -'row';
              return (
                <tr key={key}>
                  <td className="name-col"><Link to={urlResults}>{nextbet[0].user.name}</Link></td>
                  {nextbet.map(function(bet) {
                    return (
                      <td key={bet._id}>{bet.score.home}-{bet.score.away}<span className="bet-divider"></span>{bet.mark}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <h3>Results of the last matches</h3>
        <table>
          {lastresults.slice(0,1).map(function(nextbet) {
            return (
              <thead key="bet-header">
                <tr>
                  <td  className="name-col">Name</td>
                  {nextbet.map(function(bet) {
                    var key = bet._id + '-head';
                    var match = bet.match;
                    return (
                      <td key={key}><span><div>{match.home_team.short_name}-{match.away_team.short_name}</div><div>{match.score.home}-{match.score.away}</div></span></td>
                    );
                  })}
                </tr>
              </thead>
            );
          })}
          <tbody>
            {lastresults.map(function(nextbet) {
              var userId = nextbet[0].user._id;
              var urlResults = '/tournaments/' + tournamentId + '/results/' + userId;
              var key = userId + -'row';
              return (
                <tr key={key}>
                  <td className="name-col"><Link to={urlResults}>{nextbet[0].user.name}</Link></td>
                  {nextbet.map(function(bet) {
                    var homeBet = bet.score.home;
                    var awayBet = bet.score.away;
                    var markBet = bet.mark;
                    var homeBetSpan = '';
                    var awayBetSpan = '';
                    var markBetSpan = '';
                    if (bet.score.home === bet.match.score.home) {
                      homeBetSpan = <span className="bet-right">{homeBet}</span>;
                    }
                    else {
                      homeBetSpan = <span className="bet-wrong">{homeBet}</span>;
                    }

                    if (bet.score.away === bet.match.score.away) {
                      awayBetSpan = <span className="bet-right">{awayBet}</span>;
                    }
                    else {
                      awayBetSpan = <span className="bet-wrong">{awayBet}</span>;
                    }

                    if (bet.mark === bet.match.mark) {
                      markBetSpan = <span className="bet-right">{markBet}</span>;
                    }
                    else {
                      markBetSpan = <span className="bet-wrong">{markBet}</span>;
                    }
                    return (
                      <td key={bet._id}>{homeBetSpan}-{awayBetSpan}<span className="bet-divider2"></span>{markBetSpan}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>


      </div>
    );
  }

});
