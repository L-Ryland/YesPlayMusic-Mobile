import React, { Component } from 'react';
import { Text, Button } from "react-native";
import nodejs from "nodejs-mobile-react-native";

export default class ConnectBackend extends Component {
  componentDidMount(){
    nodejs.start('./NetaeseCloudMusicApi/app.js');
    nodejs.channel.addListener('message',
    (msg) => {
      alert('Received from node: ' + msg);
    },
    this
  );
  };

  render() {
    return <Button title="Loading Backend" onPress={()=>{nodejs.channel.send('something')}}/>;
  }
}

