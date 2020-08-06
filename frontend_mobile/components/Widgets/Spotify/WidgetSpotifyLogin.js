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

export default class WidgetSpotifyLogin extends React.Component
{
  constructor(props) {
    super(props);
    global.spotify_data = "BQAvv-r4zsSdUAAem71lcHOK5umoNEgx6huMlbcVsXp2JFxydjjy4iJ_hCpHBtl8R9vuGoO19mxlK3DnPv_Okp3gIlIVNA1-9o_60nggVdNCSJ0Ua4ZLGlCfYiNGEwUKDfvlmcMokNpy0P3-PshaTSy5Ql_kDao30WB9p807Yc1RZkysQ2FB8lfmMSf_wJXzzJMaTFwg2I5RNPRFJLl5aKeQfxA9rDGQSkjvAdIs9lOweKBriaeGigrzAMSGF_3EYRWnzHKgvMnsogvvt0EJ7U-CUB_VPaQfHBncMLIn";
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
    fetch(`http://${global.ip}:8080/api/spotify-token/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      }
    }).then((response) => response.json()).then((respJson) => {
      console.log("GETTHETOKEN");
      console.log(respJson);
      global.spotify_data = respJson.spotify_token;
      this.props.refresh(true);
    }).catch((error) => {console.error(error);});
  }

  componentDidMount() {
    fetch(`http://${global.ip}:8080/api/spotify-login`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      }
    }).then((response) => response.json()).then((respJson) => {
      this.setState({url: respJson.url});
      console.log(respJson);
    }).catch((error) => {console.error(error);});
    setTimeout(() => {
      this.setState({modalVisible: false});
      console.log("HERE2");
      this.setState({modalVisible: true});
    },1000);
  }

  render() {
    var token = "";
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
                    console.log(e.url);
                      var tmp_uri = e.url.replace('#', '?');
                      token = get_access_tkn(tmp_uri, "code");
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