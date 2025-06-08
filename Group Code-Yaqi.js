//p5.js script to setup a responsive full-window canvas and draw decorated wheels.

const CanvasManager = {
  //Create a canvas matching the window size and disable automatic looping.
  setupCanvas() {
    // Make the canvas fill the browser window
    createCanvas(windowWidth, windowHeight);
    // Prevent draw() from looping automatically
    noLoop();
  },

  // Resize the canvas when the window dimensions change.
  resizeCanvas() {
    // Update canvas to new window dimensions
    resizeCanvas(windowWidth, windowHeight);
  },

  // Clear the canvas by filling it with a black background.
  clearBackground() {
    // Draw a solid black background
    background('#000000');
  }
};

// Called once at start: setup canvas and generate initial circles.
function setup() {
  // Initialize canvas settings
  CanvasManager.setupCanvas();
  // Generate circle data for drawing wheels
  circleSystem.generateCircles();
}

//Called whenever the window is resized: adjust canvas and regenerate circles.
function windowResized() {
  // Update canvas size to match new window dimensions
  CanvasManager.resizeCanvas();
  // Regenerate circles to fit the resized canvas
  circleSystem.generateCircles();
}

//Called on redraw: clear background then draw each decorated wheel.
function draw() {
  // Clear previous frame with black background
  CanvasManager.clearBackground();

  // Set default scaleFactor to 1.
  // If a global variable `scaleOverride` is defined (e.g., from audio input),
  // use that instead to dynamically scale the visuals.
  let scaleFactor = typeof scaleOverride !== 'undefined' ? scaleOverride : 1;

  for (let i = 0; i < circleSystem.circles.length; i++) {
    const c = circleSystem.circles[i];
    DecorateWheels.drawWheel(c, scaleFactor);
  }
}
