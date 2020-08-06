import React from "react";
import Title from "../Title";
import { Button } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

export default class Spotify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: "",
      userName: "",
      emailAddress: "",
      artistname: "",
      playlists: null
    };
    this.getUserData = this.getUserData.bind(this);
  }
  componentDidMount() {
    const r = this.getUrlVars();
    if (
      r.code !== undefined &&
      r.code.length > 100 &&
      r.code[0] === "A" &&
      r.user_id === undefined
    ) {
      console.log("Spotify get access token: ", r);
      fetch(
        "http://127.0.0.1:8080/api/spotify-token/" + encodeURIComponent(r.code)
      )
        .then(z => z.json())
        .then(a => {
          console.log(a);
          localStorage.setItem("spotify_auth", a.spotify_token);
          this.setState({
            access_token: a.token
          });
        })
        .then(this.getUserData());
    }
  }
  getUserData() {
    fetch("http://127.0.0.1:8080/api/spotify-getUser/", {
      headers: {
        spotify: localStorage.getItem("spotify_auth")
      }
    })
      .then(z => z.json())
      .then(r => {
        this.setState({
          userName: r.body.display_name,
          emailAddress: r.body.email
        });
      });
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
          <Title> Spotify </Title>
          <Button
            style={{
              marginTop: "4px",
              border: "1px solid grey"
            }}
            onClick={event => {
              event.preventDefault();
              fetch("http://127.0.0.1:8080/api/spotify-login")
                .then(r => r.json())
                .then(j => {
                  window.location.replace(j.url);
                });
            }}
          >
            {" "}Connection to Spotify{" "}
          </Button>
        </div>
      );
    } else {
      if (this.state.playlists === null) {
        return (
          <div>
            <div>
              <Title> User's info </Title>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>E-mailAddress</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {this.state.userName}
                    </TableCell>
                    <TableCell>
                      {this.state.emailAddress}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>;
            </div>
            <div>
              <input
                type="text"
                placeholder="Artist to search"
                value={this.artistname}
                onChange={event => {
                  event.preventDefault();
                  this.setState({
                    artistname: event.target.value
                  });
                }}
              />
              <Button
                style={{
                  marginTop: "4px",
                  border: "1px solid grey"
                }}
                onClick={event => {
                  event.preventDefault();
                  fetch(
                    "http://127.0.0.1:8080/api/spotify-get-user-playlists/" +
                      encodeURIComponent(this.state.artistname),
                    {
                      headers: {
                        spotify: localStorage.getItem("spotify_auth"),
                        outlook: localStorage.getItem("outlook_auth")
                      }
                    }
                  )
                    .then(r => r.json())
                    .then(z => {
                      this.setState({
                        playlists: z.body.items
                      });
                    });
                }}
              >
                {" "}Search for playlists{" "}
              </Button>
            </div>
          </div>
        );
      }
      return (
        <div>
          <div>
            <Title> User's info </Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>E-mailAddress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {this.state.userName}
                  </TableCell>
                  <TableCell>
                    {this.state.emailAddress}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div>
            <input
              type="text"
              placeholder="Artist to search"
              value={this.artistname}
              onChange={event => {
                event.preventDefault();
                this.setState({
                  artistname: event.target.value
                });
              }}
            />
            <Button
              style={{
                marginTop: "4px",
                border: "1px solid grey"
              }}
              onClick={event => {
                event.preventDefault();
                fetch(
                  "http://127.0.0.1:8080/api/spotify-get-user-playlists/" +
                    encodeURIComponent(this.state.artistname),
                  {
                    headers: {
                      spotify: localStorage.getItem("spotify_auth"),
                      outlook: localStorage.getItem("outlook_auth")
                    }
                  }
                )
                  .then(r => r.json())
                  .then(z => {
                    this.setState({
                      playlists: z.body.items
                    });
                  });
              }}
            >
              {" "}Search for playlists{" "}
            </Button>
          </div>
          <div>
            <Title>
              {" "}{this.state.artistname}'s playlists{" "}
            </Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.playlists.map(e =>
                  <TableRow>
                    <TableCell>
                      {e.name}
                    </TableCell>
                    <TableCell>
                      {e.href}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      );
    }
  }
}
