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
        <label><input ref="name" placeholder="name" defaultValue="joni" /></label>
        <label><input ref="email" placeholder="email" defaultValue="joni.vayrynen@gmail.com" /></label>
        <label><input ref="pass" placeholder="password" defaultValue="joni"/></label>
        <button type="submit">Sign up</button>
      </form>
    )
  }

}

export default Signup;
