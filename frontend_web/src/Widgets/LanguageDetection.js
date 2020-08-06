import React from "react";
import { Button, TextField } from "@material-ui/core";

class LanguageDetection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      displayingResult: false,
      query: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      Apiresult: {}
    };
    this.checkText = this.checkText.bind(this);
    this.changeText = this.changeText.bind(this);
    this.reset = this.reset.bind(this);
  }
  changeText(event) {
    this.setState({
      query: event.target.value
    });
  }
  reset(event) {
    event.preventDefault();
    this.setState({
      displayingResult: false,
      Apiresult: null,
      query: null
    });
  }
  checkText(event) {
    event.preventDefault();
    this.setState({
      Loading: true
    });
    fetch(
      "http://127.0.0.1:8080/api/language-detector/" +
      encodeURI(this.state.query),
      {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("auth_token"),
          outlook: localStorage.getItem("outlook_auth")
        }
      }
    )
      .then(res => res.json())
      .then(
        result => {
          if (result.success === true) {
            this.setState({
              Apiresult: result.results[0],
              displayingResult: true,
              Loading: false
            });
          } else {
            this.setState({
              Apiresult: null,
              displayingResult: true,
              Loading: false
            });
          }
        },
        err => {
          this.setState({
            error: err,
            Loading: false
          });
        }
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
    if (this.state.Loading)
      return (
        <div>Loading...</div>)
    if (!this.state.displayingResult && !this.state.Loading) {
      return (
        <div>
          <div style={{
            marginLeft: 1,
            marginRight: 2
          }}>
            <TextField
              label="Text to check"
              multiline
              style={{ textAlign: "center" }}
              value={this.state.query}
              onChange={this.changeText}
              variant="outlined"
              fullWidth={true}
              placeholder="Input Text"
              rowsMax="9"
              defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            />
          </div>
          <Button onClick={this.checkText} style={{
            marginTop: "4px",
            border: "1px solid grey"
          }}>
            Scan Text
            </Button>
        </div>
      );
    } else if (this.state.displayingResult && this.state.Apiresult != null) {
      return (
        <div>
          <div>
            <h2>
              {" "}There is a{" "}
              {Number(this.state.Apiresult.probability).toFixed(2).toString()} %
              chance this is
            </h2>
            <h2>
              {" "}{this.state.Apiresult.language_name}
            </h2>
          </div>
          <div>
            <div>
              <button onClick={this.reset}>Reset</button>
            </div>
          </div>
        </div>
      );
    } else if (this.state.displayingResult && !this.state.Apiresult) {
      return (
        <div>
          <div>
            <h2> I don't know what this is </h2>
          </div>
          <div>
            <button onClick={this.reset}>Reset</button>
          </div>
        </div>
      );
    }
  }
}

export default LanguageDetection;
