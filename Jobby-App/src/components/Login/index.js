import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    email: '',
    isSignup: false,
    displayErrorMsg: false,
    errorMsg: '',
    successMsg: '',
  }

  onChangeUsername = event => this.setState({username: event.target.value})
  onChangePassword = event => this.setState({password: event.target.value})
  onChangeEmail = event => this.setState({email: event.target.value})

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({displayErrorMsg: true, errorMsg})
  }

  onLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const apiUrl = 'https://workbridge-production-2832.up.railway.app/api/login'
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password}),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg || 'Login failed')
    }
  }

  onSignup = async event => {
    event.preventDefault()
    const {username, password, email} = this.state
    const apiUrl = 'https://workbridge-production-2832.up.railway.app/api/register'
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: username, email, password, role: 'jobseeker'}),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.setState({
        successMsg: 'Account created successfully! Please login.',
        isSignup: false,
        displayErrorMsg: false,
        username: '',
        password: '',
        email: '',
      })
    } else {
      this.setState({displayErrorMsg: true, errorMsg: data.error || 'Signup failed'})
    }
  }

  toggleSignup = () => {
    this.setState(prev => ({
      isSignup: !prev.isSignup,
      displayErrorMsg: false,
      errorMsg: '',
      successMsg: '',
    }))
  }

  render() {
    const {
      username, password, email,
      isSignup, displayErrorMsg,
      errorMsg, successMsg,
    } = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form
          className="login-form"
          onSubmit={isSignup ? this.onSignup : this.onLogin}
        >
          <img
            src="/img/WorkBridge2.png"
            alt="website logo"
            className="workbridge-logo"
          />

          {successMsg && <p className="success-msg">{successMsg}</p>}

          {isSignup && (
            <>
              <label className="label-text" htmlFor="email">
                EMAIL
              </label>
              <input
                type="email"
                className="input-container"
                id="email"
                placeholder="Email"
                onChange={this.onChangeEmail}
                value={email}
              />
            </>
          )}

          <label className="label-text" htmlFor="username">
            USERNAME
          </label>
          <input
            type="text"
            className="input-container"
            id="username"
            placeholder="Username"
            onChange={this.onChangeUsername}
            value={username}
          />

          <label className="label-text" htmlFor="password">
            PASSWORD
          </label>
          <input
            type="password"
            className="input-container"
            id="password"
            placeholder="Password"
            onChange={this.onChangePassword}
            value={password}
          />

          <button type="submit" className="login-btn">
            {isSignup ? 'Sign Up' : 'Login'}
          </button>

          {displayErrorMsg && <p className="error-msg">*{errorMsg}</p>}

          <p className="toggle-text">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              className="toggle-btn"
              onClick={this.toggleSignup}
            >
              {isSignup ? ' Login' : ' Sign Up'}
            </button>
          </p>
        </form>
      </div>
    )
  }
}

export default Login