# Image Classifier Bot
### Application Info
This application is built on Node.js and Python. The client uses websockets to send images over to the server, and the server spawns a child python process to run forward propagation through inception's pretrained neural network using Tensorflow. The python process returns the results to the server, which forwards the results back to the client via websockets.
### Inception Model
The backend tensorflow application heavily utilizes inception's pretrained image classification model. The model is trained on 3000 classes of objects and animals, but unfortunately, is not trained on humans. If you tried directing the camera at yourself, I appoligize for whatever the model labeled you as.
### Side Note
I appoligize for the excess of poorly labelled git commits. I spent a long time trying to figure out why Heroku was working locally but was not allowing node to spawn a child python process after deployment, so I made many minor variations to push to heroku and see whether heroku could work with the changes.
### Video Streaming Issues?
 - Check that your device has a camera
 - Visit this site a browser which supports MediaDevices.getUserMedia (A modern version of Google-Chrome or Firefox will do)
 - Give this site permission to use your camera
