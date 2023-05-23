// create sliders
let colourPicker;
let rSeed;

function setup() {
  createCanvas(windowWidth, windowHeight);
  text("Background", 10, height - 60);
  colourPicker = createColorPicker('#888888');
  colourPicker.position(10, height - 50);
  rSeed = random(1, 100);

  angleMode(DEGREES);
  noLoop();
}

function draw() {
  // update background if the user selects a new colour
  colourPicker.input(reSet);
  // start drawing
  randomSeed(rSeed); // same random seed for each redraw
  translate(width/2, height/2 + 280);
  branch(100);
}

function reSet() {
  background(colourPicker.value());
  redraw();
}

function branch(len) {
  push()

// Generate trunc and branches
  if(len > 10) {
    // branches
    
    strokeWeight(map(len, 10, 100, 1, 15));
    stroke(70, 40, 20);//brown branches
    line(0, 0, 0, -len);
    translate(0, -len);
    rotate(random(-20, -30));
    branch(random(0.7, 0.9)*len);
    rotate(random(50,60));
    branch(random(0.7, 0.9)*len);
  } else {
    // leaves
    let r = 88 + random(-20, 20);
    let g = 2 + random(-20, 20);
    let b = 170 + random(-20, 20);

    fill(r,g, b, 150);//coloured leaves
    noStroke();

    // generate leaves
    //left half
    beginShape();
    for (let i = 45; i < 135; i++) {
      let leafRadius = 15;
      let x = leafRadius * cos(i);
      let y = leafRadius * sin(i);
      vertex(x, y);
    }
    endShape();
    //right half
    beginShape();
    for (let i = 135; i > 40; i--) {
      let leafRadius = 15;
      let x = leafRadius * cos(i);
      let y = leafRadius * sin(-i) + 20;
      vertex(x, y);
    }
    endShape();

  }
  pop();
}