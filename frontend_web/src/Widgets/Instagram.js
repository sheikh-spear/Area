import React from "react";
import Title from "../Title";
import { Button } from "@material-ui/core";

export default class Instagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: ""
    };
  }
  componentDidMount() {
    const r = this.getUrlVars();
    if (r.code !== undefined && r.user_id !== undefined) {
      console.log("Instagram get access token: ", r);
      fetch(
        "http://127.0.0.1:8080/api/instagram-token/" + encodeURIComponent(r.code)
      )
        .then(z => z.json())
        .then(a => {
          console.log(a);
          localStorage.setItem("instagram_auth", a.token);
          this.setState({
            access_token: a.token
          });
        });
    }
  }
  getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(
      m,
      key,
      value
    ) {
      vars[key] = value;
    });
    return vars;
  }
  render() {
    if (this.state.access_token === "") {
      return (
        <div id="connect">
          <Title> Instagram </Title>
          <Button
            style={{
              marginTop: "4px",
              border: "1px solid grey"
            }}
            onClick={event => {
              event.preventDefault();
              fetch("http://127.0.0.1:8080/api/instagram-login")
                .then(r => r.json())
                .then(j => {
                  window.location.replace(j.url);
                });
            }}
          >
            {" "}Connection to Instagram{" "}
          </Button>
        </div>
      );
    } else {
      return <p>You are logged In</p>;
    }
  }
}