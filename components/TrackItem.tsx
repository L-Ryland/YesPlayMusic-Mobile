import { TouchableHighlight } from "react-native";
import styled from "styled-components/native";
import { View, Text } from "@/components";

interface TrackProps {
  id: string;
  title: string;
  artist: string;
}
export function TrackItem(props: TrackProps) {
  const { title, artist } = props;
  console.log(props);
  const TrackView = styled(View)`
    display: flex;
    flex-direction: row;
    padding: 4px;
    padding-bottom: 18px;
  `;
  const Title = styled(Text)`
    font-size: 18px;
    font-weight: 600;
    padding-right: 16px;
    overflow: hidden;
  `;
  const SubTitle = styled(Text)``;
  return (
    <TouchableHighlight>
      <TrackView>
        <Title style={{ color: "white" }}>{title}</Title>
        <SubTitle style={{ color: "white" }}>{artist}</SubTitle>
      </TrackView>
    </TouchableHighlight>
  );
}