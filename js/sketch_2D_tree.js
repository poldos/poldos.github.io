// Global variables

let canvasFrame;
let canvasWidth;
let canvasHeight;
let canvasX;
let canvasY;
let menu;

let backgroundText;
let woodText;
let leafText;

let newTreeButtonText;
let backgroundColorPicker;
let woodColorPicker;
let leafColorPicker;
let branchLengthSlider;
let branchAngleSlider;
let resetParamButtonText;

let rSeed;

let newTreeButton;
let resetParamButton;

// setup Sketch & UI
function setup() {

  // to align legend and canvas to horizontal menu, get its coordinates
  menu = document.getElementById("m1").getBoundingClientRect();
  
  // create canvas
  canvasX = menu.x + 140;
  canvasY = menu.y + menu.height + 10;
  canvasWidth = menu.width - 140;
  canvasHeight = windowHeight - canvasY - 10;
  canvasFrame = createCanvas(canvasWidth, canvasHeight);
  canvasFrame.position(canvasX, canvasY);

  // set white background
  background(255);

  // create button for page reload / new tree
  newTreeButton = createButton('New tree');
  newTreeButton.position(menu.x, canvasY);
  newTreeButton.size(50,23);
  newTreeButton.mousePressed(reloadPage);
  newTreeButtonText = createP('New tree');
  newTreeButtonText.style('font-size', '12px');
  newTreeButtonText.style('font-family', 'Andika');
  newTreeButtonText.position(menu.x + 53, canvasY + 1);

  // create colour pickers (from cache or default if nothing in cache)
  backgroundColorPicker = createColorPicker(localStorage['background'] || '#FFFFFF');
  backgroundColorPicker.position(menu.x, canvasY + 40);
  backgroundText = createP('Background');
  backgroundText.style('font-size', '12px');
  backgroundText.style('font-family', 'Andika');
  backgroundText.position(menu.x + 53, canvasY + 43);

  woodColorPicker = createColorPicker(localStorage['wood'] || '#000000');
  woodColorPicker.position(menu.x, canvasY + 80);
  woodText = createP('Wood');
  woodText.style('font-size', '12px');
  woodText.style('font-family', 'Andika');
  woodText.position(menu.x + 53, canvasY + 84);

  leafColorPicker = createColorPicker(localStorage['leaf'] || '#888888');
  leafColorPicker.position(menu.x, canvasY + 122);
  leafText = createP('Leaf');
  leafText.style('font-size', '12px');
  leafText.style('font-family', 'Andika');
  leafText.position(menu.x + 53, canvasY + 125);

  // create slider for branch length
  branchLengthSlider = createSlider(20, 95, Number(localStorage['branchLength']) || 75, 0);
  branchLengthSlider.position(menu.x, canvasY + 165);
  branchLengthSlider.style('width', '50px');
  branchLengthText = createP('Branch length');
  branchLengthText.style('font-size', '12px');
  branchLengthText.style('font-family', 'Andika');
  branchLengthText.position(menu.x + 53, canvasY + 162);

  // create slider for branch angle
  branchAngleSlider = createSlider(0, 45, Number(localStorage['branchAngle']) || 22.5, 0);
  branchAngleSlider.position(menu.x, canvasY + 205);
  branchAngleSlider.style('width', '50px');
  branchAngleText = createP('Branch angle');
  branchAngleText.style('font-size', '12px');
  branchAngleText.style('font-family', 'Andika');
  branchAngleText.position(menu.x + 53, canvasY + 202);

  // create button to reset parameters de default (without generating a new tree)
  resetParamButton = createButton('Reset parameters');
  resetParamButton.position(menu.x, canvasY + 245);
  resetParamButton.size(50,23);
  resetParamButton.mousePressed(resetParam);
  resetParamButtonText = createP('Reset <br> parameters');
  resetParamButtonText.style('font-size', '12px');
  resetParamButtonText.style('font-family', 'Andika');
  resetParamButtonText.style('line-height', 1);
  resetParamButtonText.position(menu.x + 53, canvasY + 242);

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
  branchLengthSlider.value(75);
  branchAngleSlider.value(22.5);
  localStorage['background'] = backgroundColorPicker.value();
  localStorage['wood'] = woodColorPicker.value(); 
  localStorage['leaf'] = leafColorPicker.value();
  localStorage['branchLength'] = branchLengthSlider.value();
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

// update branch length on user request and store it in the cache
function updateBranchLength() {
  localStorage['branchLength'] = branchLengthSlider.value();
  redraw();
}
// update branch angle on user request and store it in the cache
function updateBranchAngle() {
  localStorage['branchAngle'] = branchAngleSlider.value();
  redraw();
}

// capture user input and draw sketch
function draw() {
  // set background, add colour pickers to page and update colours per user input
  background(backgroundColorPicker.value());
  noStroke();
  fill(0);
  
  backgroundColorPicker.input(updateColors);
  woodColorPicker.input(updateColors);
  leafColorPicker.input(updateColors);
  branchLengthSlider.input(updateBranchLength);
  branchAngleSlider.input(updateBranchAngle);

  // place "cursor" at base of tree and start drawing
  translate(canvasWidth/2, canvasHeight/2 + 250);
  randomSeed(rSeed); // same random seed for each redraw
  branch(branchLengthSlider.value());
}

/* draw branches recursively and add leaves when branch length gets lower to 10
   (push & pop "save" the various style parameters to avoid avoer-writing them at each loop)*/
function branch(len) {
  push()

// Generate trunc and branches
  if(len > 10) {
    // branches
    strokeWeight(map(len, 10, 90, 1, 15));
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