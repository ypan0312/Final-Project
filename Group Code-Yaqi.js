// yaqi-g.js — CanvasManager & p5.js lifecycle (unchanged)

const CanvasManager = {
  setupCanvas: function() {
    createCanvas(windowWidth, windowHeight);
  },
  resizeCanvas: function() {
    resizeCanvas(windowWidth, windowHeight);
  },
  clearBackground: function() {
    background(0);
  }
};

function setup() {
  // Ensure HSB mode before any color() calls
  colorMode(HSB, 360, 100, 100);

  CanvasManager.setupCanvas();
  circleSystem.generateCircles();
}

function windowResized() {
  CanvasManager.resizeCanvas();
  circleSystem.generateCircles();
}

function draw() {
  CanvasManager.clearBackground();
  circleSystem.circles.forEach(c => {
    DecorateWheels.drawWheel(c);
  });
}
