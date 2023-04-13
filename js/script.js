/**
Mythic Clash
Noah Kornberg + Damian 
*/

"use strict";
//Initiate all variables
let video;
let poseNet;
let poses = [2];
let fighter;
let fimage;
let shield;
let state = "start";
let logo;
let startscreen;
let sbutton;
let instructions;
let clicked = false;
let arcadefont;
let shieldsound;
let fireballsound;
let KO;
let gif;
let end = 1;

//preload all images and sounds
function preload() {
  startscreen = loadImage("assets/images/title.png");
  logo = loadImage("assets/images/logo.png");
  sbutton = loadImage("assets/images/sbutton.png");
  instructions = loadImage("assets/images/instructions.png");
  fighter = loadFont("fonts/RoyalFighter.otf");
  fimage = loadImage("assets/images/fball.png");
  shield = loadImage("assets/images/block.png");
  arcadefont = loadFont("fonts/ARCADECLASSIC.TTF");
  shieldsound = loadSound("assets/sounds/shieldsound.mp3");
  fireballsound = loadSound("assets/sounds/fireballsound.mp3");
  KO = loadSound("assets/sounds/KO.mp3");
  gif = loadImage("assets/images/gif.gif");
}
//sets up posenet
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  poses[0] = new Player();
  poses[1] = new Player();

  poseNet = ml5.poseNet(video, "multiple", modelReady);

  poseNet.on("pose", function (results) {
    // poses.push(new Player(results, poses.length));

    if (results.length === 1) {
      poses[0].setPoseInfo(results[0], 1, color(246, 189, 100));
    }

    if (results.length === 2) {
      //Have defined poses for the characters based of where they are on screen
      if (results[0].pose.nose.x < width / 2) {
        if (results[0].pose.score > 0.5) {
          poses[0].setPoseInfo(results[0], 1, color(246, 189, 100));
        }

        if (results[1].pose.score > 0.5) {
          poses[1].setPoseInfo(results[1], 2, color(22, 16, 58));
        }
      } else if (results[1].pose.nose.x < width / 2) {
        if (results[1].pose.score > 0.5) {
          poses[0].setPoseInfo(results[1], 1, color(246, 189, 100));
        }

        if (results[0].pose.score > 0.5) {
          poses[1].setPoseInfo(results[0], 2, color(22, 16, 58));
        }
      }
    }
  });
}

//make sure the model is ready
function modelReady() {
  print("model ready");
}

function draw() {
  //if state is start run the start menu
  if (state === "start") {
    if (!clicked) {
      image(startscreen, 0, -70, 640, 640);
      image(logo, 0, 90);
      image(sbutton, 90, 330);

      //start button text
      noStroke();
      fill(22, 16, 58);
      textFont(arcadefont);
      textSize(40);
      text("START", 110, 371);

      //hover text
      if (mouseX > 110 && mouseX < 215 && mouseY > 348 && mouseY < 370) {
        noStroke();
        fill(246, 189, 100);
        textFont(arcadefont);
        textSize(40);
        text("START", 110, 371);
      }
    }
  }
  //if state is game run the game
  if (state === "game") {
    background(0);
    image(video, 0, 0);

    // drawKeypoints();
    // drawSkeleton()
    //loop through for loop and draw all systems
    for (let x = 0; x < poses.length; x++) {
      poses[x].draw();
      poses[x].fireball();
      poses[x].phealth();
      //  poses[x].drawSkeleton();
      poses[x].pShield();

      poses[x].torso();
      if (x === 1) {
        //sets the other persons shield to the fireball contructor for collision detection
        poses[x].drawFire(poses[0].poly, 0, poses[0].shield);
      } else if (x === 0) {
        poses[x].drawFire(poses[1].poly, 1, poses[1].shield);
      }
    }
  }
}
//calculate the angle between the elbow shoulder and hand
function calculateAngle(A, B, C) {
  let AB = dist(A.x, A.y, B.x, B.y);
  let BC = dist(B.x, B.y, C.x, C.y);
  let AC = dist(A.x, A.y, C.x, C.y);
  return degrees(acos((AB * AB + BC * BC - AC * AC) / (2 * AB * BC)));
}

