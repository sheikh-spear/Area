import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import LoginForm from '../components/LoginForm.js';
import Settings from '../components/Settings.js';
import RegisterForm from '../components/RegisterForm.js';
import AppNavigator from '../navigation/AppNavigator';

export default class LoginScreen extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      login: true,
      refresh: false
    };
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event) {
    this.setState({ login: !this.state.login });
  }

  handlerToken = (val) => {
    global.token = val;
    this.setState({ refresh: true });
  }

  render() {
    console.log(global.token);
    if (global.token != undefined) {
      return (
          <AppNavigator />
      );
    }
    if (this.state.login) {
      return (
        <View style={styles.container}>
        <Text style={{color:'blue', textAlign: 'center'}}>Welcome to Area</Text>
          <View style={{marginTop: 20}}>
            <LoginForm handler={this.handlerToken}/>
          </View>
          <View>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={ ()=> this.handleLogin() }>
              <Text style={{color:'white', textAlign: 'center'}}>Switch to register</Text>
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center'}}>
            <Settings />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
        <Text style={{color:'blue', textAlign: 'center'}}>Welcome to Area</Text>
          <View style={{marginTop: 20}}>
            <RegisterForm />
          </View>
          <View>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={ ()=> this.handleLogin() }>
              <Text style={{color:'white', textAlign: 'center'}}>Switch to login</Text>
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center'}}>
            <Settings />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  changeButton: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 15,
    height: 40,
   },
   container: {
    marginTop: 200,
   }
});
