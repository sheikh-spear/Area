import React from "react";
import onboardingSvg from "./onboarding.svg";
import { Button } from "@material-ui/core";
import { Component } from "react";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      pass: "",
      windowObjectReference: null,
      previousUrl: null
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.signIn = this.signIn.bind(this);
    this.outlookAuth = this.outlookAuth.bind(this);
    this.getUrlVars = this.getUrlVars.bind(this);
  }
  componentDidMount() {
    const r = this.getUrlVars();
    if (r.code !== undefined && r.code[0] == 'O' && r.code.length > 100 && r.scope === undefined && r.user_id === undefined) {
      console.log("Outlook Access token");
      fetch(
        "http://127.0.0.1:8080/api/outlook-token/" + encodeURIComponent(r.code)
      )
        .then(z => z.json())
        .then(a => localStorage.setItem("outlook_auth", a.token));
    }
  }
  outlookAuth(event) {
    event.preventDefault();
    fetch("http://127.0.0.1:8080/api/outlook-login")
      .then(r => r.json())
      .then(j => {
        window.location.replace(j.url);
      });
  }
  getUrlVars() {
    var vars = {};
    window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function(m, key, value) {
        vars[key] = value;
      }
    );
    return vars;
  }
  handleUsernameChange(event) {
    this.setState({
      login: event.target.value
    });
  }

  handlePasswordChange(event) {
    this.setState({
      pass: event.target.value
    });
  }

  signIn(event) {
    event.preventDefault();
    fetch("http://127.0.0.1:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.login,
        password: this.state.pass
      })
    })
      .then(r => r.json())
      .then(j => {
        if (j.msg !== "Logged in!") {
          localStorage.setItem("auth_token", "");
          alert(j.msg);
        } else {
          localStorage.setItem("auth_token", j.token);
        }
      });
  }

  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Login</div>
        <div className="content">
          <div className="image">
            <img alt="" src={onboardingSvg} />
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                placeholder="username"
                value={this.state.login}
                onChange={this.handleUsernameChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="password"
                value={this.state.pass}
                onChange={this.handlePasswordChange}
              />
            </div>
          </div>
        </div>
        <div>
          <Button style={{
            border: "1px solid grey"
          }} type="submit" className="btn" onClick={this.signIn}>
            Login
          </Button>
        </div>
        <div>
          <Button
            block
            bsSize="large"
            style={{
              marginTop: "4px",
              border: "1px solid grey"
            }}
            onClick={this.outlookAuth}
            type="submit"
          >
            <img alt="" src={require('./ms-signin.svg')}></img>
          </Button>
        </div>
      </div>
    );
  }
}
