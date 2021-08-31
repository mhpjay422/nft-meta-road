import P5Wrapper from "react-p5-wrapper";
import sketch from "../sketch";

function GenerateArt(p) {
  return (
    <div>
      <P5Wrapper sketch={sketch} />
    </div>
  );
}

export default GenerateArt;
