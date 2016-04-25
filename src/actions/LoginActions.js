import AppDispatcher from '../dispatchers/AppDispatcher.js';
import {Constants} from '../constants/Constants';
//import RouterContainer from '../services/RouterContainer'
import { browserHistory, Router, Route, Link } from 'react-router'

export default {
  loginUser: (jwt) => {
    var savedJwt = localStorage.getItem('jwt');

    AppDispatcher.dispatch({
      actionType: Constants.LOGIN_USER,
      jwt: jwt
    });

    if (savedJwt !== jwt) {
      /*
      var nextPath = RouterContainer.get().getCurrentQuery().nextPath || '/';

      RouterContainer.get().transitionTo(nextPath);
      */
      localStorage.setItem('jwt', jwt);
    }
  },
  logoutUser: () => {
    //RouterContainer.get().transitionTo('/login');
    localStorage.removeItem('jwt');
    AppDispatcher.dispatch({
      actionType: Constants.LOGOUT_USER
    });
  }
}
