// ---------------- danni-g.js ----------------
// DecorateWheels is responsible for rendering visual elements for each circle ("wheel")
const DecorateWheels = {
  // Draws a multi-layered decorative wheel at the given circle position
  drawWheel: function(c) {
    const x = c.x; 
    const y = c.y;
    const radius = c.radius;
    const cols = c.cols;           // Array of colors for each layer
    const centerCol = c.centerCol; // Color for the central circle

    push();
    translate(x, y); // Move the origin to the center of the circle
    noFill();        // Outer rings will only use stroke

    // Draw concentric layers of circles and surrounding dots
    for (let i = 0; i < cols.length; i++) {
      const col = cols[i];
      const layerR = radius - i * (radius / circleSystem.LAYERS); // Radius of current layer
      stroke(col);
      strokeWeight(2);
      ellipse(0, 0, layerR * 2); // Draw the ring

      // Calculate and draw dots around the ring
      const numPoints = 36 + i * 6; // Increase dot count with layer index

      // ✅ MODIFIED: Add per-layer rotation using layerRotSpeeds if available
      const rotOffset = c.layerRotSpeeds 
                        ? c.layerRotSpeeds[i] * frameCount * 60 // rotation per frame
                        : 0; // fallback if no rotation defined

      for (let j = 0; j < numPoints; j++) {
        const ang = (TWO_PI / numPoints) * j + rotOffset; // ✅ Add rotation offset
        const px  = cos(ang) * layerR;
        const py  = sin(ang) * layerR;
        noStroke();
        fill(col);
        ellipse(px, py, radius * 0.05); // Draw a small dot at calculated position
      }
    }

    // Draw the central small circle using the center color
    stroke(centerCol);
    strokeWeight(radius * 0.05);
    ellipse(0, 0, radius * 0.5);

    pop(); // Restore drawing state
  },

  // ✅ MODIFIED: Uses a fixed palette instead of random RGB values
  // Generates a random color from a fixed set sampled from artwork
  randomColor: function() {
    const palette = [
      '#E63946', // pink/red
      '#F4A261', // orange
      '#2A9D8F', // teal
      '#264653', // dark blue
      '#FDE74C', // yellow
      '#9A8C98', // muted purple
      '#8AC926', // lime green
      '#1982C4', // cornflower blue
      '#FF006E'  // magenta
    ];
    // pick one at random
    let hex = palette[floor(random(palette.length))];
    return color(hex);
  }
};
