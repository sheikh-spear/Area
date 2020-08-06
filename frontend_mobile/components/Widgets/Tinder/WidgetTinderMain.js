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

export default class WidgetTinderMain extends React.Component
{
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
    this.like = this.like.bind(this);
    this.dislike = this.dislike.bind(this);
  }

  openTinder(e) {
    this.setState({modalVisible: e});
  }

  refreshMe() {
    this.setState({ refresh: true });
  }

  like() {
    fetch(`http://${global.ip}:8080/api/tinder-like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      },
      body: JSON.stringify({
        xauth: global.tinder_data.data.api_token,
        id: this.state.data[0].user._id
      })
    }).then((response) => response.json()).then((respJson) => {
      console.log(respJson);
    }).catch((error) => { console.error(error); });
    var array = [...this.state.data];
    array.splice(0, 1);
    console.log(array[0]);
    this.setState({data: array});
  }

  dislike() {
    fetch(`http://${global.ip}:8080/api/tinder-pass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      },
      body: JSON.stringify({
        xauth: global.tinder_data.data.api_token,
        id: this.state.data[0].user._id
      })
    }).then((response) => response.json()).then((respJson) => {
      console.log(respJson);
    }).catch((error) => { console.error(error); });
    var array = [...this.state.data];
    array.splice(0, 1);
    console.log(array[0]);
    this.setState({data: array});
  }

  getLiked() {
    fetch(`http://${global.ip}:8080/api/tinder-getrecs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      },
      body: JSON.stringify({
        xauth: global.tinder_data.data.api_token,
      })
    }).then((response) => response.json()).then((respJson) => {
      console.log(respJson);
      this.setState({data: respJson.results});
    }).catch((error) => { console.error(error); });
  }

  render() {
    let data;
    console.log("tinder: ",global.tinder_data);
    console.log("modal tinder: ",this.state.modalVisible);
    if (global.tinder_data === undefined) {
      data = <WidgetTinderLogin refresh={this.refreshMe}/>;
    } else {
      if (this.state.data != undefined && this.state.data.length > 0) {
        data = <View>
              <View>
                <Image style={styles.tinderImg} source={{uri: this.state.data[0].user.photos[0].processedFiles[0].url}}/>
              <Text>{this.state.data[0].user.name}</Text>
            </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <TouchableOpacity style={{marginRight:50}} onPress={() => {this.like()}}>
                  <Image style={styles.closeImg} source={{uri:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fq4uweb.files.wordpress.com%2F2016%2F11%2Flike-icon.png&f=1&nofb=1"}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.dislike()}}>
                  <Image style={styles.closeImg} source={{uri:"https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.onlinewebfonts.com%2Fsvg%2Fimg_552454.png&f=1&nofb=1"}}/>
                </TouchableOpacity>
              </View>
            </View>;
      } else {
        this.getLiked();
        data = <Text>Loading</Text>
      }
    }
    return (
      <View style={styles.container}>
      <Text style={{color:'white', textAlign: 'center'}}>like or not who you want</Text>
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
  }
});
