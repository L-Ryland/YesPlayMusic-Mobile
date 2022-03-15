import React from 'react';
import styled from 'styled-components/native';
const View = styled.View``;
export function FMCard() {
  return <FMBox>
    {/* <CoverImage /> */}
    <RightBox />
  </FMBox>;
}
const FMBox = styled.View`
padding: 16px;
border-radius: '18';
display: flex;
height: 198px;
`;
const CoverImage = styled.Image`
width: 512px;
height: 512px;
clip-path: border-box;
border-radius: 0.75rem;
margin-right: 19;
`
const RightBox = styled.View`
display: flex;
flex-direction: column;
width: 100%;
`
