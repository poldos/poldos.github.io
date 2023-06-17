// GLOBAL VARIABLES
let canvasWidth;
let canvasHeight;
let canvasX;
let canvasY;
let canvasFrame;
let colorRadio;
let colorScheme = 'rainbow';

let N = 256;
let iter = 16;
let scale = 5;
let t = 0;
let dt = 0.2;

let fluid;


// FUNCTIONS

// function to use 1D array and fake the extra two dimensions --> 3D
function IX(x, y) {
  return x + y * N;
}

/* Boundary conditions
function set_bnd(b, x) {
  for (let i = 1; i < N - 1; i++) {
    x[IX(i, 0)] = b == 2 ? -x[IX(i, 1)] : x[IX(i, 1)];
    x[IX(i, N - 1)] = b == 2 ? -x[IX(i, N - 2)] : x[IX(i, N - 2)];
  }
  for (let j = 1; j < N - 1; j++) {
    x[IX(0, j)] = b == 1 ? -x[IX(1, j)] : x[IX(1, j)];
    x[IX(N - 1, j)] = b == 1 ? -x[IX(N - 2, j)] : x[IX(N - 2, j)];
  }

  x[IX(0, 0)] = 0.5 * (x[IX(1, 0)] + x[IX(0, 1)]);
  x[IX(0, N - 1)] = 0.5 * (x[IX(1, N - 1)] + x[IX(0, N - 2)]);
  x[IX(N - 1, 0)] = 0.5 * (x[IX(N - 2, 0)] + x[IX(N - 1, 1)]);
  x[IX(N - 1, N - 1)] = 0.5 * (x[IX(N - 2, N - 1)] + x[IX(N - 1, N - 2)]);
}

// Linear Solver
function lin_solve(b, x, x0, a, c) {
  let cRecip = 1.0 / c;
  for (let t = 0; t < iter; t++) {
    for (let j = 1; j < N - 1; j++) {
      for (let i = 1; i < N - 1; i++) {
        x[IX(i, j)] =
          (x0[IX(i, j)] +
            a *
              (x[IX(i + 1, j)] +
                x[IX(i - 1, j)] +
                x[IX(i, j + 1)] +
                x[IX(i, j - 1)])) *
          cRecip;
      }
    }
    set_bnd(b, x);
  }
}*/

// Diffusion (cells [i-1,j], [i+1, j], [i, j-1], [i, j+1] all exchange (diffusionRate * their values) with cell [i,j])
function diffuse(measure, previousMeasure, diffusionRate) {
  // rows 1 to N-2 and col 1 to N-2
  for (let row = 1; row < N - 1; row++) {
    for (let col = 1; col < N - 1; col++) {
      measure[IX(row, col)] = previousMeasure[IX(row, col)] +
                              diffusionRate * (previousMeasure[IX(row + 1, col)] + previousMeasure[IX(row - 1, col)] +
                              previousMeasure[IX(row, col + 1)] + previousMeasure[IX(row, col - 1)] - 4 * previousMeasure[IX(row, col)]) / 4;
    }
  }

  // for row 0 and row N-1
  for (let col = 1; col < N - 1; col++) {
    measure[IX(0, col)] = measure[IX(1, col)];
    measure[IX(N - 1, col)] = measure[IX(N - 2, col)];
  }
  // for col 0 and col N-1
  for (let row = 1; row < N - 1; row++) {
    measure[IX(row, 0)] = measure[IX(row, 1)];
    measure[IX(row, N - 1)] = measure[IX(row, N - 2)];
  }
  // for the four corners
  measure[IX(0, 0)] = 0.5 * (measure[IX(1, 0)] + measure[IX(0, 1)]);
  measure[IX(0, N - 1)] = 0.5 * (measure[IX(1, N - 1)] + measure[IX(0, N - 2)]);
  measure[IX(N - 1, 0)] = 0.5 * (measure[IX(N - 2, 0)] + measure[IX(N - 1, 1)]);
  measure[IX(N - 1, N - 1)] = 0.5 * (measure[IX(N - 2, N - 1)] + measure[IX(N - 1, N - 2)]);
}

