import 'whatwg-fetch'
import {Constants} from '../constants/Constants';
import LoginActions from '../actions/LoginActions';
import { browserHistory, Router, Route, Link } from 'react-router';

class AuthService {
  login(email, password) {
    $.ajax({
      type: "POST",
      url: Constants.LOGIN_URL,
      data: {
        email: email,
        password: password
      },
      success: function(data) {
        console.log(data);
        let jwt = data.token;
        LoginActions.loginUser(jwt);
        browserHistory.push('/');
      },
      error: function(data) {
        console.log(data);
      }
    });
  }

  signup(name, email, password) {
    console.log('singing up');
    console.log(Constants.SIGNUP_URL);
    $.ajax({
      type: "POST",
      url: Constants.SIGNUP_URL,
      data: {
        name: name,
        email: email,
        password: password
      },
      success: function(data) {
        console.log(data);
        browserHistory.push('/');
      },
      error: function(data) {
        console.log(data);
      }
    });
  }

  newuser(email, name, password) {
    console.log('new user');
    console.log(Constants.NEW_USER_URL);
    $.ajax({
      type: "POST",
      url: Constants.NEW_USER_URL,
      data: {
        name: name,
        email: email,
        password: password
      },
      success: function(data) {
        console.log(data);
        browserHistory.push('/login');
      },
      error: function(data) {
        console.log(data);
      }
    });
  }

  logout() {
    LoginActions.logoutUser();
  }
}

export default new AuthService()
