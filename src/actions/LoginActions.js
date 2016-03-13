import AppDispatcher from '../dispatchers/AppDispatcher.js';
import {LoginConstants} from '../constants/LoginConstants';
//import RouterContainer from '../services/RouterContainer'

export default {
  loginUser: (jwt) => {
    var savedJwt = localStorage.getItem('jwt');

    AppDispatcher.dispatch({
      actionType: LoginConstants.LOGIN_USER,
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
      actionType: LoginConstants.LOGOUT_USER
    });
  }
}
