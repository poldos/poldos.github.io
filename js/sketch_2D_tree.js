// Global variables
let canvasFrame;
let canvasWidth;
let canvasHeight;
let canvasX;
let canvasY;
let menuDropdown;

let backgroundText;
let woodText;
let leafText;
let backgroundColorPicker;
let woodColorPicker;
let leafColorPicker;
let buttonText;

let rSeed;

let newTreeButton;

// setup Sketch UI
function setup() {
  canvasWidth = min(windowWidth, 750);
  canvasHeight = min(windowHeight-100, 1000);

  canvasFrame = createCanvas(canvasWidth, canvasHeight);

  canvasX = (windowWidth - canvasWidth + 30) / 2;
  canvasY = (windowHeight - canvasHeight + 25) / 2;
  canvasFrame.position(canvasX, canvasY);

  // set white background
  background(255);

  // to align to menu dropdown
  menuDropdown = document.getElementById("m1").getBoundingClientRect();

  // create colour pickers (from cache or default if nothing in cache)
  backgroundColorPicker = createColorPicker(localStorage['background'] || '#FFFFFF');
  backgroundColorPicker.position(menuDropdown.x, canvasY + 40);
  backgroundText = createP('Background');
  backgroundText.style('font-size', '12px');
  backgroundText.position(menuDropdown.x + 53, canvasY + 47);

  woodColorPicker = createColorPicker(localStorage['wood'] || '#000000');
  woodColorPicker.position(menuDropdown.x, canvasY + 80);
  woodText = createP('Wood');
  woodText.style('font-size', '12px');
  woodText.position(menuDropdown.x + 53, canvasY + 87);

  leafColorPicker = createColorPicker(localStorage['leaf'] || '#888888');
  leafColorPicker.position(menuDropdown.x, canvasY + 120);
  leafText = createP('Leaf');
  leafText.style('font-size', '12px');
  leafText.position(menuDropdown.x + 53, canvasY + 125);

  // create button for page reload / new tree
  newTreeButton = createButton('new Tree');
  //newTreeButton.style('font-size', '12px');
  newTreeButton.position(menuDropdown.x, canvasY);
  newTreeButton.size(50,23);
  newTreeButton.mousePressed(reloadPage);
  buttonText = createP('new Tree');
  buttonText.style('font-size', '12px');
  buttonText.position(menuDropdown.x + 53, canvasY + 7);

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
  localStorage['background'] = backgroundColorPicker.value();
  localStorage['wood'] = woodColorPicker.value(); 
  localStorage['leaf'] = leafColorPicker.value();
  redraw();
}

function draw() {
  // set background, add colour pickers to page and update colours per user input
  //translate(width/2, height/2);
  background(backgroundColorPicker.value());
  noStroke();
  fill(0);
  
  //textStyle(BOLD);
  //text("Background", menuDropdown.x, menuDropdown.y + menuDropdown.height + 10);
  backgroundColorPicker.input(updateColors);
  //text("Wood", 250, menuDropdown.y + menuDropdown.height + 10);
  woodColorPicker.input(updateColors);
  //text("Leaves", 450, menuDropdown.y + menuDropdown.height + 10);
  leafColorPicker.input(updateColors);
  //text("new Tree", 650, menuDropdown.y + menuDropdown.height + 10);

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