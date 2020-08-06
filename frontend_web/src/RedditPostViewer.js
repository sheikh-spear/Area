import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import Title from "./Title";

class RedditPostViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      posts: null,
      subreddit: null,
      displaying: false,
      loggedIn: false
    };
    this.changeText = this.changeText.bind(this);
    this.loadSubredditStuff = this.loadSubredditStuff.bind(this);
    this.logUserIn = this.logUserIn.bind(this);
  }
  logUserIn(event) {
    event.preventDefault();
    this.setState({
      loggedIn: true
    });
  }
  changeText(event) {
    this.setState({
      subreddit: event.target.value
    });
  }
  loadSubredditStuff(event) {
    event.preventDefault();
    fetch(
      "http://127.0.0.1:8080/api/reddit-searchSubreddit/" +
        encodeURI(this.state.subreddit),
      {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("auth_token")
        }
      }
    )
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            posts: result,
            displaying: true
          });
          console.log(result);
        },
        err => {
          this.setState({
            pathToImage: null,
            error: err
          });
          console.log(err);
        }
      );
  }
  render() {
    if (this.state.loggedIn === false) {
      return (
        <div>
          <Title> Reddit SignIn </Title>
          <form onSubmit={this.logUserIn}>
            <FormGroup controlId="email" bsSize="large" placeholder="Email">
              <FormControl autoFocus type="email" />
            </FormGroup>
            <FormGroup
              controlId="password"
              bsSize="large"
              placeholder="Password"
            >
              <FormControl type="password" />
            </FormGroup>
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
              onClick={this.logUserIn}
              type="submit"
            >
              Login
            </Button>
          </form>
        </div>
      );
    }
    if (this.state.displaying === false) {
      return (
        <div>
          <div>
            <Title>Reddit post viewer</Title>
            <input
              type="text"
              value={this.state.subreddit}
              onChange={this.changeText}
            />
          </div>
          <div />
          <div>
            <button
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
              onClick={this.loadSubredditStuff}
            >
              search
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div>
            <Title>Reddit post viewer </Title>
            <input
              type="text"
              value={this.state.subreddit}
              onChange={this.changeText}
            />
          </div>
          <div>
            <button
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
              onClick={this.loadSubredditStuff}
            >
              search
            </button>
          </div>
          <div>
            <React.Fragment>
              <Title>
                {this.state.subreddit}'s latest posts
              </Title>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Post titles</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.posts.map(e =>
                    <TableRow>
                      <TableCell>
                        {e}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </React.Fragment>
          </div>
        </div>
      );
    }
  }
}

export default RedditPostViewer;
