import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from 'react-native';

import LoginScreen from '../screens/LoginScreen';

export default class Disconnect extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      disconnect: false
    };
    this.disconnect = this.disconnect.bind(this);
  }

  disconnect(event) {
    event.preventDefault();
    global.token = undefined;
    this.setState({disconnect: true});
    console.log("HERE");
  }

  render() {
    if (this.disconnect == false) {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={ (e) => this.disconnect(e)}>
            <Image style={styles.image} source={{uri: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.clker.com%2Fcliparts%2FW%2F9%2FB%2Fo%2Fq%2FH%2Flogout-button-hi.png&f=1&nofb=1"}}/>
          </TouchableOpacity>
        </View>
      );
    } else {
      this.disconnect = false;
      return (<LoginScreen />);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    width: 150,
    height: 150,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
  },
  image: {
    width: 140,
    height: 140
  }
});
