import P5Wrapper from "react-p5-wrapper";
import sketch from "./sketch";

function p5component() {
  return <P5Wrapper sketch={sketch} />;
}

export default p5component;
