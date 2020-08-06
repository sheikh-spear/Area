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

let token = null;
var CLIENT_ID = "0c17565240bb912";
var CLIENT_SECRET = "3e3cd919e00f9467e6a4c20daae2e8304665a183";
var REQUEST_RESPONSE_TYPE = "token";

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

export default class WidgetImgurLogin extends React.Component
{
  constructor(props) {
    super(props);
    global.imgur_data = "fb43e8f77d0c7a860b347f24a0776c2f2d696614";
    this.state = {
      modalVisible: true
    };
    this.togleModal = this.togleModal.bind(this);
  }

  togleModal(e) {
    this.setState({modalVisible: e});
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({modalVisible: false});
      console.log("HERE2");
      this.setState({modalVisible: true});
    },1000);
  }

  render() {
    console.log("HERE");

    return (
      <View>
        <Text>{this.state.modalVisible? "ON": "OOF"}</Text>
          <Modal
              animationType={'slide'} transparent={false}
              visible={this.state.modalVisible}
              onRequestClose = {() => { console.log("Modal has been closed.") } }
              >
              <WebView
                  source={{uri: "https://api.imgur.com/oauth2/authorize?client_id=" + CLIENT_ID + "&response_type=" + REQUEST_RESPONSE_TYPE}}
                  style={{marginTop: 20}}
                  onNavigationStateChange={(e) => {
                      var tmp_uri = e.url.replace('#', '?');
                      token = get_access_tkn(tmp_uri, "access_token");
                      if (token != null) {
                          console.log("inlogin");
                          global.user_name = get_access_tkn(tmp_uri, "account_username");
                          global.imgur_data = token;
                          this.togleModal(false)
                          this.props.refresh(true);
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
