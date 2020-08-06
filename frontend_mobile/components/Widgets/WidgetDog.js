import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from 'react-native';

export default class WidgetDog extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      dog_url: ""
    };
    this.refreshDog = this.refreshDog.bind(this);
  }

  refreshDog(event) {
    event.preventDefault();
    fetch(`http://${global.ip}:8080/api/random-dog`, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${global.token}`
      }
    }).then((resp) => resp.json())
      .then((respJson) => {
        if (global.senddoggo == true) {
          fetch(`http://${global.ip}:8080/api/send-to-contacts/It's a doggo/${encodeURIComponent(respJson.message)}/text/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "authorization": `Bearer ${global.token}`,
              "outlook": global.outlook_data
            }
          });
        }
        if (global.postdoggo == true) {
          fetch(`http://${global.ip}:8080/api/imgur-post`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "authorization": `Bearer ${global.token}`,
            },
            body: JSON.stringify ({
              token: global.imgur_data,
              image: respJson.message
            })
          }).then((response) => response.json()).then((respJson) => {
            console.log(respJson);
          }).catch((error) => {console.error(error);});
        }
        this.setState({dog_url: respJson.message});
      }).catch((error)=> { console.error(error);});
  }

  componentDidMount() {
    fetch(`http://${global.ip}:8080/api/random-dog`, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${global.token}`
      }
    }).then((resp) => resp.json())
      .then((respJson) => {
        console.log("GOT A RANDOM-DOG");
        this.setState({dog_url: respJson.message});
      }).catch((error)=> { console.log("ERRORDOG");console.error(error);});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{color:'white', textAlign: 'center'}}>get dog pics</Text>
        <TouchableOpacity
          onPress={ (e) => this.refreshDog(e)}>
          <Image style={styles.image} source={{uri: this.state.dog_url}}/>
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
  }
});
