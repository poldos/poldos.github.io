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

let newTreeButtonText;
let backgroundColorPicker;
let woodColorPicker;
let leafColorPicker;
let branchAngleSlider;
let resetParamButtonText;

let rSeed;

let newTreeButton;
let resetParamButton;

// setup Sketch UI
function setup() {

  // to align legend and canvas to horizontal menu, get its coordinates
  menuDropdown = document.getElementById("m1").getBoundingClientRect();
  
  canvasWidth = menuDropdown.width - 140;
  canvasHeight = min(windowHeight-50, 1000);
  canvasX = menuDropdown.x + 140;
  canvasY = (windowHeight - canvasHeight + 25) / 2;
  canvasFrame = createCanvas(canvasWidth, canvasHeight);
  canvasFrame.position(canvasX, canvasY);

  // set white background
  background(255);

  // create button for page reload / new tree
  newTreeButton = createButton('New tree');
  newTreeButton.position(menuDropdown.x, canvasY);
  newTreeButton.size(50,23);
  newTreeButton.mousePressed(reloadPage);
  newTreeButtonText = createP('New tree');
  newTreeButtonText.style('font-size', '12px');
  newTreeButtonText.position(menuDropdown.x + 53, canvasY + 7);

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

  // create slider for branch right angle
  branchAngleSlider = createSlider(5, 35, Number(localStorage['branchAngle']) || 20, 0);
  branchAngleSlider.position(menuDropdown.x, canvasY + 165);
  branchAngleSlider.style('width', '50px');
  branchAngleText = createP('Branch angle');
  branchAngleText.style('font-size', '12px');
  branchAngleText.position(menuDropdown.x + 53, canvasY + 165);

  // create button to reset parameters de default (without generating a new tree)
  resetParamButton = createButton('Reset parameters');
  resetParamButton.position(menuDropdown.x, canvasY + 205);
  resetParamButton.size(50,23);
  resetParamButton.mousePressed(resetParam);
  resetParamButtonText = createP('Reset <br> parameters');
  resetParamButtonText.style('font-size', '12px');
  resetParamButtonText.position(menuDropdown.x + 53, canvasY + 202);

  angleMode(DEGREES);
  noLoop();
  initSeed();
}

// initialise seed to use until next window reload (to retain the same tree as long as the user does not generate a new one)
function initSeed() {
  rSeed = random(1, 100);
}

// reload page on user request (to generate a new tree with the parameters saved in cache - see below)
function reloadPage() {
  location.reload();
}

// reset the parameters to Default on user request
function resetParam() {
  backgroundColorPicker.value('#FFFFFF');
  woodColorPicker.value('#000000');
  leafColorPicker.value('#888888');
  branchAngleSlider.value(20);
  localStorage['background'] = backgroundColorPicker.value();
  localStorage['wood'] = woodColorPicker.value(); 
  localStorage['leaf'] = leafColorPicker.value();
  localStorage['branchAngle'] = branchAngleSlider.value();
  redraw();
}

// update colours on user request and store them in the cache
function updateColors() {
  localStorage['background'] = backgroundColorPicker.value();
  localStorage['wood'] = woodColorPicker.value(); 
  localStorage['leaf'] = leafColorPicker.value();
  redraw();
}

// update branch angle on user request and store it in the cache
function updateAngles() {
  localStorage['branchAngle'] = branchAngleSlider.value();
  redraw();
}

function draw() {
  // set background, add colour pickers to page and update colours per user input
  //translate(width/2, height/2);
  background(backgroundColorPicker.value());
  noStroke();
  fill(0);
  
  backgroundColorPicker.input(updateColors);
  woodColorPicker.input(updateColors);
  leafColorPicker.input(updateColors);
  branchAngleSlider.input(updateAngles);

  // start drawing
  randomSeed(rSeed); // same random seed for each redraw
  translate(canvasWidth/2, canvasHeight/2 + 250);
  branch(90);
}

// setBackgroundColor()

function branch(len) {
  push()

// Generate trunc and branches
  if(len > 10) {
    // branches
    
    strokeWeight(map(len, 10, 100, 1, 15));
    stroke(woodColorPicker.value());
    line(0, 0, 0, -len);
    translate(0, -len);
    rotate(random(-branchAngleSlider.value() - 5, -branchAngleSlider.value() + 5));
    branch(random(0.7, 0.9)*len);
    rotate(random(2* branchAngleSlider.value() - 5, 2 * branchAngleSlider.value() + 5));
    branch(random(0.7, 0.9)*len);
  } else {
    // leaves
    let r = 88 + random(-20, 20);
    let g = 2 + random(-20, 20);
    let b = 170 + random(-20, 20);

    fill(leafColorPicker.value());
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