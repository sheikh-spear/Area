import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Image
} from 'react-native';

import WebView from 'react-native-webview';

function get_access_tkn(url, param)
{
    var vars = {};

    url.replace(/[?&]+([^=&]+)=?([^&]*)?/gi, function( m, key, value ) {
            vars[key] = value !== undefined ? value : '';
        }
    );
    if ( param ) {
        return vars[param] ? vars[param] : null
    }
    return vars;
}

export default class WidgetTwitchLogin extends React.Component
{
  constructor(props) {
    global.twitch_data = "0drvi7vcmkfvia677i4azl18uch7oz";
    super(props);
    this.state = {
      modalVisible: true,
      url: ""
    };
    this.togleModal = this.togleModal.bind(this);
    this.getTheToken = this.getTheToken.bind(this);
  }

  togleModal(e) {
    this.setState({modalVisible: e});
  }

  getTheToken(code) {
    fetch(`http://${global.ip}:8080/api/twitch-token/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      }
    }).then((response) => response.json()).then((respJson) => {
      console.log("GETTHETOKEN");
      console.log(respJson);
      global.twitch_data = respJson.token;
      this.props.refresh(true);
    }).catch((error) => {console.error(error);});
  }

  componentDidMount() {
    fetch(`http://${global.ip}:8080/api/twitch-login`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      }
    }).then((response) => response.json()).then((respJson) => {
      this.setState({url: respJson.url});
      console.log(respJson.url);
    }).catch((error) => {console.error(error);});
    setTimeout(() => {
      this.setState({modalVisible: false});
      console.log("HERE2");
      this.setState({modalVisible: true});
    },1000);
  }

  render() {
    var token = "";
    console.log(this.state.url);
    return (
      <View>
        <Text>{this.state.modalVisible? "ON": "OOF"}</Text>
          <Modal
              animationType={'slide'} transparent={false}
              visible={this.state.modalVisible}
              onRequestClose = {() => { console.log("Modal has been closed.") } }
              >
              <WebView
                  source={{uri: this.state.url}}
                  style={{marginTop: 20}}
                  userAgent="Please no capcha"
                  onNavigationStateChange={(e) => {
                    console.log("in modal");
                    console.log("url");
                    console.log(e.url);
                    token = get_access_tkn(e.url, "code");
                    if (token != null) {
                        console.log("inlogin");
                        this.getTheToken(token);
                        this.togleModal(false)
                    }
                  }}
              />
          </Modal>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  closeImg: {
    width: 30,
    height: 30
  },
  modal: {
    flex: 1
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
   }
});
