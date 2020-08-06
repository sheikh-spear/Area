import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Button } from "@material-ui/core";
import Title from "../Title";

class Github extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      pass: "",
      loggedin: false,
      notifications: undefined,
      repos: undefined,
      user: ""
    };
    this.changeLogin = this.changeLogin.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.signIn = this.signIn.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.getRepos = this.getRepos.bind(this);
  }
  changePassword(event) {
    this.setState({
      pass: event.target.value
    });
  }
  changeLogin(event) {
    this.setState({
      login: event.target.value
    });
  }

  signIn(event) {
    event.preventDefault();
    this.setState({
      loggedin: true
    });
    this.getNotifications();
  }

  getNotifications() {
    setInterval(() => {
      fetch(
        "http://127.0.0.1:8080/api/github-notifications/" +
          encodeURIComponent(this.state.login) +
          "/" +
          encodeURIComponent(this.state.pass)
      )
        .then(r => r.json())
        .then(j =>
          this.setState({
            notifications: j
          })
        );
    }, 1000);
  }

  changeUser(event) {
    this.setState({
      user: event.target.value
    });
  }

  getRepos(event) {
    event.preventDefault();
    fetch(
      "http://127.0.0.1:8080/api/github-repos/" +
        encodeURIComponent(this.state.login) +
        "/" +
        encodeURIComponent(this.state.pass) +
        "/" +
        encodeURIComponent(this.state.repos)
    )
      .then(r => r.json())
      .then(j =>
        this.setState({
          repos: j
        })
      );
  }

  render() {
    if (
      this.state.loggedin === false ||
      this.state.notifications === undefined
    ) {
      return (
        <div>
          <Title> Github SignIn </Title>
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
                marginTop: "4px",
                border: "1px solid grey"
              }}
              onClick={this.signIn}
              type="submit"
            >
              Login
            </Button>
          </div>
        </div>
      );
    } else if (this.state.repos === undefined) {
      return (
        <div>
          <div>
            <React.Fragment>
              <Title>Notifications</Title>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Repository</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.notifications.map(e =>
                    <TableRow>
                      <TableCell>
                        {e.repository.full_name}
                      </TableCell>
                      <TableCell>
                        {e.reason}
                      </TableCell>
                      <TableCell>
                        {e.subject.title}
                      </TableCell>
                      <TableCell>
                        {e.subject.type}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </React.Fragment>
          </div>
          <div>
            <div>
              <input
                type="text"
                value={this.state.user}
                onChange={this.changeUser}
              />
            </div>
            <div>
              <Button
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
                onClick={this.getRepos}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      );
    } else if (this.state.repos !== undefined) {
      return (
        <div>
          <div>
            <React.Fragment>
              <Title>Notifications</Title>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Repository</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.notifications.map(e =>
                    <TableRow>
                      <TableCell>
                        {e.repository.full_name}
                      </TableCell>
                      <TableCell>
                        {e.reason}
                      </TableCell>
                      <TableCell>
                        {e.subject.title}
                      </TableCell>
                      <TableCell>
                        {e.subject.type}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </React.Fragment>
          </div>
          <div>
            <React.Fragment>
              <Title>
                {this.state.user}'s latest repos
              </Title>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Repo titles</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.repos.map(e =>
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
          <div>
            <input
              type="text"
              value={this.state.user}
              onChange={this.changeUser}
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
              onClick={this.getRepos}
            >
              search
            </button>
          </div>
        </div>
      );
    }
  }
}

export default Github;
