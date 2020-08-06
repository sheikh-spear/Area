import React from "react";
import Title from "../Title";

class ChuckNorrisJokes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      joke: ""
    };
  }
  componentDidMount() {
    setInterval(() => {
      fetch("http://127.0.0.1:8080/api/chuck-norris-jokes", {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("auth_token"),
          outlook: localStorage.getItem("outlook_auth")
        }
      })
        .then(res => res.json())
        .then(
          result => {
            this.setState({
              joke: result.value
            });
          },
          err => {
            this.setState({
              error: err
            });
          }
        );
    }, 10000);
  }
  render() {
    return (
      <div>
        <Title> Chuck Norris Jokes </Title>
        <p>
          {" "}{this.state.joke}{" "}
        </p>
      </div>
    );
  }
}

export default ChuckNorrisJokes;
