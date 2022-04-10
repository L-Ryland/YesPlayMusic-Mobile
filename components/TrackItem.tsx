import { TouchableHighlight, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { View, Text, Image } from "@/components";

interface Artist {
  id: number,
  name: string,
  [key: string]: any
}
interface Album {
  "id": number,
  "name": string,
  "picUrl": string,
  [key: string]: any
}

interface TrackProps {
  id: number,
  name: string,
  ar: Artist[],
  al: Album,
  [key: string]: any
}
export function TrackItem({ track, navigate }) {
  const { name, ar } = track;
  // console.log(track);
  const artists: string = ar.length == 1 ? ar[0].name : ar.reduce(({ name: prev }, { name: cur }) => prev + ', ' + cur);
  // console.log(art${100};


  const handlePress = () => {
    navigate('Player', {track});
    // methods: play this track
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
      }
    })
    return <Image source={{ uri: track.al.picUrl }} style={styles.albumImageStyle}/>
  }
  const SongInfo = styled(View)`
  `;
  const Title = styled(Text)`
    font-size: 18px;
    font-weight: 600;
    padding-right: 16px;
    overflow: hidden;
  `;
  const SubTitle = styled(Text)`
    font-size: 18px;
    font-weight: 600;
    padding-right: 16px;
    overflow: hidden;
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