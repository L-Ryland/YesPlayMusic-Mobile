import * as React from "react"
import Svg, { Path } from "react-native-svg"

export const Play = (props) => (
  <Svg
    aria-hidden="true"
    data-prefix="fas"
    data-icon="play"
    className="svg-inline--fa fa-play fa-w-14"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    {...props}
  >
    <Path
      fill="currentColor"
      d="M424.4 214.7 72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
    />
  </Svg>
)
