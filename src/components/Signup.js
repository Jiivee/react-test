import React, { Component, PropTypes } from 'react';
import auth from '../services/AuthService'

class Signup extends Component {

  constructor(props) {
    super(props);
  }


  handleSubmit(event) {
    event.preventDefault();

    const email = this.refs.email.value;
    const password = this.refs.pass.value;
    const name = this.refs.pass.value;
    auth.signup(name, email, password);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div className="auth-form">
          <div><input ref="name" placeholder="name" type="text"/></div>
          <div><input ref="email" placeholder="email" type="email"/></div>
          <div><input ref="pass" placeholder="password" type="password"/></div>
          <div><button type="submit">Sign up</button></div>
        </div>
      </form>
    )
  }

}

export default Signup;
