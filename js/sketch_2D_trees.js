// Global variables
let canvasPosition;
let canvasColorPicker;
let woodColorPicker;
let leafColorPicker;
let rSeed;
let newTreeButton;
let menu = document.getElementById('m1');
let menuPosAndDim = menu.getBoundingClientRect();

function setup() {
  createCanvas(windowWidth, windowHeight);
  // set white background
  background(255);
  // create colour pickers (from cache or default if nothing in cache)
  canvasColorPicker = createColorPicker(localStorage['canvas'] || '#888888');
  canvasColorPicker.position(menuPosAndDim.x+ 50, height + 75);
  woodColorPicker = createColorPicker(localStorage['wood'] || '#462814');
  woodColorPicker.position(menuPosAndDim.x + 250, height + 75);
  leafColorPicker = createColorPicker(localStorage['leaf'] || '#4C06A9');
  leafColorPicker.position(menuPosAndDim.x + 450, height + 75);
  // set seed to use until next window reload
  rSeed = random(1, 100);
  // create button for page reload / new tree
  newTreeButton = createButton('new Tree');
  newTreeButton.style('font-color: blue;');
  newTreeButton.position(menuPosAndDim.x + 650, height + 75);
  newTreeButton.size(50,25);
  newTreeButton.mousePressed(reloadPage);
  angleMode(DEGREES);
  noLoop();
}

function reloadPage() {
  location.reload();
}

function updateColors() {
  localStorage['canvas'] = canvasColorPicker.value();
  localStorage['wood'] = woodColorPicker.value(); 
  localStorage['leaf'] = leafColorPicker.value();
  redraw();
}

function draw() {
  // set background, add colour pickers to page and update colours per user input
  //translate(width/2, height/2);
  noStroke();
  fill(canvasColorPicker.value());
  rect(menuPosAndDim.x, menuPosAndDim.y, menuPosAndDim.width, height);
  fill(0);
  textStyle(BOLD);
  text("Background", menuPosAndDim.x + 50, height - 40);
  canvasColorPicker.input(updateColors);
  text("Wood", menuPosAndDim.x + 250, height - 40);
  woodColorPicker.input(updateColors);
  text("Leaves", menuPosAndDim.x + 450, height - 40);
  leafColorPicker.input(updateColors);

  // start drawing
  randomSeed(rSeed); // same random seed for each redraw
  translate(width/2, height/2 + 250);
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