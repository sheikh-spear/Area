import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Image,
  ScrollView
} from 'react-native';
import WebView from 'react-native-webview';

import WidgetTwitchLogin from './WidgetTwitchLogin.js';

export default class WidgetTwitchVideo extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      txt: "",
      modalVisible: false,
      url: "",
      refresh: false,
      data: undefined
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.refreshMe = this.refreshMe.bind(this);
    this.handleTxt = this.handleTxt.bind(this);
    this.getTopVid = this.getTopVid.bind(this);
  }

  handleTxt(event) {
    this.setState({ txt: event });
  }

  toggleModal(e) {
    this.setState({modalVisible: e});
  }

  refreshMe() {
    console.log("HERE");
    this.setState({ refresh: true });
  }

  getTopVid() {
    fetch(`http://${global.ip}:8080/api/get-top-vid/${this.state.txt}`, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${global.token}`,
        "twitch": global.twitch
      }
    }).then((resp) => resp.json())
      .then((respJson) => {
        console.log(respJson);
        this.setState({url: respJson.url});
      }).catch((error)=> { console.error(error);});
  }

  render() {
    let thing;
    console.log("twitch: ",global.twitch_data);
    console.log("modal twitch: ",this.state.modalVisible);
    if (global.twitch_data === undefined) {
      thing = <WidgetTwitchLogin refresh={this.refreshMe}/>;
    } else {
      thing = <View>
                <View>
                  <Text>Search for game:</Text>
                  <TextInput style = {styles.input}
                     secureTextEntry={false}
                     underlineColorAndroid = "transparent"
                     placeholder = "game..."
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                     onChangeText = {this.handleTxt}/>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress = { () => this.getTopVid(this.state.txt) }>
                      <Text style={{color:'white'}}>Get top video</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.result}>
                  <Text>{this.state.url}</Text>
                </View>
              </View>;
    }
    return (
      <View style={styles.container}>
        <Text style={{color:'white', textAlign: 'center'}}>Twitch</Text>
        <Modal animationType={"slide"} transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {console.log("closingmodla");}}>
          <View styles={styles.modal}>
            <TouchableOpacity onPress={() => {this.toggleModal(false)}}>
              <Image style={styles.closeImg} source={{uri:"http://iconshow.me/media/images/ui/ios7-icons/png/512/close.png"}}/>
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView>
              {thing}
            </ScrollView>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={() => {this.toggleModal(true)}}>
          <Image style={styles.image} source={{uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.windowscentral.com%2Fsites%2Fwpcentral.com%2Ffiles%2Fstyles%2Flarge%2Fpublic%2Ftopic_images%2F2016%2Ftwitch-logo-topic.png%3Fitok%3DDzYxyBF2&f=1&nofb=1"}}/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#343a40',
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
  },
  email: {
    backgroundColor: 'cyan',
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
  },
  closeImg: {
    width: 30,
    height: 30
  },
  modal: {
    flex: 1
  },
  tinderImg: {
    width: 540,
    height: 600
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1
  },
  submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40,
   },
  result: {
    marginTop: 50,
    backgroundColor: "green",
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 510
  },
  resultTxt: {
    fontSize: 30
  }
});