//the menu
function mouseClicked() {
  if (state === "start") {
    if (mouseX > 110 && mouseX < 215 && mouseY > 348 && mouseY < 370) {
      clicked = true;
      clear();
      image(instructions, 0, -70, 640, 640);

      fill(22, 16, 58);
      textFont(arcadefont);
      textSize(40);
      textAlign(CENTER, CENTER);

      stroke(22, 16, 58);
      strokeWeight(7);
      text("INSTRUCTIONS", width / 2, 50);
      noStroke();
      fill(255, 255, 255);
      text("INSTRUCTIONS", width / 2, 50);

      stroke(22, 16, 58);
      strokeWeight(7);
      text("1  extend  arm  to  fire", width / 2, 150);
      noStroke();
      fill(255, 255, 255);
      text("1  extend  arm  to  fire", width / 2, 150);

      stroke(22, 16, 58);
      strokeWeight(7);
      text("2  move  from  blasts", width / 2, 220);
      noStroke();
      fill(255, 255, 255);
      text("2  move  from  blasts", width / 2, 220);

      stroke(22, 16, 58);
      strokeWeight(7);
      text("3  retract arm  to  block", width / 2, 290);
      noStroke();
      fill(255, 255, 255);
      text("3  retract arm  to  block", width / 2, 290);

      stroke(22, 16, 58);
      strokeWeight(7);
      text("4  defeat enemy", width / 2, 350);
      noStroke();
      fill(255, 255, 255);
      text("4  defeat enemy", width / 2, 350);

      //next button image

      image(sbutton, 250, 400);

      //next button text
      noStroke();
      fill(22, 16, 58);
      textFont(arcadefont);
      textSize(40);
      text("next", 320, 425);

      //hover text
      if (mouseX > 320 && mouseX < 425 && mouseY > 400 && mouseY < 450) {
        noStroke();
        fill(246, 189, 100);
        textFont(arcadefont);
        textSize(40);
        text("next", 320, 425);
      }
    }

    if (mouseX > 270 && mouseX < 425 && mouseY > 415 && mouseY < 440) {
      // next button is clicked
      clicked = true;
      clear();
      // display something else
      state = "game";
    }
  }
}

//player class
class Player {
  constructor() {
    this.i = null;
    this.rightHand = null;
    this.nose = null;
    this.health = 100;
    this.canShoot = true;
    this.fireballs = [];
    this.poly = [];
    this.shield = [];
  }

  //gets the post info fro posenet and rename all values as variables in the player class
  setPoseInfo(pose, index, healthcol) {
    // right
    this.i = index;
    this.nose = pose.pose.nose;
    this.rightHand = pose.pose.rightWrist;
    this.rightElbow = pose.pose.rightElbow;
    this.rightShoulder = pose.pose.rightShoulder;
    this.Rangle = calculateAngle(
      this.rightShoulder,
      this.rightElbow,
      this.rightHand
    );

    //left is important for fireball player collision
    // left
    this.leftHand = pose.pose.leftWrist;
    this.leftElbow = pose.pose.leftElbow;
    this.leftShoulder = pose.pose.leftShoulder;
    this.healthcol = healthcol;

    //Torso
    this.rightHip = pose.pose.rightHip;
    this.leftHip = pose.pose.leftHip;

    //foot
    this.rightFoot = pose.pose.rightAnkle;
    this.leftFoot = pose.pose.leftAnkle;
  }

  torso() {
    if (this.i !== null) {
      //create a vector within the player for collision detection with the fireball

      this.poly[0] = createVector(this.rightFoot.x, this.rightFoot.y);
      this.poly[1] = createVector(this.rightHip.x, this.rightHip.y);
      this.poly[2] = createVector(this.rightShoulder.x, this.rightShoulder.y);
      this.poly[3] = createVector(this.nose.x, this.nose.y);
      this.poly[4] = createVector(this.leftShoulder.x, this.leftShoulder.y);
      this.poly[5] = createVector(this.leftHip.x, this.leftHip.y);
      this.poly[6] = createVector(this.leftFoot.x, this.leftFoot.y);
    }
  }

  //draw fire draws all fireballs
  drawFire(poly, playerindex, shield) {
    for (let z = 0; z < this.fireballs.length; z++) {
      // console.log(shield);
      this.fireballs[z].update();
      this.fireballs[z].draw();
      //always checks fireball collision with the other player
      this.fireballs[z].checkCollision(poly, playerindex);
      if (this.Rangle > 150) {
        //if the angle is above 150 check for collion with the shield
        this.fireballs[z].checkShield(shield, playerindex, this.fireballs);
      }
      // this.fireballs[z].Offscreen(this.fireballs);
    }
  }

  draw() {
    // print(this.angle)
    //draws the player name above their head
    if (this.i !== null) {
      noStroke();
      fill("black");
      textFont(arcadefont);
      textSize(25);
      textAlign(CENTER);
      text("Player" + [this.i], this.nose.x, this.nose.y - 85);
    }
  }

  //use for testing purposes only, draws a skeleton on the right arm
  drawSkeleton() {
    if (this.i !== null) {
      strokeWeight(3);
      stroke(255);

      if (this.rightHand.confidence > 0.6) {
        line(
          this.rightHand.x,
          this.rightHand.y,
          this.rightElbow.x,
          this.rightElbow.y
        );
      }
      line(
        this.rightShoulder.x,
        this.rightShoulder.y,
        this.rightElbow.x,
        this.rightElbow.y
      );
    }
  }

