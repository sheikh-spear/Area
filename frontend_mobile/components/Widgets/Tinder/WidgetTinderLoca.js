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

import WidgetTinderLogin from './WidgetTinderLogin.js';

export default class WidgetTinderLoca extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      refresh: false,
      lat: "",
      lon: ""
    };
    this.openTinder = this.openTinder.bind(this);
    this.refreshMe = this.refreshMe.bind(this);
    this.sendLocation = this.sendLocation.bind(this);
    this.saveLat = this.saveLat.bind(this);
    this.saveLon = this.saveLon.bind(this);
  }

  openTinder(e) {
    this.setState({modalVisible: e});
  }

  saveLat(data) {
    this.setState({lat: data});
  }

  saveLon(data) {
    this.setState({lon: data});
  }

  refreshMe() {
    this.setState({ refresh: true });
  }

  sendLocation() {
    fetch(`http://${global.ip}:8080/api/tinder-ping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      },
      body: JSON.stringify({
        xauth: global.tinder_data.data.api_token,
        lat: this.state.lat,
        lon: this.state.lon
      })
    }).then((response) => response.json()).then((respJson) => {
      console.log(respJson);
    }).catch((error) => { console.error(error); });
  }

  render() {
    let data;
    console.log("tinder: ",global.tinder_data);
    console.log("modal tinder: ",this.state.modalVisible);
    if (global.tinder_data === undefined) {
      data = <WidgetTinderLogin refresh={this.refreshMe}/>;
    } else {
      data = <View>
                <View>
                  <Text>Latitude:</Text>
                  <TextInput style = {styles.input}
                     secureTextEntry={false}
                     underlineColorAndroid = "transparent"
                     placeholder = "lat"
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                     onChangeText = {this.saveLat}/>
                </View>
                <View>
                  <Text>Longitude:</Text>
                  <TextInput style = {styles.input}
                     secureTextEntry={false}
                     underlineColorAndroid = "transparent"
                     placeholder = "lon"
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                     onChangeText = {this.saveLon}/>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress = { () => this.sendLocation() }>
                      <Text style={{color:'white'}}>Send position</Text>
                  </TouchableOpacity>
                </View>
        </View>;
    }
    return (
      <View style={styles.container}>
      <Text style={{color:'white', textAlign: 'center'}}>get localisation</Text>
        <Modal animationType={"slide"} transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {console.log("closingmodla");}}>
          <View styles={styles.modal}>
            <TouchableOpacity onPress={() => {this.openTinder(false)}}>
              <Image style={styles.closeImg} source={{uri:"http://iconshow.me/media/images/ui/ios7-icons/png/512/close.png"}}/>
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView>
              {data}
            </ScrollView>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={() => {this.openTinder(true)}}>
          <Image style={styles.image} source={{uri: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.prospectmagazine.co.uk%2Fwp-content%2Fuploads%2F2014%2F12%2FTinder-Flame.png&f=1&nofb=1"}}/>
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
});