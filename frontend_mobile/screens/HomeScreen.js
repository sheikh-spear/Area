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

import Disconnect from '../components/Disconnect.js';
import WidgetDog from '../components/Widgets/WidgetDog.js';
import WidgetLang from '../components/Widgets/WidgetLang.js';
import WidgetChuckNoris from '../components/Widgets/WidgetChuckNoris.js';
import WidgetTinderRecs from '../components/Widgets/Tinder/WidgetTinderRecs.js';
import WidgetTinderMain from '../components/Widgets/Tinder/WidgetTinderMain.js';
import WidgetTinderMessages from '../components/Widgets/Tinder/WidgetTinderMessages.js';
import WidgetTinderLoca from '../components/Widgets/Tinder/WidgetTinderLoca.js';
import WidgetImgurHome from '../components/Widgets/Imgur/WidgetImgurHome.js';
import WidgetImgurFavorites from '../components/Widgets/Imgur/WidgetImgurFavorites.js';
import WidgetOutlookMail from '../components/Widgets/Outlook/WidgetOutlookMail.js';
import WidgetOutlookCalendar from '../components/Widgets/Outlook/WidgetOutlookCalendar.js';
import WidgetOutlookContacts from '../components/Widgets/Outlook/WidgetOutlookContacts.js';
import WidgetOutlookSendMail from '../components/Widgets/Outlook/WidgetOutlookSendMail.js';
import WidgetGithubRepo from '../components/Widgets/Github/WidgetGithubRepo.js';

import WidgetTwitchVideo from '../components/Widgets/Twitch/WidgetTwitchVideo.js';
import WidgetSpotifyTemplate from '../components/Widgets/Spotify/WidgetSpotifyTemplate.js';
import WidgetRedditTemplate from '../components/Widgets/Reddit/WidgetRedditTemplate.js';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      widget: []
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
      {/*<Disconnect />*/}
          <WidgetTinderRecs />
          <WidgetTinderMain />
          <WidgetTinderMessages />
          <WidgetTinderLoca />
          <WidgetImgurHome />
          <WidgetImgurFavorites />
          <WidgetOutlookMail />
          <WidgetOutlookCalendar />
          <WidgetOutlookContacts />
          <WidgetOutlookSendMail/>
          <WidgetGithubRepo />
          <WidgetDog />
          <WidgetLang />
          <WidgetChuckNoris />
          <WidgetTwitchVideo />
          <WidgetSpotifyTemplate />
          <WidgetRedditTemplate />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343a40',
    paddingLeft: 25
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});
HomeScreen.navigationOptions = {
  title: 'Dashboard',
};
