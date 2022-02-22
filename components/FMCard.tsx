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
padding: 1rem;
background-color: var(--color-secondary-bg);
border-radius: 1rem;
display: flex;
height: 198px;
box-sizing: border-box;
`;
const CoverImage = styled.Image`
width: 512px;
height: 512px;
// height: 100%;
clip-path: border-box;
border-radius: 0.75rem;
margin-right: 1.2rem;
cursor: pointer;
user-select: none;
`
const RightBox = styled.View`
display: flex;
flex-direction: column;
justify-content: space-between;
color: var(--color-text);
width: 100%;
`
