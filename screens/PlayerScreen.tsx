import React from "react";
import styled from "styled-components/native";

const Player = styled.View`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 64px;
  backdrop-filter: saturate(180%) blur(30px);
  z-index: 100;
`;
const ProgressBar = styled.View`
  margin-top: -6px;
  margin-bottom: -6px;
  width: 100%;
`;
const Slider = styled.View`
  height: 2;
`;
const ControlBox = styled.View `
display: flex;
grid-template-columns: repeat(3, 1fr);
height: 100%;
padding: {
  right: 10vw;
  left: 10vw;
}
`;

function Playing(){
  const PlayingBox = styled.TouchableNativeFeedback `
  display: flex;
  align-items: center;`
  return <PlayingBox onPress={handlePress}></PlayingBox>;
}
const handlePress = () => {
  
}

function LeftControlButton () {

}
function MiddleControlButton (){

}
function RightControlButton () {

}
export function PlayerScreen() {
  return (
    <Player>
      <ProgressBar>
        <Slider />
      </ProgressBar>
    </Player>
  );
}
