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

export default class WidgetTinderPerson extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      refresh: false,
      txt: "",
      data: undefined
    };
    this.openTinder = this.openTinder.bind(this);
    this.refreshMe = this.refreshMe.bind(this);
    this.saveTxt = this.saveTxt.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  openTinder(e) {
    this.setState({modalVisible: e});
  }

  refreshMe() {
    this.setState({ refresh: true });
    this.props.refresh(true);
    this.setState({txt: ""});
  }

  saveTxt(data) {
    this.setState({ txt: data });
  }

  sendMessage() {
    fetch(`http://${global.ip}:8080/api/tinder-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      },
      body: JSON.stringify({
        xauth: global.tinder_data.data.api_token,
        matchid: this.props.data.id,
        message: this.state.txt
      })
    }).then((response) => response.json()).then((respJson) => {
      this.refreshMe();
      console.log(respJson);
    }).catch((error) => { console.error(error); });
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal animationType={"slide"} transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {console.log("closingmodla");}}>
          <View styles={styles.modal}>
            <TouchableOpacity onPress={() => {this.openTinder(false)}}>
              <Image style={styles.closeImg} source={{uri:"http://iconshow.me/media/images/ui/ios7-icons/png/512/close.png"}}/>
            </TouchableOpacity>
          </View>
          <View>
            <View style={{height: '80%'}}>
              <ScrollView>
                {this.props.data.messages.map((msg) => {
                  if (this.props.data.person._id == msg.from) {
                    return (<Text>{msg.message}</Text>);
                  } else {
                    return (<Text style={styles.yourmessage}>{msg.message}</Text>);
                  }
                })}
              </ScrollView>
            </View>
            <View>
              <View>
                <TextInput style = {styles.input}
                   secureTextEntry={false}
                   underlineColorAndroid = "transparent"
                   placeholder = "message"
                   placeholderTextColor = "#9a73ef"
                   autoCapitalize = "none"
                   onChangeText = {this.saveTxt}/>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress = { () => this.sendMessage() }>
                    <Text style={{color:'white'}}>Send text</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <TouchableOpacity style={styles.button}
          onPress={() => {this.openTinder(true)}}>
          <Image style={styles.image} source={{uri: this.props.url}}/>
          <Text style={styles.nameTxt}>{this.props.name}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
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
  },
  button: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  nameTxt: {
    fontSize: 20
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
  yourmessage: {
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: '#ADD8E6',
    textAlign: 'right'
  }
});
