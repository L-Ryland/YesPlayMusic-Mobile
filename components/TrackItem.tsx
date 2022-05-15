import { TouchableHighlight, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { View, Text, Image, TextProps } from "@/components";
import { NavigationProp, useNavigation } from "@react-navigation/core";
import { RootStackParamList, RootStackScreenProps } from "@/types";

interface Artist {
  id: number;
  name: string;
  [key: string]: any;
}
interface Album {
  id: number;
  name: string;
  picUrl: string;
  [key: string]: any;
}

export function TrackItem({
  track,
  handlePlay,
}: {
  track: Track;
  handlePlay: () => void;
}) {
  const navigate = useNavigation<NavigationProp<RootStackParamList>>().navigate;
  const { name, ar } = track;
  // console.log(track);
  const artists: string = ar.map((artist) => artist.name).toString();
  // console.log(art${100};

  const handlePress = () => {
    navigate("Player", { track });
    // methods: play this track
    handlePlay();
  };
  const TrackView = styled(View)`
    display: flex;
    flex-direction: row;
    padding: 4px;
    padding-bottom: 18px;
    height: ${60};
  `;
  // const AlbumImage = styled.Image.attrs(
  //   () => ({ source: { uri: track.al.picUrl } })
  // )`
  //   height: ${50};
  //   width: ${50};
  //   border-radius: 10px;
  //   margin: 5px;
  // `;
  const AlbumImage = () => {
    const styles = StyleSheet.create({
      albumImageStyle: {
        height: 50,
        width: 50,
        borderRadius: 10,
        margin: 5,
      },
    });
    return (
      <Image source={{ uri: track.al.picUrl }} style={styles.albumImageStyle} />
    );
  };
  const SongInfo = styled(View)``;
  const Title = styled(Text).attrs((): TextProps =>({
    numberOfLines: 1,
    ellipsizeMode: "tail"
  }))`
    font-size: 18px;
    font-weight: 600;
    padding-right: 16px;
    overflow: hidden;
  `;
  const SubTitle = styled(Text).attrs((): TextProps => ({
    numberOfLines: 1,
    ellipsizeMode: "tail"
  }))`
    font-size: 16px;
    font-weight: 600;
    padding-right: 16px;
    overflow: hidden;
    color: #ccc;
  `;

  return (
    <TouchableHighlight onPress={handlePress}>
      <TrackView>
        <AlbumImage />
        <SongInfo>
          <Title>{name}</Title>
          <SubTitle>{artists}</SubTitle>
        </SongInfo>
      </TrackView>
    </TouchableHighlight>
  );
}
