import React from "react";
import { FlatList, SafeAreaView, TouchableHighlight } from "react-native";
import styled from "styled-components/native";
import { Text, View, TrackItem } from "@/components";


export function TrackList({tracks, navigate}) {
  // const tracks = [
  //   { id: "001", title: " Change Season ", artist: "  Tkko" },
  //   { id: "002", title: " 带刺的草莓 ", artist: " Mit-F " },
  //   { id: "003", title: " 带刺的草莓 ", artist: " Mit-F " },
  //   { id: "004", title: " 带刺的草莓 ", artist: " Mit-F " },
  //   { id: "005", title: " 带刺的草莓 ", artist: " Mit-F " },
  //   { id: "006", title: " 带刺的草莓 ", artist: " Mit-F " },
  //   { id: "007", title: " 带刺的草莓 ", artist: " Mit-F " },
  // ];
  
  const renderTracks = ({ item }) => {
    return <TrackItem track={item} navigate={navigate}/>;
  };
  return (
    <SafeAreaView>
      <FlatList
        data={tracks}
        renderItem={renderTracks}
        keyExtractor={(item, index) => item.id+index}
      />
    </SafeAreaView>
  );
}

