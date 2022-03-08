import React from "react";
import styled from "styled-components/native";

const Special = styled.ScrollView`
  margin-top: 192px;
  margin-bottom: 128px;
  border-radius: 1.25em;
  text-align: center;
`;
const Title = styled.Text`
  font-size: 36px;
  font-weight: 700;
`;
const Subtitle = styled.Text`
  font-size: 18px;
  letter-spacing: 1px;
  margin: 28px 0 54px 0;
  animation-duration: 0.8s;
  animation-name: letterSpacing1;
  text-transform: uppercase;
`;
export default function SpecialPlaylist({playlist, specialPlaylistInfo}) {
  return (
    <Special>
      <Title>{specialPlaylistInfo.name}</Title>
      <Subtitle>{playlist.englishTitle } · { playlist.updateFrequency }</Subtitle>
    </Special>
  );
}
