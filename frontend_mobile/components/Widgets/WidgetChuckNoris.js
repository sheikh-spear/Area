import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ScrollView,
  Modal
} from 'react-native';

export default class WidgetChuckNoris extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      txt: "",
      modalVisible: false,
      language: "Unknown"
    };
    this.sendLang = this.sendLang.bind(this);
    this.openLang = this.openLang.bind(this);
  }

  sendLang(event) {
    fetch(`http://${global.ip}:8080/api/chuck-norris-jokes`, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${global.token}`
      }
    }).then((resp) => resp.json())
      .then((respJson) => {
        if (global.senddoggo == true) {
          fetch(`http://${global.ip}:8080/api/send-to-contacts/It's a chucknoris Joke/${respJson.value}/text/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "authorization": `Bearer ${global.token}`,
              "outlook": global.outlook_data
            }
          });
        }
        this.setState({language: respJson.value});
      }).catch((error)=> { console.error(error);});
  }

  openLang(e) {
    this.setState({modalVisible: e});
  }

  componentDidMount() {
    fetch(`http://${global.ip}:8080/api/chuck-norris-jokes`)
      .then((resp) => resp.json())
      .then((respJson) => {
        this.setState({language: respJson.value});
      }).catch((error)=> { console.error(error);});
  }

  render() {
    return (
      <View style={styles.container}>
      <Text style={{color:'white', textAlign: 'center'}}>get jokes from the best</Text>
        <Modal animationType={"slide"} transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {console.log("closingmodla");}}>
          <View styles={styles.modal}>
            <TouchableOpacity onPress={() => {this.openLang(false)}}>
              <Image style={styles.closeImg} source={{uri:"http://iconshow.me/media/images/ui/ios7-icons/png/512/close.png"}}/>
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView>
              <View>
                <View>
                  <TouchableOpacity
                    onPress = { () => this.sendLang(this.state.txt) }>
                    <Text style={styles.resultTxt}>{this.state.language}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.result}>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={() => {this.openLang(true)}}>
          <Image style={styles.image} source={{uri: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.horizonview.net%2F~beeryb%2Fassets%2Fimages%2Flaugh%2Fcnorris%2F01-cnorris.png&f=1&nofb=1"}}/>
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
   },
  result: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  resultTxt: {
    fontSize: 30
  }
});
