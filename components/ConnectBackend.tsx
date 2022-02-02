import React, { Component } from 'react';
import { Text, Button } from "react-native";
import { banner } from '../NeteaseCloudMusicApi'



export default async() => {
  const result = await banner({ type: 0 }).then((res) => {
    console.log(res)
  })
  console.log(result);
  
  return <Text>test</Text>;
}