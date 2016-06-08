import React from 'react';
import { render } from 'react-dom'
import App from './App';
import Matches from './components/Matches'
import Rules from './components/Rules'
import Tournaments from './components/Tournaments'
import Tournament from './components/Tournament'
import NewTournament from './components/NewTournament'
import MatchBet from './components/MatchBet'
import PlayoffBet from './components/PlayoffBet'
import TopScorerBet from './components/TopScorerBet'
import SetMatchResult from './components/SetMatchResult'
import ResultPage from './components/ResultPage'
import NewUser from './components/NewUser'
import Login from './components/Login'
import Signup from './components/Signup'
import LoginStore from './stores/LoginStore'
import LoginActions from './actions/LoginActions';
import { browserHistory, Router, Route, Link } from 'react-router'

function requireAuth(nextState, replace) {
  let jwt = localStorage.getItem('jwt');
  if (jwt) {
    LoginActions.loginUser(jwt);
  }
  const authStatus = LoginStore.isLoggedIn();
  if (!authStatus) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

render((
  <Router history={browserHistory}>
    <Route component={App}>
      <Route path="/" component={Matches}/>
      <Route path="/rules" component={Rules}/>
      <Route path="matches/:matchId/setresult" component={SetMatchResult} onEnter={requireAuth}/>
      <Route path="tournaments" component={Tournaments} onEnter={requireAuth}/>
      <Route path="tournaments/:tournamentId" component={Tournament} onEnter={requireAuth}/>
      <Route path="tournaments/:tournamentId/makebets/match" component={MatchBet} onEnter={requireAuth}/>
      <Route path="tournaments/:tournamentId/makebets/playoff" component={PlayoffBet} onEnter={requireAuth}/>
      <Route path="tournaments/:tournamentId/makebets/topscorer" component={TopScorerBet} onEnter={requireAuth}/>
      <Route path="tournaments/:tournamentId/results/:userId" component={ResultPage} onEnter={requireAuth}/>
      <Route path="newtournament" component={NewTournament} onEnter={requireAuth}/>
      <Route path="newuser/:jwt" component={NewUser}/>
      <Route path="login" component={Login} />
      <Route path="signup" component={Signup} />
    </Route>
  </Router>
), document.getElementById('root'))
