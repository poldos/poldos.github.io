// GLOBAL VARIABLES
let canvasWidth;
let canvasHeight;
let canvasX;
let canvasY;
let canvasFrame;
let canvasImage;

let canvasParameterTitle;
let canvasSizeText;
let canvasSizeSlider; // slider
let canvasSize = 128; // number of cells along x and y
let scale;

let fluidColorPicker;
let fluidColorPickerText;
let fluidColorHEX = '#FFFFFF';
let fluidColorRGB;
let fluidColorHSB;

let newFluidButton;
let newFluidButtonText;

let currentFluidIndex;
let fluids = [];

let densityQuantumTitle;
let densityQuantumText;
let densityQuantumSlider;
let densityQuantum = 1000;

let diffusionRangeTitle;
let diffusionRangeText;
let diffusionRangeSlider;
let diffusionRange = 2;

// CLASSES
class Fluid {
  constructor(diffusionRange, hueVal, satVal, brightVal, layer) {
    this.diffusionRange = diffusionRange;

    this.previousDensity = new Array(canvasSize * canvasSize).fill(0);
    this.density = new Array(canvasSize * canvasSize).fill(0);

    this.hueVal = hueVal;
    this.satVal = satVal;
    this.brightVal = brightVal;

    this.layer = layer;
  }
  // density addition
  addDensity(x, y, amount) {
    // save entire density map (needed later for the diffusion process)
    this.previousDensity = this.density;
    // update density at and around source
    for (let i = -2; i < 2; i++) {
      for (let j = -2; j < 2; j++) {
        this.density[IX(x + i, y + j)] += amount;
      }
    }
  }
  // diffusion
  diffuse() {
    // store the density table to copy it into the previousDensity table at the end of the diffusion process
    let tempo = [...this.density];
    // initialize weighted average values in the neighbourhood
    let sumNeighbours = new Array(canvasSize * canvasSize).fill(0);
    let totalWeight = new Array(canvasSize * canvasSize).fill(0);
    // compute weighted average delta between cells in the neighbourhood and the center cell
    for (let row = 0; row < canvasSize; row++) {
      for (let col = 0; col < canvasSize; col++) {
        for (let i = -this.diffusionRange; i <= this.diffusionRange; i++) {
          for (let j = -this.diffusionRange; j <= this.diffusionRange; j++) {
            if (row + i >= 0 && row + i < canvasSize && col + j >= 0 && col + j < canvasSize) {
              sumNeighbours[IX(row, col)] += this.previousDensity[IX(row + i, col + j)] - this.previousDensity[IX(row, col)];
              totalWeight[IX(row, col)] += 1;
            }
          }
        }
        totalWeight[IX(row, col)] -= 1; // remove weight associated to center cell (its delta is 0, ie. it does not diffuse into itself)
      }
    }
    for (let row = 0; row < canvasSize; row++) {
      for (let col = 0; col < canvasSize; col++) {
        this.density[IX(row, col)] = this.previousDensity[IX(row, col)]
                              + (sumNeighbours[IX(row, col)] / totalWeight[IX(row, col)]);
      }
    }
    // update the previousDensity table
    this.previousDensity = [...tempo];
  } 
  // if user changes his mind about the fluid's color
  recolor() {
    // code to update hue, sat and bright
    // need to think about which event should trigger this function
  }
  // Render into one layer per fluid and blend individual graphics into the main canvas
  render() {
    colorMode(HSB);
    let h = this.hueVal;
    let s = this.satVal * 100;
    let b = this.brightVal;

    for (let row = 0; row < canvasSize; row++) {
      for (let col = 0; col < canvasSize; col++) {

        let x = row * scale;
        let y = col * scale;
        let d = this.density[IX(row,col)];

        // consider adding a rainbow option for the fill, there h+120 below is replaced with h+360
        // CREATE SLIDER FOR HUE SPREAD (mapping of density into hue in fill below)
        this.layer.colorMode(HSB);
        this.layer.fill(map(d, 0, 1000, h, h + 15), s, d * b / 10);//map(d * b, 0, 1000, 0, 100));
        this.layer.noStroke();
        this.layer.square(x, y, scale); 
      }
    }
    //image(this.layer, 0, 0);
    canvasImage.blend(this.layer, 0, 0, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight, ADD);
  }
}

// GENERAL FUNCTIONS

// convert HEX to RGB
function convertHEXtoRGB(hexValue) {
  return [parseInt(hexValue.slice(1, 3), 16), parseInt(hexValue.slice(3, 5), 16), parseInt(hexValue.slice(5, 7), 16)];
}
// convert RGB to HSB
function convertRGBtoHSB(rgbArray) {
  let redVal = rgbArray[0] / 255;
  let greenVal = rgbArray[1] / 255;
  let blueVal = rgbArray[2] / 255;
  
  let maxVal = max(redVal, greenVal, blueVal);
  let minVal = min(redVal, greenVal, blueVal);
  let valRange = (maxVal - minVal);
  
  let brightVal = maxVal;
  let satVal = maxVal != 0 ? 1 - minVal/maxVal : 0;
  let hueVal;
  if (valRange == 0) {
    hueVal = 0;
  } else {
    if (redVal == maxVal) {
      hueVal = (greenVal - blueVal) / valRange;
    } else if (greenVal == maxVal) {
        hueVal = 2 + (blueVal - redVal) / valRange;
    } else {
        hueVal = 4 + (redVal - greenVal) / valRange;
    }
    hueVal *= 60;
    hueVal += hueVal < 0 ? 360 : 0;
  }
  return([hueVal, satVal, brightVal]);
}
// convert x, y coordinates to array index
function IX(x, y) {
  return x + y * canvasSize;
}

