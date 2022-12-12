let snake;
let rez = 40
let food
let w 
let h
let gFrameRate = 10
let gameState = "notready"
let cnv 
let bg1
let bg2

let stepTotal = 4
let stepEnd = 0 
let step = 0



function setup() {
  video = createCapture(VIDEO)
  video.hide()
  // createCanvas(640, 480+text)

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  
  let options = {
    inputs: 34,
    outputs: 5,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options)
  const modelInfo = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded)

  cnv = createCanvas(640, 480);
  w = floor(width / rez)
  h = floor(height / rez)
  frameRate(gFrameRate)
  snake = new Snake();
  foodLocation();
  
  bg1 = loadImage('assets/1.png');
  bg2 = loadImage('assets/2.png');
}

function foodLocation(){
  // fill(255,0, 0)
  // rect(10, 100, 10, 10)
  let x = floor(random(w))
  let y = floor(random(h))
  food = createVector(x, y)
}

function keyPressed(){
  if(keyCode === LEFT_ARROW){
    snake.setDir(-1, 0)
  } else if(keyCode === RIGHT_ARROW){
    snake.setDir(1, 0)
  } else if(keyCode === UP_ARROW){
    snake.setDir(0, -1)
  } else if(keyCode === DOWN_ARROW){
    snake.setDir(0, 1)
  } else if(key == "r"){
    loop()
    setup()
  }
}

function draw() {

  let dx = window.innerWidth/2-width/2;
  let dy = 0
  cnv.position(dx, dy+50);
  push()
  translate(width,0);
  scale(-1,1)
  image(video, 0, 0)
  filter(GRAY)
  pop()

  if(snake.body.length > 5){
    frameRate(gFrameRate+5)
  }
  if(snake.body.length > 10){
    frameRate(gFrameRate+10)
  }
  if(snake.body.length > 15){
    frameRate(gFrameRate+10)
  }

  if(gameState === "notready"){
    //background(0);
    background(bg1,100);
    fill(0)
    rect(0,0,width,60)
    let textToDisplay = "straight your arms"
    fill(255)
    textAlign(CENTER)
    text(textToDisplay,width/2,30)
  }

  if(gameState === "ready" && snake.ydir == 0 && snake.xdir == 0){
    background(bg2,100);
    fill(0)
    rect(0,0,width,60)
    let textToDisplay = "make a pose!"
    fill(255)
    textAlign(CENTER)
    text(textToDisplay,width/2,30)
    // background(bg,100);
  }

  if(gameState === "notready" && poseLabel === "n"){
    console.log("YES")
    gameState = "ready"
  }

  
  fill(255)
  textAlign(CENTER,CENTER)
  textSize(50)
  text(poseLabel, width/2, height/2)
  

  scale(rez)
  if(skeleton){
    push()
    scale(1/rez)
    translate(width,0);
    scale(-1,1)
    for(let i = 0; i < skeleton.length; i++){
      let a = skeleton[i][0]
      let b = skeleton[i][1]
      strokeWeight(5)
      stroke(0,100)
      line(0,0,10,10)
      line(a.position.x, a.position.y, b.position.x, b.position.y)
     }
    pop()
  }
  background(220,50);
  if(snake.eat(food)){
    foodLocation()
  }
  checkDir()
  if(step==stepEnd){
    step=stepTotal 
    snake.update() 
    if(snake.endGame()){
      displayEndGame()
      noLoop()
    }
  }
  step--
  console.log(step)
  
  snake.show()

  

  noStroke()
  fill(255,0, 0)
  rect(food.x, food.y, 1, 1)
  
}





function displayEndGame(){
  gameState = "EndGame"
  print("Endgame")
  push()
  scale(1/rez)
  translate(width,0);
  scale(-1,1)
  image(video, 0, 0)
  scale(-1,1)
  translate(-width,0);
  //background(255,90)
  fill(227,130,0)
  rect(0,height-75,width,100)
  let textToDisplay1 = "straight your arms to restart"
  let textToDisplay2 = `Your Score is: ${snake.body.length}`
  fill(255)
  textSize(30)
  textAlign(CENTER)
  text(textToDisplay1,width/2,height-25)
  text(textToDisplay2,width/2,height-50)
  pop() 
}




function checkDir(){
  if(gameState == "ready"){
    if(poseLabel === 'ArrowLeft'){
      snake.setDir(-1, 0)
    } else if(poseLabel === 'ArrowRight'){
      snake.setDir(1, 0)
    } else if(poseLabel === 'ArrowUp'){
      snake.setDir(0, -1)
    } else if(poseLabel === 'ArrowDown'){
      snake.setDir(0, 1)
    }
  }
}