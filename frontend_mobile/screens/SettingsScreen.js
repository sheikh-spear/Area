import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ActionReaction from '../components/ActionReaction.js'

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
    };
    this.tindermatchimgurpost = this.tindermatchimgurpost.bind(this);
    this.tindermatchoutlookmail = this.tindermatchoutlookmail.bind(this);
    this.senddoggo = this.senddoggo.bind(this);
    this.postdoggo = this.postdoggo.bind(this);
    this.sendNorris = this.sendNorris.bind(this);
  }

  tindermatchimgurpost() {
    fetch(`http://${global.ip}:8080/api/area-tindermatch-imgurpost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      },
      body: JSON.stringify({
        token: global.imgur_data,
        image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.hastac.org%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fmain%2Fpublic%2Fupload%2Fimages%2Fpost%2Ftinder_match.jpg%3Fitok%3D9V5URZLq&f=1&nofb=1"
      })
    }).then((response) => response.json()).then((respJSON) => {
      console.log(respJSON);
    }).catch((error) => { console.error(error); });
  }

  tindermatchoutlookmail() {
    fetch(`http://${global.ip}:8080/api/area-tindermatch-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      },
      body: JSON.stringify({
        token: global.outlook_data,
        email: "leo.smith@epitech.eu"
      })
    }).then((response) => response.json()).then((respJSON) => {
      console.log(respJSON);
    }).catch((error) => { console.error(error); });
  }

  senddoggo() {
    global.senddoggo = true;
    console.log("doggo:", global.senddoggo);
  }

  postdoggo() {
    global.postdoggo = true;
    console.log("postdoggo:", global.postdoggo);
  }

  sendNorris() {
    global.sendnorris= true;
    console.log("norris:", global.sendnorris);
  }

  render() {
    let data;

    if (global.token == undefined) {
      data = <Text style={styles.textCol}>You are not logged in!</Text>;
    } else if (global.tinder_data == undefined) {
      data = <Text style={styles.textCol}>You nned to login to tinder!</Text>;
    } else if (global.imgur_data == undefined) {
      data = <Text style={styles.textCol}>You need to login to Imgur!</Text>;
    } else if (global.outlook_data == undefined) {
      data = <Text style={styles.textCol}>You need to login to Outlook!</Text>;
    } else if (global.twitch_data == undefined) {
      data = <Text style={styles.textCol}>You need to login to Twitch!</Text>;
    } else if (global.spotify_data == undefined) {
      data = <Text style={styles.textCol}>You need to login to Spotify!</Text>;
    } else {
      data = <View>
              <ActionReaction url_from="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.prospectmagazine.co.uk%2Fwp-content%2Fuploads%2F2014%2F12%2FTinder-Flame.png&f=1&nofb=1" text_from="tinder on match" url_to="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.userlogos.org%2Ffiles%2Fimgur-i-logo-png.png&f=1&nofb=1" text_to="Imgur Post" onclick={this.tindermatchimgurpost}/>
              <ActionReaction url_from="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.prospectmagazine.co.uk%2Fwp-content%2Fuploads%2F2014%2F12%2FTinder-Flame.png&f=1&nofb=1" text_from="tinder on match" url_to="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F0%2F0b%2FMicrosoft_Outlook_2013_logo.svg%2F1043px-Microsoft_Outlook_2013_logo.svg.png&f=1&nofb=1" text_to="Email to me" onclick={this.tindermatchoutlookmail}/>
              <ActionReaction url_from="https://upload.wikimedia.org/wikipedia/commons/9/93/Golden_Retriever_Carlos_(10581910556).jpg" text_from="on new dogg" url_to="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F0%2F0b%2FMicrosoft_Outlook_2013_logo.svg%2F1043px-Microsoft_Outlook_2013_logo.svg.png&f=1&nofb=1" text_to="Email to everyone" onclick={this.senddoggo}/>
              <ActionReaction url_from="https://upload.wikimedia.org/wikipedia/commons/9/93/Golden_Retriever_Carlos_(10581910556).jpg" text_from="on new dogg" url_to="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.userlogos.org%2Ffiles%2Fimgur-i-logo-png.png&f=1&nofb=1" text_to="Imgur Post" onclick={this.postdoggo}/>
              <ActionReaction url_from="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.horizonview.net%2F~beeryb%2Fassets%2Fimages%2Flaugh%2Fcnorris%2F01-cnorris.png&f=1&nofb=1" text_from="on new joke" url_to="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F0%2F0b%2FMicrosoft_Outlook_2013_logo.svg%2F1043px-Microsoft_Outlook_2013_logo.svg.png&f=1&nofb=1" text_to="Email to everyone" onclick={this.sendNorris}/>
            </View>;
    }
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          <View>
            {data}
          </View>
          <View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress = { () => this.setState({refresh: !this.state.refresh}) }>
                <Text style={{color:'white', textAlign: 'center'}}>refresh</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343a40'
  },
  submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40,
   },
  contentContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  textCol: {
    color: 'white'
  }
});

SettingsScreen.navigationOptions = {
  title: 'Areas',
};
