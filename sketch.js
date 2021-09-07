function Sketch(p) {
  let rotation = 0;

  p.setup = function () {
    let canvas = p.createCanvas(600, 600);

    canvas.parent("canvascontainer");
    let saveButton = p.select("#saveButton");
    saveButton.mousePressed(saveDrawing);
  };

  p.draw = function () {
    if (p.mouseIsPressed) {
      p.fill(0);
    } else {
      p.fill(255);
    }
    p.ellipse(p.mouseX, p.mouseY, 100, 100);
  };

  function saveDrawing() {
    p.save();
  }
}

export default Sketch;
