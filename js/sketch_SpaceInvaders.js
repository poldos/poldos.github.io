// GLOBAL VARIABLES

let canvasFrame;
let canvasWidth;
let canvasHeight;
let canvasX;
let canvasY;
let menu;

let imgs = [];
let imageNu;

let spaceInvaders = [];
let spaceInvaderRadius = 60;
let spaceInvaderRowHeight = 40;
let spaceInvaderColSpacing = 120;
let spaceInvaderRows = 6;
let spaceInvaderSpeed = 20;
let spaceInvaderTickRate = 10; // move only every tickRate frames
let spaceInvaderAngle = 5; // head rotation angle

let laserRays = [];
let rayLength = 10;
let rayBool = 0;
let rayScarcity = 1; // the higher the number, the lower the density of the rays (and the higher the scarcity)
let rayHitPrecision = 20; // the higher the number, the easier it is to hit

let newGameButton;

// CLASSES

class SpaceInvader {
  constructor(img, x, y, angle, speed, shotInterval, hits, health) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.xSpeed = 0;
    this.ySpeed = speed / 100;
    this.shotInterval = shotInterval; // number of frames btw shots
    this.hits = hits; // after 5 hits, 
    this.health = health; // health goes down 1
    this.tick = 0;
  }
  show() {
    push();
    translate(this.x + spaceInvaderRadius/2, this.y + spaceInvaderRadius/2);
    rotate(this.angle);
    this.img.resize(spaceInvaderRadius,0);
    image(this.img, -spaceInvaderRadius, -spaceInvaderRadius);
    pop();
  }
  move() {
    if (this.tick % spaceInvaderTickRate == 0) {
      this.x += this.xSpeed * spaceInvaderTickRate;
      this.y += this.ySpeed * spaceInvaderTickRate;
      this.angle *= -1;
      this.ySpeed += 0.01;
    }
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
    this.killBool = false;
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
      if (Math.abs(this.x - spaceInvaders[i].x) < rayHitPrecision  && Math.abs(this.y - spaceInvaders[i].y) < rayHitPrecision) {
        noStroke();
        fill(this.r, this.g, this.b);
        circle(this.x, this.y, this.radius * 3);
        spaceInvaders[i].hits += 1;
        spaceInvaders[i].updateHealth();
        if (spaceInvaders[i].health == 0) {
          spaceInvaders.splice(i, 1);
          this.killBool = true;
        }
      }
    }
  }
}
// PRELOAD
function preload() {
  for (let i = 0; i < spaceInvaderRows; i++) {
    imgs.push(loadImage(`./assets/img${i}.png`));
  }
  imageNu = loadImage(`./assets/nu.png`);
}
// SETUP
function setup() {
  // use degrees as angle unit
  angleMode(DEGREES);
  // create canvas
  canvasWidth = windowWidth - 50;
  canvasHeight = windowHeight - 50;
  canvasX = (windowWidth - canvasWidth) / 2;
  canvasY = 0;
  canvasFrame = createCanvas(canvasWidth, canvasHeight);
  canvasFrame.position(canvasX, canvasY);
  // set white background
  background(0);
  // for each of 5 types of spaceInvaders, create a row
  let y = spaceInvaderRowHeight;
  let clockMirror = 1;
  for (let i = 0; i < spaceInvaderRows; i++) {
    i % 2 == 0 ? xStart = spaceInvaderRadius : xStart = spaceInvaderColSpacing;
    let clockwise = clockMirror;
    for (let x = xStart; x < (width - spaceInvaderRadius); x += spaceInvaderColSpacing) {
      spaceInvaders.push(new SpaceInvader(imgs[i], x, y, clockwise * spaceInvaderAngle, spaceInvaderSpeed, 25, 0, 5));
      clockwise *= -1;
    }
    y += spaceInvaderRowHeight;
    clockMirror *= -1;
  }
  // create player's shooting slider
  shootSlider = createSlider(50, width - 50, width / 2, 0);
  shootSlider.position(canvasX + 50, height - 20);//- 35);
  shootSlider.size(width - 100);
  shootSlider.input(shootRay);
  // create new game button
  newGameButton = createButton('New Game');
  newGameButton.position(canvasX + width/2 - 100, windowHeight - 40);
  newGameButton.size(200,25);
  newGameButton.style('font-family', 'Andika');
  newGameButton.style('font-size', '12px');
  newGameButton.mousePressed(newGame);
}
// FUNCTIONS
// shoot a ray when player moves shootSlider
function shootRay() {
  if (rayBool % rayScarcity == 0) { 
    laserRays.push(new LaserRay(shootSlider.value(), height - 50, rayLength, -90, 5, random(255), random(255), random(255)));
  }
  rayBool++;
}
// new Game
function newGame() {
  location.reload();
}
// DRAW
function draw() {
  background(0);
  // Nu gun !
  imageNu.resize(50,0);
  image(imageNu, shootSlider.value() - 23, height - 90);//- 60);
  // show spaceInvaders
  if (spaceInvaders.length == 0) {
    noLoop();
    noStroke();
    fill(255);
    ellipse(width/2, height/2, 0.8 * width, 0.8 * height/2);
    fill(255, 0, 0);
    textAlign(CENTER);
    textSize(28);
    text("You have won. 🎉Thanks to you,\n NUPES has destroyed Macron and his suckers !✊\n", width/2, height/2);
  } else {
    for (let i = 0; i < spaceInvaders.length; i++) {
      spaceInvaders[i].show();
      spaceInvaders[i].tick++;
      spaceInvaders[i].move();
      if (spaceInvaders[i].y > height - 60 - spaceInvaderRadius) {
        noLoop();
        noStroke();
        fill(255);
        ellipse(width/2, height/2, 0.8 * width, 0.8 * height/2);
        fill(255, 0, 0);
        textAlign(CENTER);
        textSize(28);
        text("You have lost. \n 😈Macron will rule FOREVER hahahaha !😈\n", width/2, height/2);
      }
    }
    // shoot laserRays, pop spaceInvader out if hit x times and pop laserRay if out of frame
    for (let i = 0; i < laserRays.length; i++) {
      laserRays[i].show();
      laserRays[i].move();
      laserRays[i].hitSpaceInvader();
      if (laserRays[i].killBool == true || laserRays[i].y == 0) {
        laserRays.splice(i,1);
      }
    }
  }
}