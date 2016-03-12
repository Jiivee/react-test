import 'whatwg-fetch'
import {LOGIN_URL} from '../constants/constants';
import LoginActions from '../actions/LoginActions';

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
        let jwt = data.token;
        LoginActions.loginUser(jwt);
      },
      error: function(data) {
        console.log(data);
      }
    });
  }

  signup(name, email, password) {
    $.ajax({
      type: "POST",
      url: 'http://localhost:3002/register',
      data: {
        name: name,
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
  }

  logout() {
    LoginActions.logoutUser();
  }
}

export default new AuthService()
