import 'whatwg-fetch'
import {LoginConstants} from '../constants/LoginConstants';
import LoginActions from '../actions/LoginActions';

class AuthService {
  login(email, password) {
    $.ajax({
      type: "POST",
      url: LoginConstants.LOGIN_URL,
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
      url: LoginConstants.SIGNUP_URL,
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
