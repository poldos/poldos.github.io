// GLOBAL VARIABLES

let canvasFrame;
let canvasWidth;
let canvasHeight;
let canvasX;
let canvasY;
let menu;

let images = [];
let imageNu;

let spaceInvaders = [];
let spaceInvaderRadius = 30;
let spaceInvaderRowHeight = 30;

let laserRays = [];
let rayLength = 10;
let rayBool = 0;
let rayScarcity = 10; // the higher the number, the lower the density of the rays (and the higher the scarcity)

// CLASSES

class SpaceInvader {
  constructor(x, y, radius, angle, speed, shotInterval, hits, health, r, g, b) { // rajouter image en premier parametre une fois les images telechargees 
    //this.image = image;
    this.x = x;
    this.y = y;
    this. radius = radius;
    this. angle = angle;
    this.xSpeed = speed * cos(angle);
    this.ySpeed = speed * sin(angle);
    this.shotInterval = shotInterval; // number of frames btw shots
    this.hits = hits; // after 5 hits, 
    this.health = health; // health goes down 1
    this.r = r;
    this.g = g;
    this.b = b;
  }
  show() {
    stroke(this.r, this.g, this.b);
    fill(this.r, this.g, this.b);
    circle(this.x, this.y, this.radius);
  }
  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
  updateHealth() {
    if (this.hits != 0 && this.hits % 5 == 0) {
      this.health--;
    }
  }
}

class LaserRay {
  constructor(x, y, length, angle, speed, r, g, b) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.angle = angle;
    this.r = r;
    this.g = g;
    this.b = b;
    this.xSpeed = speed * cos(angle);
    this.ySpeed = speed * sin(angle);
    this.hitBool = false;
  }
  show() {
    stroke(this.r, this.g, this.b);
    fill(this.r, this.g, this.b);
    rect(this.x, this.y, (this.length * cos(this.angle)+2), (this.length * sin(this.angle))+2);
  }
  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
  hitSpaceInvader() {
    for (let i = 0; i < spaceInvaders.length; i++) {
      if (Math.abs(this.x - spaceInvaders[i].x) < 5  && Math.abs(this.y - spaceInvaders[i].y) < 5) {
        noStroke();
        fill(this.r, this.g, this.b);
        circle(this.x, this.y, this.radius * 3);
        spaceInvaders[i].hits += 1;
        console.log(spaceInvaders[i].hits);
        this.hitBool = true;
      }
    }
  }
}


// PRELOAD
function preload() {
/*  for (let i = 0; i < 5; i++) {
    images.push(loadImage(`./assets/image${i}.jpg`));
  }*/
  imageNu = loadImage(`./assets/nu.png`);
}

// SETUP
function setup() {
  // use degrees as angle unit
  angleMode(DEGREES);
    
  // to align legend and canvas to horizontal menu, get its coordinates
  menu = document.getElementById("m1").getBoundingClientRect();
    
  // create canvas
  canvasX = menu.x;// + 140;
  canvasY = menu.y + menu.height + 10;
  canvasWidth = menu.width;// - 140;
  canvasHeight = min(windowHeight - canvasY - 10, 600);
  canvasFrame = createCanvas(canvasWidth, canvasHeight);
  canvasFrame.position(canvasX, canvasY);
  
  // set white background
  background(0);

  // for each of 5 types of spaceInvaders, create a row
  let y = spaceInvaderRowHeight;
  for (let i = 0; i < 5; i++) {
    //console.log("row number : " + i);
    i % 2 == 0 ? xStart = 50 : xStart = 50 + (2 * spaceInvaderRadius);
    //console.log("xStart : " + xStart);
    let spaceInvaderR = random(255);
    let spaceInvaderG = random(255);
    let spaceInvaderB = random(255);
    for (let x = xStart; x < (width - spaceInvaderRadius); x += (spaceInvaderRadius * 4)) {
      //console.log("x : " + x); angle, speed, shotInterval, hits, health
      spaceInvaders.push(new SpaceInvader(x, y, spaceInvaderRadius, 0, 2, 25, 0, 5, spaceInvaderR, spaceInvaderG,spaceInvaderB)); // rajouter image[i] en premier parametre une fois les images telechargees
    }
    y += spaceInvaderRowHeight;
  }
  //console.log("space invaders : ", spaceInvaders.length);

  // create player's shooting slider
  shootSlider = createSlider(50, width - 50, width / 2, 0);
  shootSlider.position(canvasX + 50, height - 35);
  shootSlider.size(width - 100);
  shootSlider.input(shootRay);

  // noLoop();
}

// FUNCTIONS
// shoot a ray when player moves shootSlider - for the time being, the bullets travel upwards (angle = -90)
function shootRay() {
  if (rayBool % rayScarcity == 0) { 
    laserRays.push(new LaserRay(shootSlider.value(), height - 50, rayLength, -90, 5, random(255), random(255), random(255)));
  }
  rayBool++;
}

// DRAW
function draw() {
  background(0);
  /*
    for (let img in images) {
      img.resize(150,0);
      image(img, 200, 50);
    }
*/
  imageNu.resize(50,0);
  image(imageNu, shootSlider.value() - 25, height - 60);

  // show spaceInvaders
  for (let i = 0; i < spaceInvaders.length; i++) {
    spaceInvaders[i].show();
  }

  // shoot laserRays and pop spaceInvader out if hit
  for (let i = 0; i < laserRays.length; i++) {
    laserRays[i].show();
    laserRays[i].move();
    laserRays[i].hitSpaceInvader();
  }

  // update spaceInvaders health
  for (let i = 0; i < spaceInvaders.length; i++) {
    spaceInvaders[i].updateHealth();
    if (spaceInvaders[i].health == 0) {
      spaceInvaders.splice(i, 1);
    }
  }
}