import P5Wrapper from "react-p5-wrapper";
import sketch from "./sketch";

function p5component() {
  return (
    <div>
      <div className="h-20 bg-gray-50"></div>
      <div className="flex align-middle justify-around bg-black border-t-2 border-b-2">
        <div id="canvascontainer" className="bg-white">
          <button
            id="saveButton"
            className="absolute h-20 w-40 bg-blue-500 left-0"
          >
            Save Image
          </button>
          <P5Wrapper sketch={sketch} />
        </div>
      </div>
    </div>
  );
}

export default p5component;
