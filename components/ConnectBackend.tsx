import React, { Component } from 'react';
import { Text, Button } from "react-native";
import nodejs from 'nodejs-mobile-react-native';




export default class ConnectBackend extends Component {
  componentWillMount()
  {
    nodejs.start("NeteaseCloudMusicApi/app.js");
    nodejs.channel.addListener(
      "message",
      (msg) => {
        console.log("From node: " + msg);
      },
      this
    );
  }
  render() {
    return <Text>Connected to Backend</Text>;
  }
}
