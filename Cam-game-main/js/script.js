
let arcadefont;
let logo;
let startscreen;
let sbutton;
let instructions;
let clicked = false;

function preload(){
  //images
  startscreen = loadImage('assets/images/title.png');
  logo = loadImage('assets/images/logo.png');
  sbutton = loadImage('assets/images/sbutton.png');
  instructions = loadImage('assets/images/instructions.png');

  //font
  arcadefont = loadFont('assets/Fonts/ARCADECLASSIC.TTF')
}

function setup(){
  createCanvas(640, 480);
  background(255,255,255);
}

function draw(){
  
  if (!clicked) {
  image(startscreen, 0, -70, 640, 640);
  image(logo, 0, 90);
  image(sbutton, 90, 330);
  
  
  //start button text
  noStroke();
  fill(22,16,58);
  textFont(arcadefont);
  textSize(40);
  text("START", 110, 371);
  

  //hover text
  if (mouseX > 110 && mouseX < 215 && mouseY > 348 && mouseY < 370){
    noStroke();
    fill(246, 189, 100);
    textFont(arcadefont);
    textSize(40);
    text("START", 110, 371);
  }
}
}

function mouseClicked() {
  if (mouseX > 110 && mouseX < 215 && mouseY > 348 && mouseY < 370) {
    clicked = true;
    clear();
    image(instructions, 0, -70, 640, 640);
  
  
  fill(22,16,58);
  textFont(arcadefont);
  textSize(40);
  textAlign(CENTER, CENTER)

  stroke(22,16,58);
  strokeWeight(7);
  text("INSTRUCTIONS", width/2, 50);
  noStroke();
  fill(255,255,255);
  text("INSTRUCTIONS", width/2, 50);
  
  

  stroke(22,16,58);
  strokeWeight(7);
  text("1  extend  arm  to  fire", width/2, 150);
  noStroke();
  fill(255,255,255);
  text("1  extend  arm  to  fire", width/2, 150);  

  stroke(22,16,58);
  strokeWeight(7);
  text("2  move  from  blasts", width/2, 220);
  noStroke();
  fill(255,255,255);
  text("2  move  from  blasts", width/2, 220);

  stroke(22,16,58);
  strokeWeight(7);
  text("3  retract arm  to  block", width/2, 290);
  noStroke();
  fill(255,255,255);
  text("3  retract arm  to  block", width/2, 290);
  
  stroke(22,16,58);
  strokeWeight(7);
  text("4  defeat enemy", width/2, 350);
  noStroke();
  fill(255,255,255);
  text("4  defeat enemy", width/2, 350);
  

  //next button image

  image(sbutton, 250, 400);

    //next button text
  noStroke();
  fill(22,16,58);
  textFont(arcadefont);
  textSize(40);
  text("next", 320, 425);

  //hover text
  if (mouseX > 320 && mouseX < 425 && mouseY > 400 && mouseY < 450){
    
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
  background(200, 200, 200);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Something else", width/2, height/2);
}
}





