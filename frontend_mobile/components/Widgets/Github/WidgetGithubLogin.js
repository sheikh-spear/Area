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

export default class WidgetGithubLogin extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      user: "",
      pass: ""
    };
    this.login = this.login.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleUser = this.handleUser.bind(this);
    this.handlePass = this.handlePass.bind(this);
  }

  toggleModal(e) {
    this.setState({modalVisible: e});
  }

  handleUser(data) {
    this.setState({user: data});
  }

  handlePass(data) {
    this.setState({pass: data});
  }

  login() {
    global.github_data = {user: this.state.user,
      pass: this.state.pass};
    this.props.refresh();
  }

  render() {
    return (
      <View>
        <View styles={styles.modal}>
          <Text>Github login</Text>
        </View>
        <View>
          <View>
            <Text>Username:</Text>
            <TextInput style = {styles.input}
              underlineColorAndroid = "transparent"
              placeholder = "user"
              placeholderTextColor = "#9a73ef"
              autoCapitalize = "none"
              onChangeText = {this.handleUser}/>
          </View>
          <View>
            <Text>Password:</Text>
            <TextInput style = {styles.input}
              secureTextEntry={true}
              underlineColorAndroid = "transparent"
              placeholder = "pass"
              placeholderTextColor = "#9a73ef"
              autoCapitalize = "none"
              onChangeText = {this.handlePass}/>
          </View>
          <View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress = { () => this.login() }>
                <Text style={{color:'white'}}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
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
