// ---------------- danni-g.js ----------------
// DecorateWheels is responsible for rendering each visual "wheel" using layered circles, dots, and dynamic waveforms
const DecorateWheels = {
  // Draws a decorative wheel at position (x, y) with optional scaling based on audio energy
  drawWheel: function(c, scaleFactor = 1) {
    const x = c.x;
    const y = c.y;
    const radius = c.radius * scaleFactor; // Apply dynamic scaling from audio input
    const cols = c.cols;                   // Array of stroke colors for each layer
    const centerCol = c.centerCol;         // Stroke color for the center dot

    push();
    translate(x, y); // Move origin to center of current wheel
    noFill();

    // Draw layered concentric rings with radial dots
    for (let i = 0; i < cols.length; i++) {
      const col = cols[i];
      const layerR = radius - i * (radius / circleSystem.LAYERS); // Radius for each concentric layer

      stroke(col);
      strokeWeight(2);
      ellipse(0, 0, layerR * 2); // Draw ring

      // Draw radial dots around the current ring
      const numPoints = 36 + i * 6; // Outer layers have more dots
      for (let j = 0; j < numPoints; j++) {
        const ang = (TWO_PI / numPoints) * j;
        const px  = cos(ang) * layerR;
        const py  = sin(ang) * layerR;
        noStroke();
        fill(col);
        ellipse(px, py, radius * 0.05); // Small dot on the ring
      }
    }

    // Draw a small central solid circle
    stroke(centerCol);
    strokeWeight(radius * 0.05);
    ellipse(0, 0, radius * 0.5);

    // Optional: add waveform-based outer ripple (reactive to live audio)
    let waveform = fft.waveform();           // Get time-domain waveform data
    const outerLayerR = radius;              // Base radius for the outer wave
    const outerColor = cols[0];              // Use outermost layer color

    noFill();
    stroke(outerColor);
    strokeWeight(1.5);
    beginShape();
    const numPoints = 120;                   // Number of points forming the wave shape
    for (let j = 0; j < numPoints; j++) {
      const angle = (TWO_PI / numPoints) * j;
      const waveIndex = floor(map(j, 0, numPoints, 0, waveform.length));
      const waveOffset = waveform[waveIndex] * 30; // Vertical displacement based on waveform
      const r = outerLayerR + waveOffset;
      const px = cos(angle) * r;
      const py = sin(angle) * r;
      vertex(px, py); // Draw outer ripple vertex
    }
    endShape(CLOSE);

    pop(); // Restore previous drawing state
  },

  // Generates a random RGB color
  randomColor: function() {
    return color(random(255), random(255), random(255));
  }
};