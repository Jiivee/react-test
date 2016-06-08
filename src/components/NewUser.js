import React, { Component, PropTypes } from 'react';
import auth from '../services/AuthService';
import jwt_decode from 'jwt-decode';

class NewUser extends Component {

  constructor(props) {
    super(props);
  }


  handleSubmit(event) {
    event.preventDefault();

    var token = this.props.params.jwt;
    var decoded = jwt_decode(token);
    var email = decoded.email;
    var pass = this.refs.pass.value;
    var name = this.refs.name.value;
    auth.newuser(email, name, pass);
  }

  render() {
    var token = this.props.params.jwt;
    console.log(token);
    var decoded = jwt_decode(token);
    console.log(decoded);
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div className="auth-form">
          <div>{decoded.email}</div>
          <div><input ref="name" placeholder="name" type="text"/></div>
          <div><input ref="pass" placeholder="password" type="password"/></div>
          <div><button type="submit">Save</button></div>
        </div>
      </form>
    )
  }

}

export default NewUser;
