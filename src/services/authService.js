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
        browserHistory.push('/tournaments');
      },
      error: function(data) {
        alert('Invalid email or password');
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
        browserHistory.push('/login');
      },
      error: function(data) {
        if (data.status === 409) {
          alert('An account with that email already exits.');
        }
        else {
          alert('Error in signup');
        }

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
        alert('You have already added user name and password. Please, try to login instead.');
      }
    });
  }

  logout() {
    LoginActions.logoutUser();
  }
}

export default new AuthService()
