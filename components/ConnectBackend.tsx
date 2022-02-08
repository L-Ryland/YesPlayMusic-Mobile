import React, { Component } from 'react';
import { Button } from "react-native";
import nodejs from 'nodejs-mobile-react-native';



export default class ConnectBackend extends Component {
  UNSAFE_componentWillMount()
  {
    nodejs.start("main.js", {redirectOutputToLogcat: false});
    nodejs.channel.addListener(
      "message",
      (msg) => {
        console.log("From node: " + msg);
      },
      this
    );
  }
  render() {
    return   <Button title="Message Node"
    onPress={() => nodejs.channel.send('A message!')}
    />;
  }
}
