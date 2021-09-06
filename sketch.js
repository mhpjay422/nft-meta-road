function sketch(p) {
  let rotation = 0;

  p.setup = function () {
    p.createCanvas(600, 600);
  };

  p.draw = function () {
    if (p.mouseIsPressed) {
      p.fill(0);
    } else {
      p.fill(255);
    }
    p.ellipse(p.mouseX, p.mouseY, 100, 100);
  };
}

export default sketch;
