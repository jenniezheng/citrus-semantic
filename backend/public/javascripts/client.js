var video, canvas, labels, socket, last_word="";
var min_certainty=.1;
window.onload = function(){

  //for heroku builds
  //var target="https://image-classifier-bot.herokuapp.com/"
  var target='http://localhost:3000'

   // Grab elements, create settings, etc.
   socket = io.connect(target);
   video = document.getElementById('video');
   canvas = document.getElementById('canvas');
   labels = document.getElementsByTagName('label');
   var camera_works=access_video();

   //wait for video to update
   if (camera_works){
     setTimeout(function(){
       copy_to_canvas();
       socket.emit('img',canvas.toDataURL());
     }, 1000);
   }
     else {
      alert("Failed to gain access to your camera.");
     }


  socket.on("result", function (data){
    //split by new line
    //lines.length is actually 4 with one empty line
    lines=data.split(/\r?\n/);
    console.log(labels.length)
    for (let i=0; i<labels.length; i+=1) {
      labels[i].innerHTML=lines[i];
    }
    //certainty/score
    var score=parseFloat(lines[0].split("=")[1].split(')')[0]);
    if( score < min_certainty)
      speak("I don't know.")
    else{
        //first word
      var word=lines[0].split('(')[0].split(',')[0];
      if(word!=last_word && score > .1)
        speak(word)
      last_word=word;
    }
    //do again
    copy_to_canvas();
    socket.emit('img',canvas.toDataURL());
  });

};

 function access_video(){
  // Get access to camera
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //lower framerate
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", frameRate: { ideal: 10, max: 15 },
      width: 512, height: 512  } }).then(function(stream) {
      video.src = window.URL.createObjectURL(stream);
      video.play();
    });
    return true;
  }
  //no camera :(
  return false;
}
function copy_to_canvas() {
  var context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  //note this URL changes for every new canvas draw.
  //must be sent every time
  var data = canvas.toDataURL('image/png');
  var ctx = canvas.getContext('2d');
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function speak(guess){
var msg = new SpeechSynthesisUtterance(guess);
window.speechSynthesis.speak(msg);
}