// EVENT RELATED FUNCTIONS
// select canvas size
function updateCanvasSize() {
  canvasSize = canvasSizeSlider.value();
  canvasSizeText.html(canvasSize);
  scale = canvasWidth / canvasSize;
  fluids.length = 0;
  background(0);
  }

// set density quantum (ie. density added when clicking on the mouse)
function updateDensityQuantum() {
  densityQuantum = densityQuantumSlider.value();
  densityQuantumText.html(densityQuantum);
}

// update diffusion range
function updateDiffusionRange() {
  diffusionRange = diffusionRangeSlider.value();
  diffusionRangeText.html(diffusionRange);
}

// create new fluid
function createFluid() {
  //let newLayerIndex = fluids.length;
  fluids.push(new Fluid(diffusionRange, fluidColorHSB[0], fluidColorHSB[1], fluidColorHSB[2], createGraphics(canvasWidth, canvasHeight)));
  currentFluidIndex = fluids.length - 1;
}
// update colors to use for next new fluid
function updateColors() {
  fluidColorHEX = fluidColorPicker.value();
  fluidColorRGB = convertHEXtoRGB(fluidColorHEX);
  fluidColorHSB = convertRGBtoHSB(fluidColorRGB);
}
// click or drag mouse on canvas to add density
function mousePressed() {
  try{
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            fluids[currentFluidIndex].addDensity(floor(mouseX/scale) + i, floor(mouseY/scale) + j, densityQuantum);
        }
      }
    }
  } catch (error) {
    //let text = createP("create a fluid first !");
    //text.position(CENTER);
  }  
}
function mouseDragged() {
  try{
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          fluids[currentFluidIndex].addDensity(floor(mouseX/scale) + i, floor(mouseY/scale) + j, densityQuantum);
        }
      }
    }
  } catch (error) {
    //let text = createP("create a fluid first !");
    //text.position(CENTER);
  }  
}

function keyReleased() {
  if (key == 'q' || key == 'Q') noLoop();
  if (key == 'w' || key == 'W') loop();
}

// SETUP & DRAW
// display all fluids created on the left and allow to select them to modify their colour
// create function to save image or video

function setup() {
  canvasWidth = min(1195, windowWidth - 100);
  scale = canvasWidth / canvasSize;
  canvasHeight = windowHeight;
  canvasX = 100 + (windowWidth - canvasWidth) / 2;
  canvasY = 0;
  canvasFrame = createCanvas(canvasWidth, canvasHeight);
  canvasFrame.position(canvasX, canvasY);
  canvasImage = createImage(canvasWidth, canvasHeight);
  background(0);

  textSize(18);
  textAlign(CENTER);
 
  canvasParameterTitle = createP('canvas Size');
  canvasParameterTitle.style('font-size', '14px');
  canvasParameterTitle.style('font-family', 'Andika');
  canvasParameterTitle.position(10, 5);
  canvasSizeSlider = createSlider(64, 256, 128, 64);
  canvasSizeSlider.position(10, 40);
  canvasSizeText = createP('128');
  canvasSizeText.style('font-size', '14px');
  canvasSizeText.style('font-family', 'Andika');
  canvasSizeText.position(63, 45);

  canvasSizeSlider.input(updateCanvasSize);

  // create slider to choose densityQuantum
  densityQuantumTitle = createP('incremental fluid density');
  densityQuantumTitle.style('font-size', '14px');
  densityQuantumTitle.style('font-family', 'Andika');
  densityQuantumTitle.position(10, 75);
  densityQuantumSlider = createSlider(500, 5000, 1000, 250);
  densityQuantumSlider.position(10, 110);
  densityQuantumText = createP('1000');
  densityQuantumText.style('font-size', '14px');
  densityQuantumText.style('font-family', 'Andika');
  densityQuantumText.position(63, 115);

  densityQuantumSlider.input(updateDensityQuantum);

  // create slider to choose densityQuantum
  diffusionRangeTitle = createP('diffusion range (speed)');
  diffusionRangeTitle.style('font-size', '14px');
  diffusionRangeTitle.style('font-family', 'Andika');
  diffusionRangeTitle.position(10, 144);
  diffusionRangeSlider = createSlider(1, 5, 2, 1);
  diffusionRangeSlider.position(10, 174);
  diffusionRangeText = createP('2');
  diffusionRangeText.style('font-size', '14px');
  diffusionRangeText.style('font-family', 'Andika');
  diffusionRangeText.position(63, 175);

  diffusionRangeSlider.input(updateDiffusionRange);
  
  // create colour picker
  fluidColorPicker = createColorPicker('fluid colour');
  fluidColorPicker.position(10, 220);
  fluidColorPickerText = createP('fluid colour');
  fluidColorPickerText.style('font-size', '14px');
  fluidColorPickerText.style('font-family', 'Andika');
  fluidColorPickerText.position(63, 211);
  fluidColorPicker.input(updateColors);
  fluidColorRGB = convertHEXtoRGB(fluidColorHEX);
  fluidColorHSB = convertRGBtoHSB(fluidColorRGB);

  // create New Fluid button
  newFluidButton = createButton('');
  newFluidButton.position(10, 271);
  newFluidButton.size(50,23);
  newFluidButtonText = createP('new fluid');
  newFluidButtonText.style('font-size', '14px');
  newFluidButtonText.style('font-family', 'Andika');
  newFluidButtonText.position(63, 260);
  newFluidButton.mousePressed(createFluid);
}

function draw() {
  canvasImage = createImage(canvasWidth, canvasHeight);
  stroke(51);
  strokeWeight(2);

  for (let i = 0; i < fluids.length; i++) {
    // diffuse
    fluids[i].diffuse();
    // render
    fluids[i].render();
  }
  image(canvasImage, 0, 0);
}