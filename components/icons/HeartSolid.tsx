import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

export const HeartSolid = (props: svgprops) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" {...props}>
    <Path
      d="M15 26a.997.997 0 0 1-.597-.198C13.938 25.456 3 17.243 3 11c0-3.859 3.141-7 7-7 2.358 0 4.062 1.272 5 2.212C15.938 5.272 17.642 4 20 4c3.859 0 7 3.14 7 7 0 6.243-10.938 14.456-11.403 14.803A1.003 1.003 0 0 1 15 26z"
      fill="currentColor"
    />
  </Svg>
)

