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

export default class WidgetLang extends React.Component
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
    this.handleTxt = this.handleTxt.bind(this);
  }

  sendLang(event) {
    fetch(`http://${global.ip}:8080/api/language-detector/${this.state.txt}`, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${global.token}`
      }
    }).then((resp) => resp.json())
      .then((respJson) => {
        console.log(respJson);
        this.setState({language: respJson.results[0].language_name});
      }).catch((error)=> { console.error(error);});
  }

  handleTxt(event) {
    this.setState({ txt: event });
  }

  openLang(e) {
    this.setState({modalVisible: e});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{color:'white', textAlign: 'center'}}>detect language</Text>
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
                  <Text>Language detector:</Text>
                  <TextInput style = {styles.input}
                     secureTextEntry={false}
                     underlineColorAndroid = "transparent"
                     placeholder = "Text to detect..."
                     placeholderTextColor = "#9a73ef"
                     autoCapitalize = "none"
                     onChangeText = {this.handleTxt}/>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress = { () => this.sendLang(this.state.txt) }>
                      <Text style={{color:'white'}}>Send text</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.result}>
                  <Text style={styles.resultTxt}>{this.state.language}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={() => {this.openLang(true)}}>
          <Image style={styles.image} source={{uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Fc%2Fc2%2FGDJ-World-Flags-Globe.svg%2F613px-GDJ-World-Flags-Globe.svg.png&f=1&nofb=1"}}/>
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
