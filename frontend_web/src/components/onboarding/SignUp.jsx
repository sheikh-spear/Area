import React from "react";
import onboardingSvg from "./onboarding.svg";
import { Component } from "react";
import { Button } from "@material-ui/core"

export class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      pass: "",
      passr: ""
    };
    this.changeLogin = this.changeLogin.bind(this);
    this.changePass = this.changePass.bind(this);
    this.changePassR = this.changePassR.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  changeLogin(event) {
    this.setState({
      login: event.target.value
    });
  }

  changePass(event) {
    this.setState({
      pass: event.target.value
    });
  }

  changePassR(event) {
    this.setState({
      passr: event.target.value
    });
  }

  signUp(event) {
    event.preventDefault();
    fetch("http://127.0.0.1:8080/api/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.login,
        password: this.state.pass,
        password_repeat: this.state.passr
      })
    })
      .then(r => r.json())
      .then(j => alert(j.msg))
      .then(
        this.setState({
          login: "",
          pass: "",
          passr: ""
        })
      );
  }
  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">SignUp</div>
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
                onChange={this.changeLogin}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="password"
                value={this.state.pass}
                onChange={this.changePass}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-validation">Re-type password</label>
              <input
                type="password"
                name="password-validation"
                placeholder="password-validation"
                value={this.state.passr}
                onChange={this.changePassR}
              />
            </div>
          </div>
        </div>
        <div className="footer">
          <Button type="submit" className="btn" onClick={this.signUp} style={{
            border: "1px solid grey"
          }}>
            SignUp
          </Button>
        </div>
      </div>
    );
  }
}