/* Projection
function project(velocX, velocY, p, div) {
  for (let j = 1; j < N - 1; j++) {
    for (let i = 1; i < N - 1; i++) {
      div[IX(i, j)] =
        (-0.5 *
          (velocX[IX(i + 1, j)] -
            velocX[IX(i - 1, j)] +
            velocY[IX(i, j + 1)] -
            velocY[IX(i, j - 1)])) /
        N;
      p[IX(i, j)] = 0;
    }
  }

  set_bnd(0, div);
  set_bnd(0, p);
  lin_solve(0, p, div, 1, 6);

  for (let j = 1; j < N - 1; j++) {
    for (let i = 1; i < N - 1; i++) {
      velocX[IX(i, j)] -= 0.5 * (p[IX(i + 1, j)] - p[IX(i - 1, j)]) * N;
      velocY[IX(i, j)] -= 0.5 * (p[IX(i, j + 1)] - p[IX(i, j - 1)]) * N;
    }
  }

  set_bnd(1, velocX);
  set_bnd(2, velocY);
}

// Advection
function advect(b, d, d0, velocX, velocY, dt) {
  let i0, i1, j0, j1;

  let dtx = dt * (N - 2);
  let dty = dt * (N - 2);

  let s0, s1, t0, t1;
  let tmp1, tmp2, tmp3, x, y;

  let Nfloat = N - 2;
  let ifloat, jfloat;
  let i, j, k;

  for (j = 1, jfloat = 1; j < N - 1; j++, jfloat++) {
    for (i = 1, ifloat = 1; i < N - 1; i++, ifloat++) {
      tmp1 = dtx * velocX[IX(i, j)];
      tmp2 = dty * velocY[IX(i, j)];
      x = ifloat - tmp1;
      y = jfloat - tmp2;

      if (x < 0.5) x = 0.5;
      if (x > Nfloat + 0.5) x = Nfloat + 0.5;
      i0 = Math.floor(x);
      i1 = i0 + 1.0;
      if (y < 0.5) y = 0.5;
      if (y > Nfloat + 0.5) y = Nfloat + 0.5;
      j0 = Math.floor(y);
      j1 = j0 + 1.0;

      s1 = x - i0;
      s0 = 1.0 - s1;
      t1 = y - j0;
      t0 = 1.0 - t1;

      let i0i = parseInt(i0);
      let i1i = parseInt(i1);
      let j0i = parseInt(j0);
      let j1i = parseInt(j1);

      d[IX(i, j)] =
        s0 * (t0 * d0[IX(i0i, j0i)] + t1 * d0[IX(i0i, j1i)]) +
        s1 * (t0 * d0[IX(i1i, j0i)] + t1 * d0[IX(i1i, j1i)]);
    }
  }

  set_bnd(b, d);
}*/

// Fluid cube class
class Fluid {
  constructor(diffusionRate, viscosity) {
    this.diffusionRate = diffusionRate;
    this.viscosity = viscosity;

    this.previousDensity = new Array(N * N).fill(0);
    this.density = new Array(N * N).fill(0);

    this.previousVelocityX = new Array(N * N).fill(0);
    this.previousVelocityY = new Array(N * N).fill(0);
    this.velocityX = new Array(N * N).fill(0);
    this.velocityY = new Array(N * N).fill(0);
  }

  // method to add density
  addDensity(x, y, amount) {
    // save entire density map
    this.previousDensity = this.density;
    // update density at source
    this.density[IX(x, y)] += amount;
  }

  // step method
  step() {
    let viscosity = this.viscosity;
    //let diffusionRate = this.diffusionRate;

    //let previousDensity = this.previousDensity;
    //let density = this.density;

    let previousVelocityX = this.previousVelocityX;
    let previousVelocityY = this.previousVelocityY;
    let velocityX = this.velocityX;
    let velocityY = this.velocityY;

    //diffuse(1, Vx0, Vx, visc, dt);
    //diffuse(2, Vy0, Vy, visc, dt);

    //project(Vx0, Vy0, Vx, Vy);

    //advect(1, Vx, Vx0, Vx0, Vy0, dt);
    //advect(2, Vy, Vy0, Vx0, Vy0, dt);

    //project(Vx, Vy, Vx0, Vy0);

    diffuse(this.previousDensity, this.density, this.diffusionRate);

    //advect(0, density, s, Vx, Vy, dt);
  }

  /* method to add velocity
  addVelocity(x, y, amountX, amountY) {
    let index = IX(x, y);
    this.velocityX[index] += amountX;
    this.velocityY[index] += amountY;
  }*/

