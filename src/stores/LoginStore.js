import {Constants} from '../constants/Constants';
import BaseStore from './BaseStore';
import jwt_decode from 'jwt-decode';


class LoginStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this))
    this._user = null;
    this._jwt = null;
  }

  _registerToActions(action) {
    switch(action.actionType) {
      case Constants.LOGIN_USER:
        this._jwt = action.jwt;
        this._user = jwt_decode(this._jwt);
        this.emitChange();
        break;
      case Constants.LOGOUT_USER:
        this._user = null;
        this.emitChange();
        break;
      default:
        break;
    };
  }

  get user() {
    return this._user;
  }

  get jwt() {
    return this._jwt;
  }

  getUser() {
    return this._user;
  }

  getUserId() {
    return this._user._id;
  }

  getjwt() {
    return this._jwt;
  }

  isLoggedIn() {
    return !!this._user;
  }
}

export default new LoginStore();
