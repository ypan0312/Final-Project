/**
 * The following logic (Sections 2 and 3) was developed with the assistance of ChatGPT:
 *
 * SECTION 2 – Directional Drift with Wraparound:
 * We consulted ChatGPT on how to make each circle move along a 15-degree
 * diagonal path, with odd-numbered rows drifting right and even-numbered
 * rows drifting left. It suggested using p5.Vector.fromAngle for direction
 * and adding row-based polarity. We added Perlin noise for subtle variation
 * and custom wrapping logic to reenter circles after leaving the canvas.
 *
 * SECTION 3 – Per-layer Opposing Rotation:
 * We asked how to rotate layers in opposing directions with different speeds.
 * ChatGPT advised assigning random rotation speeds per layer and inverting
 * the direction for odd-numbered layers. This animation now appears as
 * hypnotic rotating wheels with dynamic rhythm.
 *
 * All responses were adapted and manually integrated into our system.
 */

(function() {
  const dt           = 0.01;   // Time step for each frame
  const floatAmt     = 10;     // Local Perlin wobble (not used here but could be added for vertical shift)
  const pulseAmp     = 0.2;    // Radius pulse amplitude
  const colorSpeed   = 3.0;    // Speed of color interpolation
  const driftSpeed   = 0.8;    // Speed of forward directional movement
  const rotSpeedMin  = 0.002;  // Min rotation speed per layer
  const rotSpeedMax  = 0.006;  // Max rotation speed per layer

  let t = 0;

  // Backup original generation function
  const _origGen = circleSystem.generateCircles;

  circleSystem.generateCircles = function() {
    _origGen.apply(this, arguments);

    this.circles.forEach((c, index) => {
      c.baseRadius = c.radius;
      c.seedPos    = random(1000);  // For drift Perlin
      c.seedRad    = random(1000);  // For pulsing Perlin
      c.seedColor  = random(1000);  // For color shift Perlin

      // Estimate row index for drift polarity
      if (!c.hasOwnProperty("rowIndex")) {
        c.rowIndex = floor(c.y / (c.radius * 2));
      }

      // Save base position
      c.x = c.baseX = c.x;
      c.y = c.baseY = c.y;

      /*** SECTION 3 – Per-layer alternating rotation speeds ***/
      c.layerRotSpeeds = [];
      for (let i = 0; i < circleSystem.LAYERS; i++) {
        let speed = random(rotSpeedMin, rotSpeedMax);
        if (i % 2 === 1) speed *= -1; // alternate direction
        c.layerRotSpeeds.push(speed);
      }

      // Set up color palette blending
      c.baseCols   = c.cols.slice();
      c.altCols    = c.cols.map(_ => DecorateWheels.randomColor());
      c.baseCenter = c.centerCol;
      c.altCenter  = DecorateWheels.randomColor();
    });
  };

  // Override draw() to animate each frame
  const _origDraw = window.draw;
  window.draw = function() {
    t += dt;

    circleSystem.circles.forEach(c => {
      /*** SECTION 1 – Local Perlin float (used in drift wobble) ***/
      let noiseOffset = map(noise(c.seedPos, t), 0, 1, -0.3, 0.3);

      /*** SECTION 2 – Directional drift + wraparound ***/
      let theta = radians(15);
      let dir = p5.Vector.fromAngle(theta).normalize();
      let sign = (c.rowIndex % 2 === 1) ? 1 : -1;
      let driftVec = dir.copy().mult(sign * (driftSpeed + noiseOffset));

      c.x += driftVec.x;
      c.y += driftVec.y;

      // Screen wraparound (with buffer zone)
      let buffer = c.radius * 1.5;
      if (c.x < -buffer)            c.x = width + buffer;
      else if (c.x > width + buffer)  c.x = -buffer;
      if (c.y < -buffer)            c.y = height + buffer;
      else if (c.y > height + buffer) c.y = -buffer;

      /*** SECTION 4 – Radius animation (pulsing) ***/
      c.radius = c.baseRadius * (1 + map(noise(c.seedRad, t), 0, 1, -pulseAmp, pulseAmp));

      /*** SECTION 5 – Color shift with Perlin interpolation ***/
      c.cols = c.baseCols.map((col, i) => {
        let amt = noise(c.seedColor + i * 100, t * colorSpeed);
        return lerpColor(col, c.altCols[i], amt);
      });
      c.centerCol = lerpColor(
        c.baseCenter,
        c.altCenter,
        noise(c.seedColor + 999, t * colorSpeed)
      );
    });

    // Call the original draw to trigger wheel rendering
    if (_origDraw) _origDraw();
  };
})();
