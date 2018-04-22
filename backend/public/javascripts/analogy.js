var video, canvas, labels, socket, last_word="";
var min_certainty=.1;
window.onload = function(){

  var target='http://localhost:3000'
  socket = io.connect(target);





};
/*
  var target='http://localhost:3000'

   pos = document.getElementById('positive');
   neg = document.getElementById('negative');

   //wait for video to update
   socket.emit('img',canvas.toDataURL());


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
*/
