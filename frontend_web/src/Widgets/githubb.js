import React, { Component } from 'react';

import ReactLoginMS from "react-ms-login";

import GitHubLogin from 'react-github-login';

class Githu extends Component {

  render() {

    const onSuccessGithub = (response) => {
      window.alert(response.code);
    } 

    return (
      <div className="App" align="center">
        <h1>LOGIN WITH GITHUB AND MICROSOFT</h1>

          {/*CLIENTID REDIRECTURI NOT CREATED YET*/}

          <GitHubLogin clientId="5245e2b4986acaaedbfd"
            onSuccess={onSuccessGithub}
            buttonText="LOGIN WITH GITHUB"
            className="git-login"
            valid={true}
            redirectUri="http://localhost:8081/"
          />

          <br />
          <br />

          {/*CLIENTID REDIRECTURI NOT CREATED YET*/}

          <ReactLoginMS
            clientId="_"
            redirectUri="_" 
            cssClass="ms-login" 
            btnContent="LOGIN WITH MICROSOFT"
            responseType="token"
            handleLogin={(data) => console.log(data)}
          />

      </div>
    );
  }
}

export default Githu;