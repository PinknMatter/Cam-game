/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";
let video;
let poseNet;
let poses = [2];
let fighter;
let fimage


function preload(){
  fighter = loadFont('fonts/RoyalFighter.otf');
  fimage = loadImage('assets/images/fireball.png');

}

function setup(){
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  poses[0]= new Player();
  poses[1]= new Player();

  poseNet = ml5.poseNet(video, "multiple", modelReady);

  poseNet.on('pose', function(results){
    
    
    // poses.push(new Player(results, poses.length));
    
   
    if(results.length === 1){
      poses[0].setPoseInfo(results[0],1)
    }
    
     if(results.length === 2){
      if(results[0].pose.score > 0.50){
      poses[0].setPoseInfo(results[0],1)
      }

      if(results[1].pose.score > 0.50){
        poses[1].setPoseInfo(results[1],2)
      }
    }


  
  });
}

function modelReady(){
  print("model ready");
}

function draw(){
  background(0);
  image(video, 0, 0);
  // drawKeypoints();
  // drawSkeleton()
 
  for(let x = 0; x < poses.length; x++){
     poses[x].draw();
     poses[x].fireball();
     poses[x].phealth();
     poses[x].drawSkeleton();
     
     
     poses[x].torso();
     if( x === 1){
      poses[x].drawFire(poses[0].poly, 0);
     }
     else if (x === 0){
      poses[x].drawFire(poses[1].poly, 1);
     }

  }



}
function calculateAngle(A, B, C){
  let AB = dist(A.x, A.y, B.x, B.y);
  let BC = dist(B.x, B.y, C.x, C.y);
  let AC = dist(A.x, A.y, C.x, C.y);
  return degrees(acos((AB * AB + BC * BC - AC * AC) / (2 * AB * BC)));
}

class Player{
  constructor(){
     this.i =null;
     this.rightHand = null;
     this.nose = null;
     this.health = 100;
     this.canShoot = true;
     this.fireballs = [];
     this.poly = [];
  }
 

  
  setPoseInfo(pose, index){
    // right
    this.i = index;
    this.nose = pose.pose.nose;
    this.rightHand = pose.pose.rightWrist;
    this.rightElbow = pose.pose.rightElbow;
    this.rightShoulder = pose.pose.rightShoulder;
    this.Rangle = calculateAngle(this.rightShoulder, this.rightElbow, this.rightHand)
    // left
    this.leftHand = pose.pose.leftWrist;
    this.leftElbow = pose.pose.leftElbow;
    this.leftShoulder = pose.pose.leftShoulder;
    this.Langle = calculateAngle(this.leftShoulder, this.leftElbow, this.leftHand)

    //Torso
    this.rightHip = pose.pose.rightHip;
    this.leftHip = pose.pose.leftHip;

    //foot
    this.rightFoot = pose.pose.rightAnkle;
    this.leftFoot = pose.pose.leftAnkle;

    
  }

  torso(){
    if(this.i !== null){
    
    this.poly[0] = createVector(this.rightFoot.x, this.rightFoot.y);
    this.poly[1] = createVector(this.rightHip.x, this.rightHip.y) 
    this.poly[2] = createVector(this.rightShoulder.x, this.rightShoulder.y);
    this.poly[3] = createVector(this.nose.x, this.nose.y);
    this.poly[4] = createVector(this.leftShoulder.x, this.leftShoulder.y);
    this.poly[5] = createVector(this.leftHip.x, this.leftHip.y);
    this.poly[6] = createVector(this.leftFoot.x, this.leftFoot.y);
    
  }
  }

  drawFire(poly, playerindex){
    for(let z = 0; z < this.fireballs.length; z++){
      this.fireballs[z].update();
      this.fireballs[z].draw();
      this.fireballs[z].checkCollision(poly, playerindex);
      // this.fireballs[z].Offscreen(this.fireballs);
      
    }
  }

  draw(){
    // print(this.angle)
    if(this.i !==null){
    noStroke();
    fill("white");
    textFont(fighter);
    textSize(25);
    text("Player" + [this.i], this.nose.x - 60, this.nose.y - 90);
    }
  }

  drawSkeleton(){
    if(this.i !== null){
    strokeWeight(3);
    stroke(255);
   
      if(this.rightHand.confidence > 0.6){
      line(this.rightHand.x, this.rightHand.y, this.rightElbow.x, this.rightElbow.y);
     }
     line(this.rightShoulder.x, this.rightShoulder.y, this.rightElbow.x, this.rightElbow.y);
    }
  }

  fireball(){
    // print(this.Rangle);
    if(this.i !== null){
    if(this.rightHand.confidence > 0.5 && this.rightShoulder.confidence > 0.5 && this.rightElbow.confidence > 0.5){
     
    if(this.Rangle > 150){
  
      if(this.canShoot){
      //  print(this.canShoot);
      this.fireballs.push(new Fireball(this.rightHand.x, this.rightHand.y, this.fireballs.length, this.nose.x, this.nose.y, "red"))
      this.canShoot = false;
      let self = this;
      setTimeout(function(){ self.canShoot = true;}, 500);
      }
      
      
    }
  }
}


    // if(this.Langle > 150){
    //   setTimeout(fireballs.push(new Fireball(this.rightHand.x, this.rightHand.y, fireballs.length, this.nose.x, this.nose.y, "blue")), 10000);
    // }
  }

  phealth(){
    if(this.i !== null){
    fill('green');
    rect(this.nose.x - 60, this.nose.y - 80, this.health, 20);
    // print(this.health);
    }
  }

  

  
}

class Fireball{
  constructor(x, y, index, posx, posy, color){
    this.posx = posx;
    this.posy = posy;
    this.index = index;
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.size = 60;
    this.color = color;
  }

  draw(){
    noStroke();
    fill(this.color);
    image(fimage, this.x, this.y, this.size, this.size);
  }

  update(){
    if(this.posx > width/2){
    this.x -= this.speed;
    }
    if(this.posx < width/2){
      this.x += this.speed;
      }
    // this.x += this.speed;
    // this.y += this.speed / 4;
   
  }

  Offscreen(fireballs){
    if(this.x > width || this.x < 0 || this.y > height || this.y < 0){
      fireballs.splice(this.index, 1);
    }
  }

  checkCollision(poly, playerindex){
    let hit = collidePointPoly(this.x, this.y, poly);

    if(hit){
      print("hit");
      if(poses[playerindex].health > 0){
      poses[playerindex].health -= 0.5;
      print(poses[playerindex].health);
      }
    }
    if(poses[playerindex].health <= 0){
      text('KO!', width/2, height/2);
    }
    
  }


}