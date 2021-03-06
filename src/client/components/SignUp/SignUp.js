import React from 'react';
import { Link } from 'react-router';
import FaWaves from 'react-icons/lib/ti/waves-outline';

import './SignUp.scss';

class SignUp extends React.Component {
  constructor() {
    super();
  }

  handleSubmit(e) {
    e.preventDefault();

    const firstName = this.refs.firstName.value;
    const lastName = this.refs.lastName.value;
    const username = this.refs.username.value;
    const email = this.refs.email.value;
    const password = this.refs.password.value;

    if (username.length > 15) {
      this.props.signupError('Username must be less than 15 characters.');

      return;
    }


    if (!email) {
      this.props.signupError('Email must not be blank.');

      return;
    }

    if (!email.includes('@')) {
      this.props.signupError('Must use valid email.');

      return;
    }

    if (password.length < 8) {
      this.props.signupError('Password must be longer than 8 characters.');

      return;
    }

    this.props.userSignUp({ firstName, lastName, username, email, password });
    this.refs.signupForm.reset();
  }

  render() {
    return (
      <div className="SignUp-container">
        <div className="SignUp-header">
          <FaWaves className="Login-logo-icon"/>
          <h1>Socket Chat</h1>
        </div>

        <div className="SignUp-form-container">
          <form onSubmit={this.handleSubmit.bind(this)} ref="signupForm" className="SignUp-form">
            <h2>Sign Up</h2>

            <div className="SignUp-input-container">
              <input type="text" ref="firstName" placeholder="First Name"/>
            </div>

            <div className="SignUp-input-container">
              <input type="text" ref="lastName" placeholder="Last Name"/>
            </div>

            <div className="SignUp-input-container">
              <input type="text" ref="username" placeholder="Username"/>
            </div>

            <div className="SignUp-input-container">
              <input type="text" ref="email" placeholder="Email"/>
            </div>

            <div className="SignUp-input-container">
              <input type="password" ref="password" placeholder="Password"/>
            </div>

            {
              this.props.errors.signup ?
                <div className="SignUp-error">
                  <p>{this.props.errors.signup}</p>
                </div>
              :
                null
            }

            <button
              type="submit"
              className="SignUp-btn">
              Start
            </button>
          </form>

          <Link className="SignUp-login" to='/login'>Already chatting? Login</Link>
        </div>
      </div>
    )
  }
}

export default SignUp;
