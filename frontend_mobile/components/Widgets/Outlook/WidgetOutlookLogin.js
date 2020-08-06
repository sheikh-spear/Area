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

export default class WidgetOutlookLogin extends React.Component
{
  constructor(props) {
    super(props);
    global.outlook_data = "eyJ0eXAiOiJKV1QiLCJub25jZSI6InNTUlVHNjFwY2RHSlBueWF0NVdmOFJHNks5ZUdpZk03eElJdTB1ZTdLR0EiLCJhbGciOiJSUzI1NiIsIng1dCI6IllNRUxIVDBndmIwbXhvU0RvWWZvbWpxZmpZVSIsImtpZCI6IllNRUxIVDBndmIwbXhvU0RvWWZvbWpxZmpZVSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85MDFjYjRjYS1iODYyLTQwMjktOTMwNi1lNWNkMGY2ZDlmODYvIiwiaWF0IjoxNTg0MjgyMDUzLCJuYmYiOjE1ODQyODIwNTMsImV4cCI6MTU4NDI4NTk1MywiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFTUUEyLzhPQUFBQTVlUHM3K3VJaGgzSDhnNXBTVDZjT3gveWwzMFRpNXdOdWVwRlFzblh2ZWs9IiwiYW1yIjpbInB3ZCJdLCJhcHBfZGlzcGxheW5hbWUiOiJERVZBUkVBIiwiYXBwaWQiOiI3MGU2ZDU3Zi05YzkyLTRkZGEtYjk3MS01YTZhYTVmMmQxZDMiLCJhcHBpZGFjciI6IjEiLCJmYW1pbHlfbmFtZSI6IlNtaXRoIiwiZ2l2ZW5fbmFtZSI6IkzDqW8iLCJpbl9jb3JwIjoidHJ1ZSIsImlwYWRkciI6IjM3LjE2Ni40NS4xMTEiLCJuYW1lIjoiTMOpbyBTbWl0aCIsIm9pZCI6IjFjM2Y4YTYxLTdlN2UtNDY0Ni1iZmNjLTEyZjQ5YjM3MjcxNCIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0xNTUyNDM1Mjc3LTE1OTY0OTU3OTUtMzA4OTYxMzczMS0zMDIzMiIsInBsYXRmIjoiMSIsInB1aWQiOiIxMDAzN0ZGRUEzRTc0RjJDIiwic2NwIjoiQ2FsZW5kYXJzLlJlYWQgQ29udGFjdHMuUmVhZCBNYWlsLlJlYWQgTWFpbC5TZW5kIG9wZW5pZCBwcm9maWxlIFVzZXIuUmVhZCBlbWFpbCIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IndNNDNPb3BLeW5QeTQ0QlpBOWdGUm5DRVBwbDc1MEJmWlp0eS1XWlAxZ3MiLCJ0aWQiOiI5MDFjYjRjYS1iODYyLTQwMjktOTMwNi1lNWNkMGY2ZDlmODYiLCJ1bmlxdWVfbmFtZSI6Imxlby5zbWl0aEBlcGl0ZWNoLmV1IiwidXBuIjoibGVvLnNtaXRoQGVwaXRlY2guZXUiLCJ1dGkiOiJwWUt5SFpZUndVZVpQNlVzLXpiU0FBIiwidmVyIjoiMS4wIiwieG1zX3N0Ijp7InN1YiI6ImdxZGhSVWpCcDlmaE4wMjRNa1hCcGpMZTFXcndpbWpDX19BV3A3OXpjQWMifSwieG1zX3RjZHQiOjE0MTc4MDQ4ODd9.b6e1hJwtyFDLKe5Q_545Iy6Lu2C8MfjrFuLj2t4Xc3dKrN0BFLaXqSwSKIhXGDobGufU8OgSeccIIawO-LFH5sizWAlBrNwXDbjpyhJd5Z07hF7dvTVZVbXUjYk22SdO-FX6s3yolRLT-6wZ6FWZzCIL2xNFimJUz7On-p29V5QR3uHs6A8dA7jTtjQzby9kyojNgXa53_ApYL8SIrr95yxEXm_1gd90a6aU9OC61_QZAg0AVziNNcQchaCE35KCeKIcWwsawS4efE_b8NsurReQhhALrSzhyNjkVNxNVog11AV3YZP1zGWlWtGleAM8DZKVwfs-eC1eyFWMzwVldw";
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
    fetch(`http://${global.ip}:8080/api/outlook-token/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      }
    }).then((response) => response.json()).then((respJson) => {
      console.log("GETTHETOKEN");
      console.log(respJson);
      global.outlook_data = respJson.token;
      this.props.refresh(true);
    }).catch((error) => {console.error(error);});
  }

  componentDidMount() {
    fetch(`http://${global.ip}:8080/api/outlook-login`, {
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
    var token = null;
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
                  onNavigationStateChange={(e) => {
                    console.log("in modal");
                      var tmp_uri = e.url.replace('#', '?');
                    console.log(tmp_uri);
                      token = get_access_tkn(tmp_uri, "code");
                    console.log("token", token);
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
