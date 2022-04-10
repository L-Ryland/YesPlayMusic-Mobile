import React from 'react';
import styled from 'styled-components/native';
import { View } from "@/components/Themed";
export function FMCard() {
  return <FMBox>
    {/* <CoverImage /> */}
    <RightBox />
  </FMBox>;
}
const FMBox = styled(View)`
padding: 16px;
border-radius: 18;
display: flex;
height: 198px;
`;

const RightBox = styled(View)`
display: flex;
flex-direction: column;
width: 100%;
`
