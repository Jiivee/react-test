import React, { Component, PropTypes } from 'react';
import 'whatwg-fetch'
import AuthenticatedComponent from './AuthenticatedComponent.js';
import LoginStore from '../stores/LoginStore'
import {Constants} from '../constants/Constants';
import { browserHistory, Link } from 'react-router';
import auth from '../services/AuthService';

const title = 'Tournament';

export default AuthenticatedComponent(class Tournament extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tournament: {},
      points: [],
      nextbets: [],
      lastresults: [],
      playoffbets: [],
      playoffs: [],
      topscorerbets: []
    };
  }

  componentWillMount() {
    this.fetchTournament();
    this.fetchPoints();
    this.fetchNextBets();
    this.fetchLastResults();
    this.fetchPlayoffbets();
    this.fetchPlayOffs();
    this.fetchTopscorerbets();
  }

  checkResponseStatus(response) {
    if (response.status !== 403 || response.status !== 401) {
      return response;
    } else {
      auth.logout();
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }

  fetchPlayOffs() {
    fetch(Constants.PLAYOFFS_URL)
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        playoffs: data
      });
    })
    .catch(e => console.log(e));
  }

  fetchTopscorerbets() {
    var tournamentId = this.props.params.tournamentId;
    var userId = this.props.params.userId;
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    var path = Constants.TOPSCORER_BETS_URL + tournamentId;
    fetch(path, {
      method: 'get',
      headers: myHeaders
    })
    .then(this.checkResponseStatus)
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        topscorerbets: data
      });
    })
    .catch(e => {console.log(e)});
  }

  fetchPlayoffbets() {
    var tournamentId = this.props.params.tournamentId;
    var userId = this.props.params.userId;
    var jwt = LoginStore.getjwt()
    var myHeaders = new Headers({
      'x-access-token': jwt
    });
    var path = Constants.PLAYOFF_BETS_URL + tournamentId;
    fetch(path, {
      method: 'get',
      headers: myHeaders
    })
    .then(this.checkResponseStatus)
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        playoffbets: data
      });
    })
    .catch(e => {console.log(e)});
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
    .then(this.checkResponseStatus)
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
    .then(this.checkResponseStatus)
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
    .then(this.checkResponseStatus)
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
    .then(this.checkResponseStatus)
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

  isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

  render() {
    var tournament = this.state.tournament;
    var nextbets = this.state.nextbets;
    var lastresults = this.state.lastresults;
    var playoffbets = this.state.playoffbets;
    var playoffs = this.state.playoffs;
    var topscorerbets = this.state.topscorerbets;
    var tournamentId = this.props.params.tournamentId;
    var makeBetsUrl = '/tournaments/' + tournamentId + '/makebets/match';
    var points = this.state.points;
    var userId = LoginStore.getUserId();
    var ownResultsUrl = '/tournaments/' + tournamentId + '/results/' + userId;
    var userEmail = LoginStore.getUser().email;

    var numberOfUser = playoffbets.length/5;
    var roundsIter = [0,1,2,3,4];

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
              <td className="name-col"><span className="name-col-span">Name</span></td>
              <td>Group stage</td>
              <td>Knockout stage</td>
              <td>Top scorer</td>
              <td>Total</td>
            </tr>
          </thead>
          <tbody>
          {points.map(function(point) {
            if (point.user !== null && point.user.name !== undefined && point.total_points !== 0) {
              var userId = point.user._id;
              var pointId = point._id;
              var urlResults = '/tournaments/' + tournamentId + '/results/' + userId;
              return (
                <tr key={point._id}>
                  <td className="name-col"><span className="name-col-span"><Link to={urlResults}>{point.user.name}</Link></span></td>
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

        {/*
        DONT SHOW UPCOMING MATHCES OR LATEST RESULTS ON KNOCKOUT STAGE
        <h3>Bets of the next matches</h3>
        <table>
          {nextbets.slice(0,1).map(function(nextbet) {
            return (
              <thead key="bet-header">
                <tr>
                  <td  className="name-col">Name</td>
                  {nextbet.map(function(bet, index) {
                    var key = bet._id + '-head';
                    var row;
                    if (index === 3) {
                      row = <td className="hide" key={key}>{bet.match.home_team.short_name}-{bet.match.away_team.short_name}</td>;
                    }
                    else {
                      row = <td key={key}>{bet.match.home_team.short_name}-{bet.match.away_team.short_name}</td>;
                    }
                    return (
                      row
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
              if (nextbet[0].mark !== null) {
                return (
                  <tr key={key}>
                    <td className="name-col"><span className="name-col-span"><Link to={urlResults}>{nextbet[0].user.name}</Link></span></td>
                    {nextbet.map(function(bet, index) {
                      var row;
                      if (index === 3) {
                        row = <td className="hide" key={bet._id}>{bet.score.home}-{bet.score.away}<span className="bet-divider"></span>{bet.mark}</td>;
                      }
                      else {
                        row = <td key={bet._id}>{bet.score.home}-{bet.score.away}<span className="bet-divider"></span>{bet.mark}</td>;
                      }
                      return (
                        row
                      );
                    })}
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
        <h3>Results of the last matches</h3>
        <table>
          {lastresults.slice(0,1).map(function(nextbet) {
            return (
              <thead key="bet-header">
                <tr>
                  <td className="name-col">Name</td>
                  {nextbet.map(function(bet, index) {
                    var key = bet._id + '-head';
                    var match = bet.match;
                    var row;
                    if (index === 3) {
                      row = <td className="hide" key={key}><span><div>{match.home_team.short_name}-{match.away_team.short_name}</div><div>{match.score.home}-{match.score.away}</div></span></td>;
                    }
                    else {
                      row = <td key={key}><span><div>{match.home_team.short_name}-{match.away_team.short_name}</div><div>{match.score.home}-{match.score.away}</div></span></td>;
                    }
                    return (
                      row
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
              if (nextbet[0].mark !== null) {
                return (
                  <tr key={key}>
                    <td className="name-col"><span className="name-col-span"><Link to={urlResults}>{nextbet[0].user.name}</Link></span></td>
                    {nextbet.map(function(bet, index) {
                      var homeBet = bet.score.home;
                      var awayBet = bet.score.away;
                      var markBet = bet.mark;
                      var homeBetSpan = '';
                      var awayBetSpan = '';
                      var markBetSpan = '';
                      var row;
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

                      if (index === 3) {
                        row = <td className="hide" key={bet._id}>{homeBetSpan}-{awayBetSpan}<span className="bet-divider2"></span>{markBetSpan}</td>;
                      }
                      else {
                        row = <td key={bet._id}>{homeBetSpan}-{awayBetSpan}<span className="bet-divider2"></span>{markBetSpan}</td>;
                      }
                      return (
                        row
                      );
                    })}
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
        DONT SHOW UPCOMING MATHCES OR LATEST RESULTS ON KNOCKOUT STAGE
        */}

        <h3>Knockout stage bets</h3>
        {roundsIter.map(function(iter) {
          var headline;
          if (iter === 0) {
            headline = 'Round of 16';
          }
          else if (iter === 1) {
            headline = 'Quarter-finals';
          }
          else if (iter === 2) {
            headline = 'Semi-finals';
          }
          else if (iter === 3) {
            headline = 'Final';
          }
          else if (iter === 4) {
            headline = 'Winner';
          }
          return (
            <table className="playoff-table" key={iter}>
              <thead>
                <tr>
                  <td className="name-col">Name</td>
                  <td className="playoffbet-col">{headline}</td>
                </tr>
              </thead>
              <tbody>
                {playoffbets.slice(numberOfUser*iter, numberOfUser*(iter+1)).map(function(playoffbet, index) {
                  var playoffbetTeams = playoffbet.teams;
                  var rightTeams = playoffs[iter].teams;
                  if (playoffbet.user !== null && playoffbet.user.name !== undefined && playoffbet.teams.length !== 0) {
                    var playoffKey = playoffbet.user._id + iter;
                    var userId = playoffbet.user._id;
                    var urlResults = '/tournaments/' + tournamentId + '/results/' + userId;
                    return (
                      <tr key={playoffKey}>
                        <td className="name-col"><Link to={urlResults}>{playoffbet.user.name}</Link></td>
                        <td className="playoffbet-col">
                          {playoffbetTeams.map(function(team) {
                            var teamSpan;
                            if (this.isInArray(team._id, rightTeams)) {
                              teamSpan = <span className="playoff-bet-result-right" key={team._id}>{team.short_name}</span>;
                            }
                            else if (rightTeams.length === playoffbet.round_of) {
                              teamSpan = <span className="playoff-bet-result-wrong" key={team._id}>{team.short_name}</span>;
                            }
                            else {
                              teamSpan = <span className="playoff-bet-result" key={team._id}>{team.short_name}</span>;
                            }
                            return (
                              teamSpan
                            );
                          }, this)}
                        </td>
                      </tr>
                    );
                  }
                }, this)}
              </tbody>
            </table>
          );
        }, this)}

        <h3>Top Scorer bets</h3>
        <table>
          <thead>
            <tr>
              <td className="name-col">Name</td>
              <td className="">Player</td>
              <td className="">Number of Goals</td>
            </tr>
          </thead>
          <tbody>
            {topscorerbets.map(function(topscorerbet) {
              if (topscorerbet.user !== null && topscorerbet.user.name !== undefined && topscorerbet.player !== null) {
                var userId = topscorerbet.user._id;
                var urlResults = '/tournaments/' + tournamentId + '/results/' + userId;
                var key = topscorerbet._id + userId;
                return (
                  <tr key={key}>
                    <td className="name-col"><Link to={urlResults}>{topscorerbet.user.name}</Link></td>
                    <td className="">{topscorerbet.player.name}</td>
                    <td className="">{topscorerbet.goals}</td>
                  </tr>
                );
              }
            }, this)}
          </tbody>
        </table>
      </div>
    );
  }

});
