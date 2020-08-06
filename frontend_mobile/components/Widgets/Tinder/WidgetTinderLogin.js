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

export default class WidgetTinderLogin extends React.Component
{
  constructor(props) {
    super(props);
    global.tinder_data = {data: {"_id": "5e454e0c51817a0100e5be8b",api_token: "4d78dccb-42a2-489f-a61d-f5bef32266e4","is_new_user": false,"refresh_token": "eyJhbGciOiJIUzI1NiJ9.MzM2NTI0ODY2MTg.bm1SJiC5AiZasPujBUCttBxZyqPhXbAOQMGMX3riu1M",},"meta": {"status": 200}};
    this.state = {
      modalVisible: true,
      sms_sent: false,
      sms: "",
      number: ""
    };
    this.openTinder = this.openTinder.bind(this);
    this.handlePhone = this.handlePhone.bind(this);
    this.handleSMS = this.handleSMS.bind(this);
    this.login = this.login.bind(this);
  }

  openTinder(e) {
    this.setState({modalVisible: e});
  }

  handlePhone(data) {
    this.setState({number: data});
  }

  handleSMS(data) {
    this.setState({sms: data});
  }

  login(num) {
    fetch(`http://${global.ip}:8080/api/tinder-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      },
      body: JSON.stringify({
        number: num,
      })
    }).then((response) => response.json()).then((respJson) => {
      console.log("send SMS");
      this.setState({sms_sent: respJson.data.sms_sent});
    }).catch((error) => { console.error(error); });
  }
  loginSMS(sms, num) {
    let token_refresh;
    fetch(`http://${global.ip}:8080/api/tinder-validate-num`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      },
      body: JSON.stringify({
        code: sms,
        number: num,
      })
    }).then((response) => response.json()).then((respJson) => {
      token_refresh = respJson.data.refresh_token;
      console.log(token_refresh);
      fetch(`http://${global.ip}:8080/api/tinder-getxauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "authorization": `Bearer ${global.token}`
        },
        body: JSON.stringify({
          refresh: token_refresh,
          number: num,
        })
      }).then((response) => response.json()).then((respJson) => {
        global.tinder_data = respJson;
        this.props.refresh();
        console.log(global.tinder_data);
      }).catch((error) => { console.error(error); });
    }).catch((error) => { console.error(error); });
  }

  render() {
    let form;
    if (this.state.sms_sent == false) {
      form = <View><View>
        <Text style={{textAlign: 'center'}}>phone:</Text>
        <TextInput style = {styles.input}
          underlineColorAndroid = "transparent"
          placeholder = "Phone number"
          placeholderTextColor = "#9a73ef"
          autoCapitalize = "none"
          onChangeText = {this.handlePhone}/>
        </View>
        <View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress = { () => this.login(this.state.number) }>
              <Text style={{color:'white', textAlign: 'center'}}>Login</Text>
          </TouchableOpacity>
        </View></View>;
    } else {
      form = <View><View>
        <Text style={{textAlign: 'center'}}>SMS Code:</Text>
        <TextInput style = {styles.input}
          underlineColorAndroid = "transparent"
          placeholder = "SMS Code"
          placeholderTextColor = "#9a73ef"
          autoCapitalize = "none"
          onChangeText = {this.handleSMS}/>
        </View>
        <View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress = { () => this.loginSMS(this.state.sms, this.state.number) }>
              <Text style={{color:'white', textAlign: 'center'}}>Login</Text>
          </TouchableOpacity>
        </View></View>;
    }
    return (
      <View style={styles.container}>
        <View styles={styles.modal}>
          <Text>Tinder login</Text>
        </View>
        {form}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingTop: 50
  },
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
    borderWidth: 1,
    textAlign: 'center'
  },
  submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40,
   }
});
