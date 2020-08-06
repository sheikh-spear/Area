import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Image,
  ScrollView
} from "react-native";

import WidgetTinderLogin from "./TinderLogin.js";
import "../../Utils/global";

export default class WidgetTinderRecs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      refresh: false,
      data: undefined
    };
    this.openTinder = this.openTinder.bind(this);
    this.refreshMe = this.refreshMe.bind(this);
    this.getLiked = this.getLiked.bind(this);
  }
  componentDidMount() {
    setInterval(() => {
      if (global.tinder_data !== undefined && global.tinder_data.data !== undefined && global.tinder_data.data.api_token !== undefined && this.data === undefined) {
        this.getLiked();
      }
    }, 1000);
  }
  openTinder(e) {
    this.setState({ modalVisible: e });
  }

  refreshMe() {
    this.setState({ refresh: true });
  }

  getLiked() {
    fetch(`http://127.0.0.1:8080/api/tinder-getteaser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${global.token}`,
        outlook: localStorage.getItem("outlook_auth")
      },
      body: JSON.stringify({
        xauth: global.tinder_data.data.api_token
      })
    })
      .then(response => response.json())
      .then(respJson => {
        this.setState({ data: respJson.data.results });
        console.log(respJson);
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    let data;
    console.log("tinder: ", global.tinder_data);
    console.log("modal tinder: ", this.state.modalVisible);
    if (
      global.tinder_data === undefined ||
      global.tinder_data === null ||
      global.tinder_data === ""
    ) {
      data = <p> Please sign-in to Tinder </p>;
    } else {
      if (this.state.data != undefined) {
        data = this.state.data.map(data => {
          return (
            <div>
              <img
                style={styles.tinderImg}
                src={data.user.photos[0].processedFiles[0].url}
              />
              <p>
                {data.user.name}
              </p>
            </div>
          );
        });
      } else {
        data = <Text>Loading</Text>;
      }
    }
    console.log(data);
    return (
      <div
        style={{
          backgroundColor: "#343a40",
          width: 150,
          height: 150,
          marginTop: 5,
          marginLeft: 5,
          marginRight: 5,
          marginBottom: 5,
          paddingTop: 5,
          paddingLeft: 5,
          paddingRight: 5,
          paddingBottom: 5
        }}
      >
        {data}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#343a40",
    width: 150,
    height: 150,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5
  },
  img: {
    width: 140,
    height: 140
  },
  closeImg: {
    width: 30,
    height: 30
  },
  modal: {
    flex: 1
  },
  tinderImg: {
    width: 140,
    height: 140
  }
});
