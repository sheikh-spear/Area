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

export default class LoginForm extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      username: '',
      password: '',
      modalVisible: false
    };
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.login = this.login.bind(this);
  }

  handleUsername(event) {
    this.setState({ username: event });
  }

  handlePassword(event) {
    this.setState({ password: event });
  }

  login(email, pass) {
    this.setState({modalVisible: true});
    fetch(`http://${global.ip}:8080/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: pass
      })
    }).then((response) => response.json()).then((respJson) => {
      alert(respJson.msg);
      this.setState({modalVisible: false});
      global.username = email;
      this.props.handler(respJson.token);
      console.log(respJson);
    }).catch((error) => { console.error(error); });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={{textAlign: 'center'}}>Login:</Text>
          <TextInput style = {styles.input}
             underlineColorAndroid = "transparent"
             placeholder = "Username"
             placeholderTextColor = "#9a73ef"
             autoCapitalize = "none"
             onChangeText = {this.handleUsername}/>
        </View>
        <View>
          <Text style={{textAlign: 'center'}}>Password:</Text>
          <TextInput style = {styles.input}
             secureTextEntry={true}
             underlineColorAndroid = "transparent"
             placeholder = "Password"
             placeholderTextColor = "#9a73ef"
             autoCapitalize = "none"
             onChangeText = {this.handlePassword}/>
        </View>
        <View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress = { () => this.login(this.state.username, this.state.password) }>
              <Text style={{color:'white', textAlign: 'center'}}>Login</Text>
          </TouchableOpacity>
        </View>
        <Modal animationType={"slide"} transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {console.log("closingmodla");}}>
          <Image style={styles.loading} source={{uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fretchhh.files.wordpress.com%2F2015%2F03%2Floading6.gif&f=1&nofb=1"}} />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
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
  loading:{
    width: 100,
    height: 100
  }
});
