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

export default class ActionReaction extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      data: undefined
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button}
          onPress={() => {this.props.onclick()}}>
          <View>
            <Image style={styles.image} source={{uri: this.props.url_from}}/>
            <Text style={styles.nameTxt}>{this.props.text_from}</Text>
          </View>
          <View>
            <Image style={styles.image} source={{uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F1%2F12%2FRight_arrow.svg%2F715px-Right_arrow.svg.png&f=1&nofb=1"}}/>
          </View>
          <View>
            <Image style={styles.image} source={{uri: this.props.url_to}}/>
            <Text style={styles.nameTxt}>{this.props.text_to}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#343a40',
    width: '80%',
    height: 170,
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
    width: 135,
    height: 135
  },
  closeImg: {
    width: 30,
    height: 30
  },
  modal: {
    flex: 1
  },
  tinderImg: {
    width: 140,
    height: 140
  },
  button: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  nameTxt: {
    fontSize: 20,
    color: "white"
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
  yourmessage: {
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: '#ADD8E6',
    textAlign: 'right'
  }
});
