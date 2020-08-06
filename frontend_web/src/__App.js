import React from "react";
import Dashboard from "./Dashboard";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Title from "./Title";
import logo from "./logo.svg";
import "./App.css";


class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth_token: "",
      view_to_show: "login",
      user: "",
      pass: "",
      passr: ""
    };
    global.auth_token = ""
    this.changeLogin = this.changeLogin.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changePasswordR = this.changePasswordR.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  changeLogin(event) {
    this.setState({
      login: event.target.value
    });
  }

  changePassword(event) {
    this.setState({
      pass: event.target.value
    });
  }

  changePasswordR(event) {
    this.setState({
      passr: event.target.value
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
      .then(result => result.json())
      .then(j => {
        this.setState({auth_token: j.token});
        localStorage.setItem('auth_token', j.token);
        console.log(global.auth_token);
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
      .then(r => console.log(r))
      .then(
        this.setState({
          view_to_show: "login"
        })
      );
  }

  render() {
    if (this.state.auth_token === "") {
      if (this.state.view_to_show === "login") {
        return (
          <div>
            <Title> AREA SignIn </Title>
            <div>
              <input
                type="text"
                value={this.state.login}
                onChange={this.changeLogin}
              />
            </div>
            <div>
              <input
                type="password"
                value={this.state.pass}
                onChange={this.changePassword}
              />
            </div>
            <div>
              <Button
                block
                bsSize="large"
                style={{
                  width: "20%",
                  padding: "10px",
                  background: "#2196F3",
                  color: "white",
                  "font-size": "17px",
                  border: "1px solid grey",
                  "border-left": "none",
                  cursor: "pointer",
                  align: "center"
                }}
                onClick={this.signIn}
                type="submit"
              >
                Login
              </Button>
            </div>
          </div>
        );
      } else if (this.state.view_to_show === "register") {
        return (
          <div>
            <Title> AREA Register </Title>
            <div>
              <input
                type="text"
                value={this.state.login}
                onChange={this.changeLogin}
              />
            </div>
            <div>
              <input
                type="password"
                value={this.state.pass}
                onChange={this.changePassword}
              />
            </div>
            <div>
              <input
                type="password"
                value={this.state.passr}
                onChange={this.changePasswordR}
              />
            </div>
            <div>
              <Button
                block
                bsSize="large"
                style={{
                  width: "20%",
                  padding: "10px",
                  background: "#2196F3",
                  color: "white",
                  "font-size": "17px",
                  border: "1px solid grey",
                  "border-left": "none",
                  cursor: "pointer",
                  align: "center"
                }}
                onClick={this.signUp}
                type="submit"
              >
                Login
              </Button>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div>
          <Dashboard/>
        </div>
      );
    }
  }
}

function App() {
  return (
    <div className="App">
      <MainView />
    </div>
  );
}

export default App;
