import 'whatwg-fetch'
import {LOGIN_URL} from '../constants/constants';
//import LoginActions from '../actions/LoginActions';

class AuthService {

  login(email, password) {
    $.ajax({
      type: "POST",
      url: 'http://localhost:3002/authenticate',
      data: {
        email: email,
        password: password
      },
      success: function(data) {
        console.log(data);
      },
      error: function(data) {
        console.log(data);
      }
    });
    /*
    return fetch('http://localhost:3002/authenticate', {
      method: 'POST',
      headers: {
        'x-access-token': 'aaaaaa'
      },
      body: {
        email: 'joni.vayrynen@gmail.com',
        password: 'joni'
      }
    })
    .then((response) => response.json())
    .then((data) => { console.log(data)})
  */
  }
/*
  logout() {
    LoginActions.logoutUser();
  }

  signup(username, password, extra) {
    return this.handleAuth(when(request({
      url: SIGNUP_URL,
      method: 'POST',
      crossOrigin: true,
      type: 'json',
      data: {
        username, password, extra
      }
    })));
  }

  handleAuth(loginPromise) {
    return loginPromise
      .then(function(response) {
        var jwt = response.id_token;
        LoginActions.loginUser(jwt);
        return true;
      });
  }
  */
}

export default new AuthService()