import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default class RegisterForm extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordrep: ''
    };
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handlePasswordRep = this.handlePasswordRep.bind(this);
    this.register = this.register.bind(this);
  }

  handleUsername(event) {
    this.setState({ username: event });
  }

  handlePassword(event) {
    this.setState({ password: event });
  }
  handlePasswordRep(event) {
    this.setState({ passwordrep: event });
  }

  register(email, pass, rep) {
    fetch(`http://${global.ip}:8080/api/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: pass,
        password_repeat: rep,
      })
    }).then((response) => response.json()).then((respJson) => {
      alert(respJson.msg);
      global.token = respJson.token;
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
          <Text style={{textAlign: 'center'}}>Repeate password:</Text>
          <TextInput style = {styles.input}
             secureTextEntry={true}
             underlineColorAndroid = "transparent"
             placeholder = "Repeate password"
             placeholderTextColor = "#9a73ef"
             autoCapitalize = "none"
             onChangeText = {this.handlePasswordRep}/>
        </View>
        <View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress = { () => this.register(this.state.username, this.state.password, this.state.passwordrep) }>
              <Text style={{color:'white', textAlign: 'center'}}>Register</Text>
          </TouchableOpacity>
        </View>
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
   }
});
