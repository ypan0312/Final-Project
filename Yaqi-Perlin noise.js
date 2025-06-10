// perlin-advanced.js — Enhanced with rotation & more visible color shift
(function() {
  const dt         = 0.01;
  const floatAmt   = 10;
  const pulseAmp   = 0.2;
  const colorSpeed = 3.0;  
  const rotSpeedMin = 0.002;
  const rotSpeedMax = 0.006;

  let t = 0;

  // Wrap generateCircles()
  const _origGen = circleSystem.generateCircles;
  circleSystem.generateCircles = function() {
    _origGen.apply(this, arguments);

    this.circles.forEach(c => {
      c.baseX = c.x;
      c.baseY = c.y;
      c.baseRadius = c.radius;

      c.seedPos = random(1000);
      c.seedRad = random(1000);
      c.seedColor = random(1000);

      // Rotation seeds
      c.baseRot = random(TWO_PI);
      c.layerRotSpeeds = [];
      for (let i = 0; i < circleSystem.LAYERS; i++) {
        let speed = random(rotSpeedMin, rotSpeedMax);
        // Alternate direction: even layers CW, odd CCW
        if (i % 2 === 1) speed *= -1;
        c.layerRotSpeeds.push(speed);
      }

      c.baseCols   = c.cols.slice();
      c.altCols    = c.cols.map(_ => DecorateWheels.randomColor());
      c.baseCenter = c.centerCol;
      c.altCenter  = DecorateWheels.randomColor();
    });
  };

  // Wrap draw()
  const _origDraw = window.draw;
  window.draw = function() {
    t += dt;

    circleSystem.circles.forEach(c => {
      // 1. Position drifting
      let dx = map(noise(c.seedPos, t), 0,1, -floatAmt, floatAmt);
      let dy = map(noise(c.seedPos + 50, t), 0,1, -floatAmt, floatAmt);
      c.x = c.baseX + dx;
      c.y = c.baseY + dy;

      // 2. Radius pulsing
      c.radius = c.baseRadius * (1 + map(noise(c.seedRad, t), 0,1, -pulseAmp, pulseAmp));

      // 3. Color interpolation
      c.cols = c.baseCols.map((col, i) => {
        let amt = noise(c.seedColor + i*100, t * colorSpeed);
        return lerpColor(col, c.altCols[i], amt);
      });
      c.centerCol = lerpColor(
        c.baseCenter,
        c.altCenter,
        noise(c.seedColor + 999, t * colorSpeed)
      );
    });

    // Call base draw
    if (_origDraw) _origDraw();
  };
})();