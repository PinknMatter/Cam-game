let video
let poseNet;
let poses = [];

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(width, height);


  // Create a new poseNet method with a multiple detection
  poseNet = ml5.poseNet(video, "multiple", modelReady);

  poseNet.on('pose', function (results) {
    poses = results;
    for (let i = 0; i < poses.length; i++) {
      poses.push(new Player(poses.length, poses[i]));
      print("done");
    }

  });

  video.hide();



}

function modelReady() {
  print('model loaded');
}

function draw() {
  image(video, 0, 0);

}

class Player {
  constructor(index, pose) {
    this.i = index;
    this.rightHand = pose.rightWrist;
    this.nose = pose.nose;

  }

  draw() {
    fill(255, 0, 0);
    ellipse(this.nose, 10, 10);
  }
}

