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
import Swiper from 'react-native-deck-swiper'

import WidgetSpotifyLogin from './WidgetSpotifyLogin.js';

export default class WidgetSpotifyTemplate extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      refresh: false,
      uname: "",
      data: []
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleUname = this.handleUname.bind(this);
    this.refreshMe = this.refreshMe.bind(this);
    this.getPlaylists = this.getPlaylists.bind(this);
    this.giveMedata = this.giveMedata.bind(this);
  }

  getPlaylists() {
    fetch(`http://${global.ip}:8080/api/spotify-get-user-playlists/${this.state.uname}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`,
        "spotify": global.spotify_data,
        "outlook": global.outlook_data
      }
    }).then((response) => response.json()).then((respJson) => {
      console.log(respJson);
      this.setState({data: respJson.body.items});
    }).catch((error) => { console.error(error); });
  }

  toggleModal(e) {
    this.setState({modalVisible: e});
  }

  giveMedata() {
    if (this.state.data.length > 0) {
      return (
        this.state.data.map((dat) => {
          return (
            <View>
              <Text>{dat.name}</Text>
            </View>
          );
        })
      );
    } else {
      return (<Text></Text>);
    }
  }

  handleUname (e) {
    this.setState({uname: e});
  }

  refreshMe() {
    this.setState({ refresh: true });
  }

  render() {
    let thing;
    console.log("spotify: ",global.spotify_data);
    console.log("modal outlook: ",this.state.modalVisible);
    if (global.spotify_data === undefined) {
      thing = <WidgetSpotifyLogin refresh={this.refreshMe}/>;
    } else {
      thing = <View>
                <View>
                  <Text>Search for user:</Text>
                  <TextInput style = {styles.input}
                     secureTextEntry={false}
                     underlineColorAndroid = "transparent"
                     placeholder = "user..."
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                     onChangeText = {this.handleUname}/>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress = { () => this.getPlaylists(this.state.txt) }>
                      <Text style={{color:'white'}}>Get his playlists</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.result}>
                  {this.giveMedata()}
                </View>
              </View>;
    }
    return (
      <View style={styles.container}>
        <Text style={{color:'white', textAlign: 'center'}}>Spotify</Text>
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
          <Image style={styles.image} source={{uri: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fimg.talkandroid.com%2Fuploads%2F2016%2F01%2Fspotify-app-logo.png&f=1&nofb=1"}}/>
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
