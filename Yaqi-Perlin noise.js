/**
 * The following animation logic was extended with assistance from ChatGPT.
 *
 * SECTION 3 – Per-Layer Rotational Motion:
 * To create a hypnotic spinning effect, ChatGPT recommended assigning each circle a base rotation
 * and a set of rotation speeds for each concentric layer. Even-numbered layers spin clockwise,
 * odd-numbered layers spin counter-clockwise. The rotation is time-driven and layer-specific.
 *
 * All logic was carefully reviewed and manually integrated into the system.
 */

(function() {
  const dt         = 0.01;   // Frame-to-frame time increment
  const floatAmt   = 10;     // Maximum pixel drift for position
  const pulseAmp   = 0.2;    // Amplitude of radius pulsing effect
  const colorSpeed = 1.0;    // Speed of color interpolation (↑ to enhance visibility)
  const rotSpeedMin = 0.002; // Minimum rotation speed per layer
  const rotSpeedMax = 0.006; // Maximum rotation speed per layer

  let t = 0;  // Global animation time

  // === Wrap original generateCircles() to inject Perlin seeds and rotation logic ===
  const _origGen = circleSystem.generateCircles;
  circleSystem.generateCircles = function() {
    _origGen.apply(this, arguments);  // Call the original generator

    this.circles.forEach(c => {
      // Store base position and radius
      c.baseX = c.x;
      c.baseY = c.y;
      c.baseRadius = c.radius;

      // === SECTION 1 – Generate unique Perlin seeds per property ===
      c.seedPos   = random(1000);  // Position drift
      c.seedRad   = random(1000);  // Radius pulse
      c.seedColor = random(1000);  // Color interpolation

      // === SECTION 3 – Layer-wise rotation setup ===
      c.baseRot = random(TWO_PI);  // Initial rotation offset
      c.layerRotSpeeds = [];
      for (let i = 0; i < circleSystem.LAYERS; i++) {
        let speed = random(rotSpeedMin, rotSpeedMax);
        if (i % 2 === 1) speed *= -1;  // Alternate direction for odd-numbered layers
        c.layerRotSpeeds.push(speed);
      }

      // === SECTION 2 – Set up color interpolation targets ===
      c.baseCols   = c.cols.slice();                              // Original colors
      c.altCols    = c.cols.map(_ => DecorateWheels.randomColor()); // Target colors
      c.baseCenter = c.centerCol;                                 // Original center
      c.altCenter  = DecorateWheels.randomColor();                // Target center
    });
  };

  // === Wrap original draw() to add animation logic per frame ===
  const _origDraw = window.draw;
  window.draw = function() {
    t += dt;  // Advance global time

    circleSystem.circles.forEach(c => {
      /*** SECTION 1 – Floating motion (drift based on Perlin noise) ***/
      let dx = map(noise(c.seedPos, t),         0, 1, -floatAmt, floatAmt);
      let dy = map(noise(c.seedPos + 50, t),    0, 1, -floatAmt, floatAmt);
      c.x = c.baseX + dx;
      c.y = c.baseY + dy;

      /*** SECTION 1 – Radius pulse effect ***/
      let scale = 1 + map(noise(c.seedRad, t),  0, 1, -pulseAmp, pulseAmp);
      c.radius = c.baseRadius * scale;

      /*** SECTION 2 – Color shift (layer colors) ***/
      c.cols = c.baseCols.map((col, i) => {
        let amt = noise(c.seedColor + i * 100, t * colorSpeed);  // Time-varying blend factor
        return lerpColor(col, c.altCols[i], amt);
      });

      /*** SECTION 2 – Color shift (center color) ***/
      c.centerCol = lerpColor(
        c.baseCenter,
        c.altCenter,
        noise(c.seedColor + 999, t * colorSpeed)
      );
    });

    // Call original draw logic to render wheels
    if (_origDraw) _origDraw();
  };
})();
