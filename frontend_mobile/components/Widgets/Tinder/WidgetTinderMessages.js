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

import WidgetTinderLogin from './WidgetTinderLogin.js';
import WidgetTinderPerson from './WidgetTinderPerson.js';

export default class WidgetTinderMessages extends React.Component
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
  }

  openTinder(e) {
    this.setState({modalVisible: e});
    console.log(global.tinder_data);
    if (global.tinder_data === undefined) {
      console.log("NOTING");
    }else{
      this.getLiked();
    }
  }

  refreshMe(val) {
    this.setState({ refresh: val });
    this.getLiked();
  }

  getLiked() {
    fetch(`http://${global.ip}:8080/api/tinder-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      },
      body: JSON.stringify({
        xauth: global.tinder_data.data.api_token,
      })
    }).then((response) => response.json()).then((respJson) => {
      this.setState({data: respJson.matches});
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
      if (this.state.data != undefined) {
        data = this.state.data.map((data) => {
          return(<View><WidgetTinderPerson refresh={this.getLiked} data={data} name={data.person.name} url={data.person.photos[0].processedFiles[0].url} /></View>);
        });
      } else {
        this.getLiked();
        data = <Text>Loading</Text>
      }
    }
    return (
      <View style={styles.container}>
      <Text style={{color:'white', textAlign: 'center'}}>get last messages</Text>
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
    width: 140,
    height: 140
  }
});
