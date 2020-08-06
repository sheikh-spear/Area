import React from "react";
import { Component } from "react";
import { Login, SignUp } from "./components/onboarding/index";
import CssBaseline from "@material-ui/core/CssBaseline";

import "./App.css";
import "./fonts.css";
import Dashboard from "./Dashboard";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginActive: true,
      auth_token: "",
      outlook_token: ""
    };

    this.changeState = this.changeState.bind(this);
    this.doStuff = this.doStuff.bind(this);
  }
  componentDidMount() {
    this.doStuff();
  }
  doStuff() {
    setInterval(() => {
      if (localStorage.getItem("auth_token") !== undefined)
        this.setState({
          auth_token: localStorage.getItem("auth_token")
        });
      if (localStorage.getItem("outlook_auth") !== undefined)
        this.setState({
          outlook_token: localStorage.getItem("outlook_auth")
        });
    }, 1000);
  }
  changeState() {
    const { isLoginActive } = this.state;
    if (isLoginActive) {
      this.rightSide.classList.remove("right");
      this.rightSide.classList.add("left");
    } else {
      this.rightSide.classList.remove("left");
      this.rightSide.classList.add("right");
    }
    this.setState(prevState => ({ isLoginActive: !prevState.isLoginActive }));
  }

  render() {
    const { isLoginActive } = this.state;
    const current = isLoginActive ? "Sign in" : "Login";
    if (
      this.state.auth_token !== "" ||
      this.state.outlook_token !== ""
    ) {
      return (
        <Dashboard/>
      );
    } else {
      return (
        <div className="App">
          <CssBaseline/>
          <div className="login">
            <div className="container">
              {isLoginActive &&
                <Login containerRef={ref => (this.current = ref)} />}
              {!isLoginActive &&
                <SignUp containerRef={ref => (this.current = ref)} />}
            </div>
            <RightSide
              current={current}
              containerRef={ref => (this.rightSide = ref)}
              onClick={this.changeState.bind(this)}
            />
          </div>
        </div>
      );
    }
  }
}

const RightSide = props => {
  return (
    <div
      className="right-side"
      ref={props.containerRef}
      onClick={props.onClick}
    >
      <div className="inner-container">
        <div className="text">
          {props.current}
        </div>
      </div>
    </div>
  );
};
export default App;
