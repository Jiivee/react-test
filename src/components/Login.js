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
        <label><input ref="email" placeholder="email" defaultValue="joni.vayrynen@gmail.com" /></label>
        <label><input ref="pass" placeholder="password" defaultValue="joni"/></label>
        <button type="submit">login</button>
      </form>
    )
  }

}

export default Login;
