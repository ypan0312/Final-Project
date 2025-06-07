// regina-g.js
const circleSystem = {
    circles: [],
    OUTER_SCALE: 0.8, //outline ellipes radius ratio//
    LAYERS: 5, //number of layers//
  
    // Function to generate a grid of decorative circles//
    generateCircles: function() {
      this.circles = [];
      const baseRadius = min(width, height) / 5;  // Base radius based on canvas size//
      const radius     = baseRadius * this.OUTER_SCALE; // radius for outer circles//
      const spacing    = radius * 2;  //spacing between circles//
      const rotationAngle      = radians(15);  //axis rotation angle//
      const a          = p5.Vector.fromAngle(rotationAngle).mult(spacing);  // Vector 'a' along twisted axis//
      const b          = p5.Vector.fromAngle(rotationAngle + HALF_PI).mult(spacing);  // Vector 'b' perpendicular to 'a'//
      const offset     = a.copy().mult(0.5);  // shift every second row//
      const centre     = createVector(width / 2, height / 2);  // center of the canvas//
      const n          = ceil(max(width, height) / spacing) + 2;  // number of circles in each direction//
      for (let i = -n; i <= n; i++) {  // Loop through rows//
        for (let j = -n; j <= n; j++) {  // Loop through columns//
          let pos = p5.Vector.mult(a, i)  // Calculate position based on row index//
                     .add(p5.Vector.mult(b, j))  // and column index//
                     .add(centre);  // Center the position//
          if (j % 2 !== 0) {  // Offset every second row//
            pos.add(offset);  
          }
  
  
          // Only include circles that are within or just outside canvas bounds//
          if (
            pos.x > -spacing && pos.x < width + spacing &&  //&& means “both conditions must be true for the whole expression to be true.”//
            pos.y > -spacing && pos.y < height + spacing
          ) {
            const cols = [];  // Array to hold colors for each layer//
            for (let k = 0; k < this.LAYERS; k++) {  // Loop through layers to generate colors//
              cols.push(DecorateWheels.randomColor());  // Generate a random color for each layer//
            }
            const centerCol = DecorateWheels.randomColor();  // Generate a central color for the circle core//
            this.circles.push({
              x: pos.x,
              y: pos.y,
              radius: radius,
              cols: cols,
              centerCol: centerCol
            });  // Add the circle to the array//
          }
        }
      } 
      redraw();  // Redraw the canvas after generating circles//
    }
  };