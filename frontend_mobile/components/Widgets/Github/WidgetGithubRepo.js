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
import Swiper from 'react-native-deck-swiper'

import WidgetGithubLogin from './WidgetGithubLogin.js';

export default class WidgetGithubRepo extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      refresh: false,
      repo_name: "",
      data: undefined
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.refreshMe = this.refreshMe.bind(this);
    this.setRepo = this.setRepo.bind(this);
  }

  toggleModal(e) {
    this.setState({modalVisible: e});
  }

  refreshMe() {
    this.setState({ refresh: true });
  }

  setRepo(name) {
    this.setState({repo_name: name});
  }

  getRepo(repository) {
    fetch(`http://${global.ip}:8080/api/github-repos/${global.github_data.user}/${global.github_data.pass}/${repository}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`,
      }
    }).then((response) => response.json()).then((respJson) => {
      console.log(respJson);
      this.setState({data: respJson});
    }).catch((error) => { console.error(error); });
  }

  render() {
    let thing;
    console.log("github: ", global.github_data);
    console.log("modal Github: ",this.state.modalVisible);
    if (global.github_data === undefined) {
      console.log("HERE");
      thing = <WidgetGithubLogin refresh={this.refreshMe}/>;
    } else {
      if (this.state.data === undefined) {
        thing = <View><View>
        <Text>Repository to search:</Text>
        <TextInput style = {styles.input}
          underlineColorAndroid = "transparent"
          placeholder = "repository"
          placeholderTextColor = "#9a73ef"
          autoCapitalize = "none"
          onChangeText = {this.setRepo}/>
        </View>
        <View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress = { () => this.getRepo(this.state.repo_name) }>
              <Text style={{color:'white'}}>Login</Text>
          </TouchableOpacity>
        </View></View>;
      } else {
        thing = <Text> HERE ... </Text>;
      }
    }
    return (
      <View style={styles.container}>
        <Text style={{color:'white', textAlign: 'center'}}>get some repo</Text>
        <Modal animationType={"slide"} transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {console.log("closingmodla");}}>
          <View styles={styles.modal}>
            <TouchableOpacity onPress={() => {this.toggleModal(false)}}>
              <Image style={styles.closeImg} source={{uri:"http://iconshow.me/media/images/ui/ios7-icons/png/512/close.png"}}/>
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView>
              {thing}
            </ScrollView>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={() => {this.toggleModal(true)}}>
          <Image style={styles.image} source={{uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn4.iconfinder.com%2Fdata%2Ficons%2Ficonsimple-logotypes%2F512%2Fgithub-512.png&f=1&nofb=1"}}/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#343a40',
    width: 150,
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
    width: 540,
    height: 600
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
