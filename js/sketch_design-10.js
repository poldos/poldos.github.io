// Global variables

let canvasFrame;
let canvasWidth;
let canvasHeight;
let canvasX;
let canvasY;
let menu;

// setup Sketch & UI
function setup() {

    // to align legend and canvas to horizontal menu, get its coordinates
    menu = document.getElementById("m1").getBoundingClientRect();
    
    // create canvas
    canvasX = menu.x + 140;
    canvasY = menu.y + menu.height + 10;
    canvasWidth = menu.width - 140;
    canvasHeight = min(windowHeight - canvasY - 10, 600);
    canvasFrame = createCanvas(canvasWidth, canvasHeight);
    canvasFrame.position(canvasX, canvasY);
  
    // set white background
    background(255);

    angleMode(DEGREES);
    noLoop();
}

// save canvas to file on user request
function saveImage() {
    saveCanvas('myDesign-10', 'png');
}

  function draw() {
    background(255);
}