let video1; 
let video2;
let poseNet1;
let poseNet2;

let p1poses = [];
let p2poses = [];

let fireballs = [];

function setup() {
   createCanvas(640, 480);
 
   // Create a video capture object
   video1 = createCapture(VIDEO);
   video1.hide();
 
   // Create a new poseNet method with a single detection
   poseNet1 = ml5.poseNet(video1, modelReady);
 
   // This function runs when the model is ready
   function modelReady() {
     console.log('Model Loaded!');
   }
 
   // Listen for poses
   poseNet1.on('pose', function(results) {
     p1poses = results;
   });

   // Create a video capture object
   video2 = createCapture(VIDEO);
   video2.hide();
 
   // Create a new poseNet method with a single detection
   poseNet2 = ml5.poseNet(video2, modelReady);
 
   // This function runs when the model is ready
   function modelReady() {
     console.log('Model Loaded!');
   }
 
   // Listen for poses
   poseNet2.on('pose', function(results) {
     p2poses = results;
   });


 }

function draw() {
  // Draw the video frame to the canvas
  image(video1, 0, 0);

  // Loop through all the poses detected
  for (let i = 0; i < p1poses.length; i++) {
    let pose1 = p1poses[i].pose;

    // Get the position of the right hand, elbow, and shoulder
    let p1rightHand = pose1.rightWrist;
    let p1rightElbow = pose1.rightElbow;
    let p1rightShoulder = pose1.rightShoulder;
    let p1nose = pose1.nose;

    // Calculate the angle between the hand, elbow, and shoulder
    let angle = calculateAngle(p1rightShoulder, p1rightElbow, p1rightHand);

    // Draw a circle at the hand position
    fill(255, 0, 0);
    ellipse(p1rightHand.x, p1rightHand.y, 10, 10);

    // If the elbow angle is greater than or equal to 150 degrees, shoot a fireball
    if (angle >= 150) {
      let fireball = createFireball(p1rightHand.x, p1rightHand.y);
      fireballs.push(fireball);
    }

    fill(255, 255, 255);
    textAlign(CENTER);
    textSize(20);
    if (p1rightHand.x < width / 2) {
      text("Player 1", p1nose.x, p1nose.y - 150);
    }
  }

  // Update and draw all fireballs
  for (let i = fireballs.length - 1; i >= 0; i--) {
    let fireball = fireballs[i];
    fireball.update();
    fireball.draw();

    // Remove fireballs that have gone off screen
    if (fireball.isOffScreen()) {
      fireballs.splice(i, 1);
    }
  }
}

// A function to calculate the angle between three points
function calculateAngle(A, B, C) {
  let AB = dist(A.x, A.y, B.x, B.y);
  let BC = dist(B.x, B.y, C.x, C.y);
  let AC = dist(A.x, A.y, C.x, C.y);
  return degrees(acos((AB * AB + BC * BC - AC * AC) / (2 * AB * BC)));
}

// A function to create a new fireball at the given position
function createFireball(x, y) {
  return {
    x: x,
    y: y,
    speed: 10,
    size: 20,
    update: function() {
      this.x += this.speed;
    },
    draw: function() {
      fill(255, 165, 0);
      noStroke();
      ellipse(this.x, this.y, this.size, this.size);
    },
    isOffScreen: function() {
      return this.x > width;
    }
  };
}
