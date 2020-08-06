
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

export default class WidgetOutlookSendMail extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      refresh: false,
      email_to: "",
      subject: "",
      message: "",
      content_type: "text"
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.refreshMe = this.refreshMe.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSubject = this.setSubject.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.sendMail = this.sendMail.bind(this);
  }

  setEmail(data) {
    this.setState({email_to: data});
  }

  setSubject(data) {
    this.setState({subject: data});
  }

  setMessage(data) {
    this.setState({message: data});
  }

  toggleModal(e) {
    this.setState({modalVisible: e});
  }

  sendMail() {
    console.log("email:");
    console.log(this.state.email_to);
    console.log("subject:");
    console.log(this.state.subject);
    console.log("message:");
    console.log(this.state.message);
    fetch(`http://${global.ip}:8080/api/outlook-send-mail/${this.state.email_to}/${this.state.subject}/${this.state.message}/${this.state.content_type}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`,
        "outlook": global.outlook_data
      }
    }).then((response) => response.json()).then((respJson) => {
      console.log(respJson);
      //this.setState({data: respJson.value});
    }).catch((error) => { console.error(error); });
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
      thing = <View style={{height:'80%'}}>
        <View>
          <Text style={{textAlign: 'center'}}>Email:</Text>
          <TextInput style = {styles.input}
             underlineColorAndroid = "transparent"
             placeholder = "Email"
             placeholderTextColor = "#9a73ef"
             autoCapitalize = "none"
             onChangeText = {this.setEmail}/>
        </View>
        <View>
          <Text style={{textAlign: 'center'}}>Subject:</Text>
          <TextInput style = {styles.input}
             underlineColorAndroid = "transparent"
             placeholder = "subject"
             placeholderTextColor = "#9a73ef"
             autoCapitalize = "none"
             onChangeText = {this.setSubject}/>
        </View>
        <View>
          <Text style={{textAlign: 'center'}}>Message:</Text>
          <TextInput style = {styles.input}
             underlineColorAndroid = "transparent"
             placeholder = "message"
             placeholderTextColor = "#9a73ef"
             autoCapitalize = "none"
             onChangeText = {this.setMessage}/>
        </View>
        <View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress = { () => this.sendMail() }>
              <Text style={{color:'white', textAlign: 'center'}}>Send</Text>
          </TouchableOpacity>
        </View>
        </View>;
    }
    return (
      <View style={styles.container}>
        <Text style={{color:'white', textAlign: 'center'}}>send mails</Text>
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
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1,
    textAlign: 'center'
  },
  submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40,
   },
});
