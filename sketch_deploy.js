let video
let poseNet
let pose 
let skeleton
let brain
let textAreaY = 50
let poseLabel

let state = `waiting`
let targetLabel 


function modelLoaded() {
  console.log('Model Loaded!');
}

function brainLoaded() {
  console.log('pose classification ready!');
  classifyPose()
}

function classifyPose(){
  if(pose){
    let inputs = []
    for(let i = 0; i < pose.keypoints.length; i++){
      let x = pose.keypoints[i].position.x
      let y = pose.keypoints[i].position.y
      inputs.push(x)
      inputs.push(y)
    }
    brain.classify(inputs, gotResult)
  } else{
    setTimeout(classifyPose, 100)
  }
}

function gotResult(err, results){
  // console.log(results)
  
  if(poseLabel == "n" && gameState == "EndGame"){
    loop()
    setup()
    setTimeout(() => {
      loop()
      setup()
    }, 300);
    gameState = "notready"
  }

  if(results){
    //console.log(results[0].label)
    if(results[0].confidence > 0.75){
      poseLabel = results[0].label
      // //textAreaBG
      // strokeWeight(0)
      // fill(0)
      // rect(0,height,width,-textAreaY)
  
      //textAreaFText
      // scale(-1,1)
      // fill(255)
      // textAlign(CENTER,CENTER)
      // textSize(2)
      // text(results[0].label+" || "+round(results[0].confidence*100),0, 0)
    }
    classifyPose()
  }
  //call classifyPose again
  
}

function gotPoses(poses){
  if(poses.length > 0){
    pose = poses[0].pose
    skeleton = poses[0].skeleton
    
  }
}

// function setup(){
//   video = createCapture(VIDEO)
//   video.hide()
//   createCanvas(640, 480+textAreaY)

//   poseNet = ml5.poseNet(video, modelLoaded);
//   poseNet.on('pose', gotPoses);
  
//   let options = {
//     inputs: 34,
//     outputs: 5,
//     task: 'classification',
//     debug: true
//   }
//   brain = ml5.neuralNetwork(options)
//   const modelInfo = {
//     model: 'model/model.json',
//     metadata: 'model/model_meta.json',
//     weights: 'model/model.weights.bin',
//   };
//   brain.load(modelInfo, brainLoaded)
// }

// function draw(){
//   translate(width,0);
//   scale(-1,1)
//   image(video, 0, 0)
//   //poseNet
//   if(pose){
//     let EyeLx = pose.leftEye.x
//     let EyeLy = pose.leftEye.y
//     let EyeRx = pose.rightEye.x
//     let EyeRy = pose.rightEye.y
//     let dis = dist(EyeLx, EyeLy, EyeRx, EyeRy)
//     strokeWeight(0)
//     textSize(dis/2)
//     textAlign(CENTER)
//     //text(round(dis), (EyeLx+EyeRx)/2, (EyeLy+EyeRy)/2)

//     for(let i = 0; i < pose.keypoints.length; i++){
//       let x = pose.keypoints[i].position.x
//       let y = pose.keypoints[i].position.y
//       let score = pose.keypoints[i].score
//       noFill()
//       circle(x, y, 10)
//     }

//     for(let i = 0; i < skeleton.length; i++){
//       a = skeleton[i][0]
//       b = skeleton[i][1]
//       strokeWeight(5)
//       stroke(255,0,0,255n)
//       line(a.position.x, a.position.y, b.position.x, b.position.y)
//     }
//   }
// }