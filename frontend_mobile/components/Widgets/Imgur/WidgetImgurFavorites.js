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

import WidgetImgurLogin from './WidgetImgurLogin.js';
import ImgElem from '../../imgElem.js'

export default class WidgetImgurFavorites extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      refresh: false,
      data: undefined
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.refreshMe = this.refreshMe.bind(this);
    this.getFav = this.getFav.bind(this);
  }

  toggleModal(e) {
    this.setState({modalVisible: e});
  }

  getFav() {
    fetch(`http://${global.ip}:8080/api/imgur-favs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      },
      body: JSON.stringify({
        token: global.imgur_data,
      })
    }).then((response) => response.json()).then((respJson) => {
      console.log(respJson);
      this.setState({data: respJson.data});
    }).catch((error) => { console.error(error); });
  }

  refreshMe() {
    this.setState({ refresh: true });
  }

  render() {
    let thing;
    console.log("imgur: ",global.imgur_data);
    console.log("modal imgur: ",this.state.modalVisible);
    if (global.imgur_data === undefined) {
      thing = <WidgetImgurLogin refresh={this.refreshMe}/>;
    } else {
      if (this.state.data === undefined) {
        this.getFav();
      } else {
        thing = this.state.data.map((dat) => {
          return(
              <ImgElem name={dat.name} url={dat.link} bobj={dat} mdr={dat.images_count}/>
          );
        });
      }
    }
    return (
      <View style={styles.container}>
        <Text style={{color:'white', textAlign: 'center'}}>get favorites pics</Text>
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
          <Image style={styles.image} source={{uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.userlogos.org%2Ffiles%2Fimgur-i-logo-png.png&f=1&nofb=1"}}/>
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
