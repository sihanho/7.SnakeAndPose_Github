let video
let poseNet
let pose 
let skeleton
let brain
let textAreaY = 50

let state = `waiting`
let targetLabel 

function keyPressed(){
  if(key == `s`){
    brain.saveData()
  }else{
    targetLabel = key
    console.log(targetLabel)

    setTimeout(function(){
      state = 'collecting'
      console.log(state)
  
      setTimeout(function(){
        console.log("not collecting")
        state = 'waiting'
      },10000)
  
    },3000)
  }
}

function modelLoaded() {
  console.log('Model Loaded!');
}

function gotPoses(poses){
  if(poses.length > 0){
    pose = poses[0].pose
    skeleton = poses[0].skeleton
    if(state == 'collecting'){
      let inputs = []
      for(let i = 0; i < pose.keypoints.length; i++){
        let x = pose.keypoints[i].position.x
        let y = pose.keypoints[i].position.y
        inputs.push(x)
        inputs.push(y)
      }
      let target = [targetLabel]
      brain.addData(inputs, target)
    }
  }
}

function setup(){
  video = createCapture(VIDEO)
  video.hide()
  createCanvas(640, 480+textAreaY)

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  
  let options = {
    inputs: 34,
    outputs: 5,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options)
}

function draw(){
  translate(width,0);
  scale(-1,1)
  image(video, 0, 0)

  //textAreaBG
  noStroke()
  fill(0)
  rect(0,height,width,-textAreaY)
  //textAreaFText
  scale(-1,1)
  fill(255)
  textAlign(CENTER,CENTER)
  textSize(textAreaY/2)

  if(targetLabel){
    let pressedKey = targetLabel.toUpperCase()
    text(`Key: ${pressedKey} || State: ${state}`, -(width/2), height-textAreaY/2)
  }

  //poseNet
  scale(-1,1)
  if(pose){
    let EyeLx = pose.leftEye.x
    let EyeLy = pose.leftEye.y
    let EyeRx = pose.rightEye.x
    let EyeRy = pose.rightEye.y
    let dis = dist(EyeLx, EyeLy, EyeRx, EyeRy)
    textSize(dis/2)
    textAlign(CENTER)
    text(round(dis), (EyeLx+EyeRx)/2, (EyeLy+EyeRy)/2)

    for(let i = 0; i < pose.keypoints.length; i++){
      let x = pose.keypoints[i].position.x
      let y = pose.keypoints[i].position.y
      let score = pose.keypoints[i].score
      if(score > 0.95){
        noFill()
        circle(x, y, 10)
      }
    }

    for(let i = 0; i < skeleton.length; i++){
      a = skeleton[i][0]
      b = skeleton[i][1]
      strokeWeight(5)
      stroke(255,0,0,255n)
      line(a.position.x, a.position.y, b.position.x, b.position.y)
    }
  }
  

    
}