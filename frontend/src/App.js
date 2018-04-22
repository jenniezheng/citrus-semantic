import React, { Component } from 'react';
import './App.css';
import openSocket from 'socket.io-client';
import { Route, Switch } from 'react-router'
import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyBBdY1PTGPFSivd0qO6Eh_sZwoiBXTq9eE",
  authDomain: "myawesomeproject-74d03.firebaseapp.com",
  databaseURL: "https://myawesomeproject-74d03.firebaseio.com",
  projectId: "myawesomeproject-74d03",
  storageBucket: "myawesomeproject-74d03.appspot.com",
  messagingSenderId: "727493500579"
};
firebase.initializeApp(config);
const storage = firebase.storage().ref()
const socket = openSocket('http://localhost:3000');
let init = false;

class ImageVersion extends Component {

  constructor(props) {
    super(props);
    this.state = {
      word: "",
      uploadimage1:'',
      wordsimage1:[],
      uploadimage2:'',
      wordsimage2:[],
      image3:''
    }
  }

  updateImage(num,e) {
    let file = e.target.files[0];
    const name = "uploadimage"+num;
    const metadata = {contentType: file.type};
    storage.child(name).put(file, metadata)
    .then((snapshot) => {
      const url = snapshot.downloadURL;
      let {state} = this;
      state[name] = url;
      this.setState(state);
    })
    .catch((error) => console.error(error));
  }

  googleRecognizeImage(num,e,url){
    let req= {
      "requests": [
        {
          "image": {
            "source": {
              "imageUri": url
            }
          },
          "features": [
            {
              "type": "LABEL_DETECTION",
               "maxResults":4
            }
          ]
        }
      ]
    }
    fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDZnJDd_m3NXTSUCjThtmNigbMMrZiepME', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)
    })
    .then(response => response.json())
    .then(json => {
      let arr = json['responses'][0]['labelAnnotations'];
      let { state } = this;
      state['wordsimage'+num] = arr;
      this.setState(state);
    })
    .catch(error => console.log(error));
  }

  search = (term) => {
    fetch('https://www.googleapis.com/customsearch/v1?key=AIzaSyCVNcHkdrsOsgzmpgCWtr_4tPcEo2-U2kk&cx=002590090237152809819:yqtwpa9qvr0&q='+term+'&searchType=image')
    .then(response => response.json())
    .then(myJson => {
      alert(myJson);
      if(myJson.items){
        let image3 = myJson.items[0].link;
        this.setState({image3});
        console.log(image3);
      }
    });
  }

  uploadImage(num,e){
    this.updateImage(num,e);
    this.getImage(num,e);
  }

  getImage (num,e) {
    storage.child('uploadimage'+num).getDownloadURL()
    .then(url => this.googleRecognizeImage(num,e,url));
  }

  getAnalogy = () => {
    alert("getting analogy");
    let pos=this.state.wordsimage1[0].description;
    let neg=this.state.wordsimage2[0].description;
    socket.emit('calculateWord',{pos:pos,neg:neg});
    if(!init){
      socket.on("wordResult", data => {
        alert("Received data", data)
        this.setState({word:data})
        this.search(data)
      });
      init = true;
    }
  }

  render() {
    return (
      <div>
        {this.state.wordsimage1 && 
          this.state.wordsimage1.map(word => <p>{word.description}</p> ) 
        }
        <img style={{'max-width':'300px'}} src={this.state.uploadimage1}/>
        <input type="file" onChange={ this.uploadImage.bind(this, '1') }/>
        {this.state.wordsimage2 && 
          this.state.wordsimage2.map(word => <p>{word.description}</p> ) 
        }
        <img style={{'max-width':'300px'}} src={this.state.uploadimage2}/>
        <input type="file" onChange={ this.uploadImage.bind(this, '2') }/>
        <h2>{this.state.word}</h2>
        <img style={{'max-width':'300px'}} src={this.state.image3}/>
        <button onClick={this.getAnalogy}>Submit</button>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path='/text' component={ImageVersion}/>
        <Route path='/image' component={ImageVersion}/>
        <Route path='/' component={ImageVersion}/>
      </Switch>
    );
  }
}

export default App;
