import React, { Component, PropTypes } from 'react';
import auth from '../services/AuthService'

class Login extends Component {

  constructor(props) {
    super(props);
  }


  handleSubmit(event) {
    event.preventDefault();

    const email = this.refs.email.value;
    const pass = this.refs.pass.value;
    console.log(email);
    auth.login(email, pass);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div className="auth-form">
          <div><input ref="email" placeholder="email" type="email"/></div>
          <div><input ref="pass" placeholder="password" type="password"/></div>
          <div><button type="submit">Login</button></div>
        </div>
      </form>
    )
  }

}

export default Login;
