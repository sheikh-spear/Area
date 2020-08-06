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

import WidgetOutlookLogin from './WidgetOutlookLogin.js';

export default class WidgetOutlookCalendar extends React.Component
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
    this.getEmails = this.getEmails.bind(this);
  }

  getEmails() {
    fetch(`http://${global.ip}:8080/api/outlook-calendar`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`,
        "outlook": global.outlook_data
      }
    }).then((response) => response.json()).then((respJson) => {
      console.log(respJson);
      this.setState({data: respJson.value});
    }).catch((error) => { console.error(error); });
  }

  toggleModal(e) {
    this.setState({modalVisible: e});
  }

  refreshMe() {
    this.setState({ refresh: true });
  }

  render() {
    let thing;
    console.log("outlook: ",global.outlook_data);
    console.log("modal outlook: ",this.state.modalVisible);
    if (global.outlook_data === undefined) {
      thing = <WidgetOutlookLogin refresh={this.refreshMe}/>;
    } else {
      if (this.state.data === undefined) {
        thing=<Text>Loading...</Text>;
        this.getEmails();
      } else {
        thing = this.state.data.map((dat) => {
          return (
            <View style={styles.email}>
              <Text>{dat.subject}</Text>
              <Text>Start: {dat.start.dateTime}</Text>
              <Text>End: {dat.end.dateTime}</Text>
            </View>
          );
        });
      }
    }
    return (
      <View style={styles.container}>
        <Text style={{color:'white', textAlign: 'center'}}>get Calendar</Text>
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
          <Image style={styles.image} source={{uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F0%2F0b%2FMicrosoft_Outlook_2013_logo.svg%2F1043px-Microsoft_Outlook_2013_logo.svg.png&f=1&nofb=1"}}/>
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
  }
});
