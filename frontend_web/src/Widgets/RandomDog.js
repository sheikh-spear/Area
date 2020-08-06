import React from "react";

class RandomDog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      pathToImage: null
    };
    this.loadDogImage = this.loadDogImage.bind(this);
  }
  componentDidMount() {
    console.log("dog: ", global.auth_token);
    console.log("here");
    setInterval(
      fetch("http://127.0.0.1:8080/api/random-dog", {
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
              pathToImage: result.message
            });
          },
          err => {
            this.setState({
              pathToImage: null,
              error: err
            });
            console.log(err);
          }
        ),
      30000
    );
  }
  loadDogImage(event) {
    event.preventDefault();
    fetch("http://127.0.0.1:8080/api/random-dog", {
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
            pathToImage: result.message
          });
        },
        err => {
          this.setState({
            pathToImage: null,
            error: err
          });
          console.log(err);
        }
      )
      .then(
        fetch(
          "http://127.0.0.1:8080/api/send-to-contacts/" +
            encodeURIComponent("Look at this cute dog") +
            "/" +
            encodeURIComponent("<img alt=\"Dog\" src=\""+this.state.pathToImage+"\"/>")+"/html",
          {
            headers: {
              outlook: localStorage.getItem("outlook_auth")
            }
          }
        )
      );
  }
  render() {
    if (this.state.error) {
      return (
        <div>
          Error: {this.state.error.message}
        </div>
      );
    }
    if (!this.state.pathToImage) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <div>
            <img
              alt="Dog"
              style={{ width: 200, height: 200 }}
              src={this.state.pathToImage}
            />
          </div>
          <div>
            <button style={{ margin: 20 }} onClick={this.loadDogImage}>
              New Dog !
            </button>
          </div>
        </div>
      );
    }
  }
}

export default RandomDog;
