import AppDispatcher from '../dispatchers/AppDispatcher.js';
import {LOGIN_USER, LOGOUT_USER} from '../constants/constants.js';
//import RouterContainer from '../services/RouterContainer'

export default {
  loginUser: (jwt) => {
    var savedJwt = localStorage.getItem('jwt');

    AppDispatcher.dispatch({
      actionType: LOGIN_USER,
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
    console.log(LOGOUT_USER);
    AppDispatcher.dispatch({
      actionType: LOGOUT_USER
    });
  }
}
