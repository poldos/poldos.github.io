// Global variables
let canvasFrame;
let canvasWidth = 1000;
let canvasHeight = 1000;
let canvasX;
let canvasY;

let canvasColorPicker;
let woodColorPicker;
let leafColorPicker;

let rSeed;

let newTreeButton;

// setup Sketch UI
function setup() {
  canvasFrame = createCanvas(canvasWidth, canvasHeight);
  canvasX = (windowWidth - canvasWidth) / 2;
  canvasY = (windowHeight - canvasHeight) / 2;
  canvasFrame.position(canvasX, canvasY);
  // set white background
  background(255);
  // create colour pickers (from cache or default if nothing in cache)
  canvasColorPicker = createColorPicker(localStorage['canvas'] || '#FFFFFF');
  canvasColorPicker.position(canvasX + 50, canvasHeight + 75);
  woodColorPicker = createColorPicker(localStorage['wood'] || '#000000');
  woodColorPicker.position(canvasX + 250, canvasHeight + 75);
  leafColorPicker = createColorPicker(localStorage['leaf'] || '#888888');
  leafColorPicker.position(canvasX + 450, canvasHeight + 75);

  // create button for page reload / new tree
  newTreeButton = createButton('new Tree');
  newTreeButton.style('font-color: blue;');
  newTreeButton.position(canvasX + 650, canvasHeight + 75);
  newTreeButton.size(50,25);
  newTreeButton.mousePressed(reloadPage);
  angleMode(DEGREES);
  noLoop();
  initSeed();
}

// initialise seed to use until next window reload
function initSeed() {
  rSeed = random(1, 100);
}

// reload page on user request
function reloadPage() {
  location.reload();
}

// update colours on user request
function updateColors() {
  localStorage['canvas'] = canvasColorPicker.value();
  localStorage['wood'] = woodColorPicker.value(); 
  localStorage['leaf'] = leafColorPicker.value();
  redraw();
}

function draw() {
  // set background, add colour pickers to page and update colours per user input
  //translate(width/2, height/2);
  background(canvasColorPicker.value());
  noStroke();
  fill(0);
  
  textStyle(BOLD);
  text("Background", 50, canvasHeight - 40);
  canvasColorPicker.input(updateColors);
  text("Wood", 250, canvasHeight - 40);
  woodColorPicker.input(updateColors);
  text("Leaves", 450, canvasHeight - 40);
  leafColorPicker.input(updateColors);
  text("new Tree", 650, canvasHeight - 40);

  // start drawing
  randomSeed(rSeed); // same random seed for each redraw
  translate(canvasWidth/2, canvasHeight/2 + 250);
  branch(100);
}

// setBackgroundColor()

function branch(len) {
  push()

// Generate trunc and branches
  if(len > 10) {
    // branches
    
    strokeWeight(map(len, 10, 100, 1, 15));
    stroke(woodColorPicker.value());//brown branches
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

    fill(leafColorPicker.value());//coloured leaves
    noStroke();

    // generate leaves
    //left half
    beginShape();
    for (let i = 45; i < 135; i++) {
      let leafRadius = 10;
      let x = leafRadius * cos(i);
      let y = leafRadius * sin(i);
      vertex(x, y);
    }
    endShape();
    //right half
    beginShape();
    for (let i = 135; i > 40; i--) {
      let leafRadius = 10;
      let x = leafRadius * cos(i);
      let y = leafRadius * sin(-i) + 20;
      vertex(x, y);
    }
    endShape();

  }
  pop();
}