  // function to render density
  renderD() {
    colorMode(HSB);
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        let x = i * scale;
        let y = j * scale;
        let d = this.density[IX(i, j)];
        let mappedDensity = map(d, 0, 1000, 0, 360);
        switch (colorScheme) {
          case 'red<br>':
            mappedDensity = map(d, 0, 1000, 0, 120);
            break;
          case 'yellow<br>':
            mappedDensity = map(d,0, 1000, 60, 180);
            break;
          case 'green<br>':
            mappedDensity = map(d, 0, 1000, 120, 240);
            break;
          case 'cyan<br>':
            mappedDensity = map(d,0, 1000, 180, 300);
            break;  
          case 'blue<br>' :
            mappedDensity = map(d, 0, 1000, 240, 360);
            break;
          case 'magenta<br>':
            mappedDensity = map(d,0, 1000, 300, 420);
            break;
          case 'red rainbow<br>':
            mappedDensity = map(d, 0, 1000, 0, 360); 
            break;
          case 'yellow rainbow<br>':
            mappedDensity = map(d, 0, 1000, 60, 420); 
            break;
          case 'green rainbow<br>':
            mappedDensity = map(d, 0, 1000, 120, 480); 
            break;
          case 'cyan rainbow<br>':
            mappedDensity = map(d, 0, 1000, 180, 540); 
            break;
          case 'blue rainbow<br>':
            mappedDensity = map(d, 0, 1000, 240, 600); 
            break;
          case 'magenta rainbow<br>':
            mappedDensity = map(d, 0, 1000, 300, 660); 
            break;
        }
        fill(mappedDensity, 255, d);
        noStroke();
        square(x, y, scale);
      }
    }
  }

  /* function to render velocity
  renderV() {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        let x = i * scale;
        let y = j * scale;
        let velocityX = this.velocityX[IX(i, j)];
        let velocityY = this.velocityY[IX(i, j)];
       // stroke(0);
        stroke(255);

        if (!(abs(velocityX) < 0.1 && abs(velocityY) <= 0.1)) {
          line(x, y, x + velocityX * scale, y + velocityY * scale);
        }
      }
    }
  }
  
  fadeD() {
    for (let i = 0; i < this.density.length; i++) {
      //let d = density[i];
      this.density = constrain(this.density-0.02, 0, 255);
    }
  }*/
}

// Fluid Simulation
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/132-fluid-simulation.html
// https://youtu.be/alhpH6ECFvQ

// This would not be possible without:
// Real-Time Fluid Dynamics for Games by Jos Stam
// http://www.dgp.toronto.edu/people/stam/reality/Research/pdf/GDC03.pdf
// Fluid Simulation for Dummies by Mike Ash
// https://mikeash.com/pyblog/fluid-simulation-for-dummies.html

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        fluid.addDensity(floor(mouseX/scale) + i, floor(mouseY/scale) + j, 1000);
      }
    }
  }  
}

function mouseDragged() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        fluid.addDensity(floor(mouseX/scale) + i, floor(mouseY/scale) + j, 1000);
      }
    }
  }
}

function setup() {
  canvasWidth = min(1180, windowWidth - 100);//N * scale;//min(1280, windowWidth);
  scale = canvasWidth / N;
  canvasHeight = windowHeight;
  canvasX = 100 + (windowWidth - canvasWidth) / 2;
  canvasY = 0;
  canvasFrame = createCanvas(canvasWidth, canvasHeight);
  canvasFrame.position(canvasX, canvasY);

  textSize(18);
  textAlign(CENTER);

  let paragraph = createP('Palette');
  paragraph.style('font-size', '16px');
  paragraph.position(10, 0);

  colorRadio = createRadio();
  colorRadio.position(0, 40);
  colorRadio.option('red<br>');
  colorRadio.option('yellow<br>');
  colorRadio.option('green<br>');
  colorRadio.option('cyan<br>');
  colorRadio.option('blue<br>');
  colorRadio.option('magenta<br>');
  colorRadio.option('red rainbow<br>');
  colorRadio.option('yellow rainbow<br>');
  colorRadio.option('green rainbow<br>');
  colorRadio.option('cyan rainbow<br>');
  colorRadio.option('blue rainbow<br>');
  colorRadio.option('magenta rainbow<br>');

  fluid = new Fluid(1, 0); // create sliders for diffusion rate and viscosity
}

function draw() {
  stroke(51);
  strokeWeight(2);
  colorScheme = colorRadio.value();

/*
  let cx = int((0.5 * width) / scale);
  let cy = int((0.5 * height) / scale);
  console.log(cx, cy);
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      fluid.addDensity(cx + i, cy + j, random(15, 45));
    }
  }*/

/*
  for (let i = 0; i < 2; i++) {
    let angle = noise(t) * TWO_PI * 2;
    let v = p5.Vector.fromAngle(angle);
    v.mult(0.2);
    t += 0.01;
   fluid.addVelocity(cx, cy, v.x, v.y);
  }

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      console.log("density before diffuse : " + fluid.density[IX(cx+i, cy+j)]);
    }
  }*/

  fluid.step();

  fluid.renderD();
  console.log(frameRate());
}