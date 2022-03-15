declare module "*.svg" {
  import React from 'react';
  import { XmlProps } from "react-native-svg";
  const content: React.FC<XmlProps>;
  export default content;
}