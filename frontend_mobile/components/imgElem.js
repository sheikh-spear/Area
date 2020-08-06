import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';


export default class ImgElem extends Component<{}> {
  constructor (props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress (){
    console.log(this.props.bobj);
    fetch(`http://${global.ip}:8080/api/imgur-favimg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "authorization": `Bearer ${global.token}`
      },
      body: JSON.stringify({
        token: global.imgur_data,
        img_id: this.props.bobj.id
      })
    }).then((response) => response.json()).then((respJson) => {
      console.log(respJson);
    }).catch((error) => { console.error(error); });
  }

  render() {
    if (this.props.mdr == undefined) {
      return (
          <View style={styles.imgElem}>
            <View style={styles.txtCont}>
              <Text>Name: {this.props.name} | {this.props.bobj.type}</Text>
            </View>
            <View style={styles.imgCont}>
                <Image style={styles.images}
                  source={{uri: this.props.url }} />
            </View>
            <View style={styles.favCont}>
              <TouchableOpacity onPress={this.onPress}>
                <Text>Favourite image</Text>
              </TouchableOpacity>
            </View>
          </View>
      );
    } else {
      return (<View></View>);
    }
  }
}

const styles = StyleSheet.create({
  imgElem: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'gray',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    height: 500,
  },
  images : {
    height: '100%',
    width: '100%',
  },
  txtCont: {
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 1,
    paddingRight: 1,
  },
  imgCont: {
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 1,
    paddingRight: 1,
  },
  favCont: {
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 1,
    paddingRight: 1,
  }
});
