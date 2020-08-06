import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Moment from "moment";
import Title from "../Title";
var graph = require("@microsoft/microsoft-graph-client");

class Outlook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: localStorage.getItem("outlook_auth"),
      mails: null,
      calendar: null,
      contact: null,
      subject: null,
      mailcontent: null,
      toaddress: null
    };
    this.fetchMails = this.fetchMails.bind(this);
    this.changeMail = this.changeMail.bind(this);
    this.changeMailContent = this.changeMailContent.bind(this);
    this.changeSubject = this.changeSubject.bind(this);
    this.sendMail = this.sendMail.bind(this);
    this.doStuff = this.doStuff.bind(this);
    this.doThing = this.doThing.bind(this);
  }
  componentDidMount() {
    if (
      localStorage.getItem("outlook_auth") !== "" &&
      localStorage.getItem("outlook_auth") !== undefined
    ) {
      this.doThing();
      this.fetchMails();
    } else {
      this.doStuff();
    }
  }
  doThing() {
    var j = localStorage.getItem("outlook_auth");
    this.setState({
      access_token: j
    });
  }
  doStuff() {
    setInterval(() => {
      if (
        localStorage.getItem("outlook_auth") !== undefined &&
        localStorage.getItem("outlook_auth") !== "" &&
        this.state.access_token === ""
      ) {
        var j = localStorage.getItem("outlook_auth");
        this.setState({
          access_token: j
        });
        this.fetchMails();
      }
    }, 1000);
  }
  changeMailContent(event) {
    this.setState({
      mailcontent: event.target.value
    });
  }
  changeSubject(event) {
    this.setState({
      subject: event.target.value
    });
  }
  changeMail(event) {
    this.setState({
      toaddress: event.target.value
    });
  }
  async sendMail(eaddress, saddress, subject) {
    const client = graph.Client.init({
      authProvider: done => {
        done(null, this.state.access_token);
      }
    });
    var mail = {
      subject: "I got a mail from" + saddress,
      toRecipients: [
        {
          emailAddress: {
            address: eaddress
          }
        }
      ],
      body: {
        content: subject,
        contentType: "text"
      }
    };
    console.log(mail);
    try {
      let response = await client.api("/me/sendMail").post({ message: mail });
      console.log(response);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async fetchMails() {
    setInterval(() => {
      fetch("http://127.0.0.1:8080/api/outlook-get-mail", {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("auth_token"),
          outlook: localStorage.getItem("outlook_auth")
        }
      })
        .then(r => r.json())
        .then(result =>
          this.setState({
            mails: result.value
          })
        );
      fetch("http://127.0.0.1:8080/api/outlook-calendar", {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("auth_token"),
          outlook: localStorage.getItem("outlook_auth")
        }
      })
        .then(j => j.json())
        .then(result2 =>
          this.setState({
            calendar: result2.value
          })
        );
      fetch("http://127.0.0.1:8080/api/outlook-contacts", {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("auth_token"),
          outlook: localStorage.getItem("outlook_auth")
        }
      }).then(a => a.json()).then(json => {
        this.setState({
          contact: json.value
        });
      });
    }, 5000);
  }
  render() {
    if (this.state.access_token !== "" && this.state.mails !== null) {
      var keys = Object.keys(this.state.mails);
      if (
        this.state.calendar != null &&
        this.state.mails !== null &&
        this.state.contact !== null
      ) {
        return (
          <div align="center">
            <div>
              <React.Fragment>
                <Title>Recieved mails</Title>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Sender</TableCell>
                      <TableCell>Subject</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.mails.map(e =>
                      <TableRow>
                        <TableCell>
                          {e.from.emailAddress.address}
                        </TableCell>
                        <TableCell>
                          {e.subject}
                          </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </React.Fragment>
            </div>
            <div>
              <React.Fragment>
                <Title>Calendar</Title>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject</TableCell>
                      <TableCell>Start</TableCell>
                      <TableCell>End</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.calendar.map(e =>
                      <TableRow>
                        <TableCell>
                          {e.subject}
                        </TableCell>
                        <TableCell>
                          {Moment(e.start.dateTime).format(
                            "DD MM YYYY -- HH:mm"
                          )}
                        </TableCell>
                        <TableCell>
                          {Moment(e.end.dateTime).format("DD MM YYYY -- HH:mm")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </React.Fragment>
            </div>
            <div>
              <React.Fragment>
                <Title>Contacts</Title>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Email Address</TableCell>
                      <TableCell>First Name</TableCell>
                      <TableCell>Family Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.contact.map(e =>
                      <TableRow>
                        <TableCell>
                          {e.emailAddresses[0].address}
                        </TableCell>
                        <TableCell>
                          {e.givenName}
                        </TableCell>
                        <TableCell>
                          {e.surname}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </React.Fragment>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <React.Fragment>
              <Title>Recieved mails</Title>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Sender</TableCell>
                    <TableCell>Subject</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {keys.map(r =>
                    this.state.mails.map(e =>
                      <TableRow>
                        <TableCell>
                          {e.from.emailAddress.address}
                        </TableCell>
                        <TableCell>
                          {e.subject}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </React.Fragment>
          </div>
        );
      }
    } else {
      return (
        <div>
          <p> Please login with office for this </p>
        </div>
      );
    }
  }
}

export default Outlook;
