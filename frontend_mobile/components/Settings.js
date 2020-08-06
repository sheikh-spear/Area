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

export default class Settings extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      txt: "",
      modalVisible: false,
    };
    this.openLang = this.openLang.bind(this);
    this.handleIP = this.handleIP.bind(this);
    this.handleTxt = this.handleTxt.bind(this);
  }

  handleTxt(event) {
    this.setState({ txt: event });
  }

  handleIP(data) {
    global.ip = data;
  }

  openLang(e) {
    this.setState({modalVisible: e});
  }

  render() {
    return (
      <View style={styles.container}>
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
                <Text style={{textAlign: 'center'}}>Enter IP of server:</Text>
                <TextInput style = {styles.input}
                   underlineColorAndroid = "transparent"
                   placeholder = "0.0.0.0"
                   placeholderTextColor = "#9a73ef"
                   autoCapitalize = "none"
                   onChangeText = {this.handleUsername}/>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress = { () => this.handleIP(this.state.txt) }>
                    <Text style={{color:'white', textAlign: 'center'}}>Save IP</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={() => {this.openLang(true)}}>
          <Image style={styles.image} source={{uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F58%2FIc_settings_48px.svg%2F600px-Ic_settings_48px.svg.png&f=1&nofb=1"}}/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
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
    width: 50,
    height: 50
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
