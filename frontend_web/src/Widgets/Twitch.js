import React from "react";
import Title from "../Title";
import { Button } from "@material-ui/core";

export default class Twitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: "",
      game: "Overwatch"
    };
  }
  componentDidMount() {
    const r = this.getUrlVars();
    if (r.code !== undefined && r.code.length < 100 &&  r.scope !== undefined) {
      console.log("Twitch get access token: ", r);
      fetch(
        "http://127.0.0.1:8080/api/twitch-token/" + encodeURIComponent(r.code)
      )
        .then(z => z.json())
        .then(a => {
          console.log(a);
          localStorage.setItem("twitch_auth", a.token);
          this.setState({
            access_token: a.token
          });
        });
      this.dostuff = this.dostuff.bind(this);
    }
  }
  dostuff() {
    fetch("http://127.0.0.1:8080/api/get-top-vid/" + this.state.game)
      .then(r => r.json())
      .then(j => {
        fetch(
          "http://127.0.0.1:8080/api/send-to-contacts/" +
            encodeURIComponent(this.state.game + "'s top rated videos") +
            "/" +
            encodeURIComponent(j.url) +
            "/text",
          {
            headers: {
              outlook: localStorage.getItem("outlook_auth")
            }
          }
        );
        window.open(
          j.url,
          "twitch top rated video of" + this.state.game,
          "width=600 height=600"
        );
      });
  }
  fetchTopVideo() {
    setInterval(() => {
      fetch("http://127.0.0.1:8080/api/get-top-vid")
        .then(r => r.json())
        .then(j => {
          window.open(
            j.url,
            "twitch top rated video of" + this.state.game,
            "width=600 height=600"
          );
          fetch(
            "http://127.0.0.1:8080/api/send-to-contacts/" +
              encodeURIComponent(this.state.game + "'s top rated videos") +
              "/" +
              j.url +
              "/text",
            {
              headers: {
                outlook: localStorage.getItem("outlook_auth")
              }
            }
          );
        });
    }, 120000);
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
          <Title> Twitch </Title>
          <Button
            style={{
              marginTop: "4px",
              border: "1px solid grey"
            }}
            onClick={event => {
              event.preventDefault();
              fetch("http://127.0.0.1:8080/api/twitch-login")
                .then(r => r.json())
                .then(j => {
                  window.location.replace(j.url);
                });
            }}
          >
            {" "}Connection to Twitch{" "}
          </Button>
        </div>
      );
    } else {
      return (
        <div>
          <div>
            <input
              type="text"
              value={this.state.game}
              onChange={event => {
                this.setState({
                  game: event.target.value
                });
              }}
            />
          </div>
          <div>
            <Button
              style={{
                marginTop: "4px",
                border: "1px solid grey"
              }}
              onClick={event => {
                event.preventDefault();
                try {
                  this.dostuff();
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              {" "}Find a Video{" "}
            </Button>
          </div>
          {/* <div>
            <input
              type="text"
              value={this.state.game}
              onChange={event => {
                this.setState({
                  game: event.target.value
                });
              }}
            />
          </div>
          <div>
            <Button
              style={{
                marginTop: "4px",
                border: "1px solid grey"
              }}
              onClick={event => {
                event.preventDefault();
                try {
                  this.dostuff();
                } catch (e) {
                  console.log(e);
                }
              }}
            >
              {" "}Find Your Followers{" "}
            </Button>
          </div> */}
        </div>
      );
    }
  }
}