  //fireball function
  fireball() {
    //if index is not null and the confidence of the prediction is good
    if (this.i !== null) {
      if (
        this.rightHand.confidence > 0.5 &&
        this.rightShoulder.confidence > 0.5 &&
        this.rightElbow.confidence > 0.5
      ) {
        //angle has to be above 150 so almost straight
        if (this.Rangle > 150) {
          if (this.canShoot) {
            //  print(this.canShoot);
            fireballsound.play();
            //push all needed variables to the fireball constructor
            this.fireballs.push(
              new Fireball(
                this.rightHand.x,
                this.rightHand.y,
                this.fireballs.length,
                this.nose.x,
                this.rightHand.y,
                "red",
                this.Rangle,
                this.rightShoulder
              )
            );
            this.canShoot = false;
            let self = this;
            //sets a time delay on when the player can shoot fireballs
            setTimeout(function () {
              self.canShoot = true;
            }, 1000);
          }
        }
      }
    }

    // if(this.Langle > 150){
    //   setTimeout(fireballs.push(new Fireball(this.rightHand.x, this.rightHand.y, fireballs.length, this.nose.x, this.nose.y, "blue")), 10000);
    // }
  }

  pShield() {
    //shield function
    if (this.i !== null) {
      //if the angle is less the 120 so almost bent
      if (this.Rangle < 120) {
        //create a collision vector
        this.shield[0] = createVector(
          this.rightHand.x - 30,
          this.rightHand.y - 70
        );
        this.shield[1] = createVector(
          this.rightHand.x - 30 + 35,
          this.rightHand.y - 70
        );
        this.shield[2] = createVector(
          this.rightHand.x - 30,
          this.rightHand.y - 70 + 200
        );
        this.shield[3] = createVector(
          this.rightHand.x - 30 + 35,
          this.rightHand.y - 70 + 200
        );

        rectMode(CORNER);
        fill("red");
        //draw image of shield
        image(shield, this.rightHand.x - 60, this.rightHand.y - 30, 120, 120);
        // rect(this.shield[0].x, this.shield[0].y, 35, 200);
        fill("blue");

        // ellipse(this.shield[0].x, this.shield[0].y, 5, 5);
        // ellipse(this.shield[1].x, this.shield[1].y, 5, 5);
        // ellipse(this.shield[2].x, this.shield[2].y, 5, 5);
        // ellipse(this.shield[3].x, this.shield[3].y, 5, 5);

        // let shieldhit = collidepointLine()
      }
    }
  }

  phealth() {
    //draws players health above their head
    if (this.i !== null) {
      fill(this.healthcol);
      rectMode(CENTER);
      rect(this.nose.x, this.nose.y - 65, this.health, 20);

      // print(this.health);
    }
  }
}

//fireball class :)
class Fireball {
  constructor(x, y, index, posx, posy, color, angle, shoulder) {
    this.posx = posx;
    this.posy = posy;
    this.index = index;
    this.x = x;
    this.y = y;
    //calculates the angle of which the fireball should shoot out of
    this.speedx = cos(radians(angle)) * 1;
    this.speedy = sin(radians(angle)) * 1;
    this.size = 60;
    this.color = color;
    this.angle = angle;
    this.shoulder = shoulder;
  }

  draw() {
    //draws the fireball
    noStroke();
    fill(this.color);
    image(fimage, this.x, this.y, this.size, this.size);
  }

  update() {
    //update the fireball based on position. if the position of the hand is above the shoulder then the fireball
    //shoots up, if its below then the fireball shoots down. add the velocity and angle equation so the fireball
    //always shoots out of the hand
    if (this.posx > this.shoulder.y) {
      this.x += this.speedx * 8;
    }
    if (this.posx < this.shoulder.y) {
      this.x -= this.speedx * 8;
    }
    if (this.posy > height / 2) {
      this.y += this.speedy * 10;
    }

    if (this.posy < height / 2) {
      this.y -= this.speedy * 10;
    }

    // this.x += this.speed;
    // this.y += this.speed / 4;
  }
  //get rid of the fireball if its off screen
  Offscreen(fireballs) {
    if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
      fireballs.splice(this.index, 1);
    }
  }
  //check collision with the fireball and vector made for player collision
  checkCollision(poly, playerindex) {
    let hit = collidePointPoly(this.x, this.y, poly);

    if (hit) {
      //if a fireball hits players health goes down
      if (poses[playerindex].health > 0) {
        poses[playerindex].health -= 1;
        // print(poses[playerindex].health);
      }
    }
    //if the players health hits 0, the game is over
    if (poses[playerindex].health <= 0) {
      textSize(70);
      if (end === 1) {
        KO.play();
        end++;
      }
      image(gif, width / 2 - 128, height / 2 - 60);
    }
  }
  //check the collision of the fireballs with the create shield collision vector
  checkShield(shield, playerindex, fireballs) {
    // console.log("here");

    if (shield.length != 0) {
      let shieldhit = collidePointPoly(this.x, this.y, shield);
      //console.log(p5.Vector.dist( shield[0], createVector(this.x,this.y)));

      //if collide splice the fireball and play collision sound
      if (shieldhit) {
        shieldsound.play();
        print("shield hit");
        fireballs.splice(this.index, 1);
      }
    }
  }
}
