import React, { Component } from 'react';
import './App.css';
import { Route,Switch } from 'react-router';
import firebase from 'firebase';


const config = {
    apiKey: "AIzaSyBBdY1PTGPFSivd0qO6Eh_sZwoiBXTq9eE",
    authDomain: "myawesomeproject-74d03.firebaseapp.com",
    databaseURL: "https://myawesomeproject-74d03.firebaseio.com",
    projectId: "myawesomeproject-74d03",
    storageBucket: "myawesomeproject-74d03.appspot.com",
    messagingSenderId: "727493500579"
};
firebase.initializeApp(config);
const storage = firebase.storage().ref();

class ImageVersion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
      uploadimage1:'',
      wordsimage1:[],
      uploadimage2:'',
      wordsimage2:[]
    };
  }

  updateImage(num,e) {
    let file = e.target.files[0];
    const name = "uploadimage"+num;
    this.setState({file:file});

    const metadata = {
       contentType: file.type
    };
    const task = storage.child(name).put(file, metadata);
    task.then((snapshot) => {
      const name = snapshot.downloadURL;
      this.setState({name});
      this.getImage(num, e);
    }).catch((error) => {
      console.error(error);
    });
  }

  googleRecognizeImage(num,e,url){
    let req = {
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
               "maxResults": 4
            }
          ]
        }
      ]
    };
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
      let { state } = this
      state['wordsimage'+num] = arr
      this.setState(state)
    })
    .catch(error => console.log(error));
  }

  getImage (num,e) {
    storage.child('uploadimage'+num).getDownloadURL()
    .then(url => {
      let {state} = this;
      state['uploadimage'+num] = url;
      this.setState(state);
      this.googleRecognizeImage(num,e,url);
    })
  }

  render() {
    return (
      <div>
        {this.state.wordsimage1.map(word => { return ( <p > {word.description}  </p> );}) }

        <img src={this.state.uploadimage1}/>
        <input type="file" onChange={ this.updateImage.bind(this, '1') }/>

        {this.state.wordsimage2.map(word => { return ( <p > {word.description}  </p> );}) }
        <img src={this.state.uploadimage2}/>
        <input type="file" onChange={ this.updateImage.bind(this, '2') }/>
        <h2>{this.state.word}</h2>
        <button onClick={this.googleRecognizeImage.bind(this, '1')} >Submit</button>
      </div>
    );
  }
}

//custom search :
// AIzaSyCVNcHkdrsOsgzmpgCWtr_4tPcEo2-U2kk
/*

class TextVersion extends Component {
    constructor(props) {
      super(props);
      this.state = {
        word: ""
      };
    }
    getAnalogy(){
        let myself=this;
        alert("getting analogy");
        let pos=document.getElementById('pos').value;
        let neg=document.getElementById('neg').value;
        socket.emit('calculateWord',{pos:pos,neg:neg});
        if(!init){
            socket.on("wordResult", function (data){
                myself.setState({word:data})
            });
            init = true;
        }
    }

  render() {
    return (
      <div >
        <h2 >{this.state.word}</h2>
    <form action="#" onSubmit={this.getAnalogy.bind(this)}>
      Pos: <input type="text" id="pos" defaultValue="cat dog" /><br/>
      Neg: <input type="text" id="neg" defaultValue="prince" /><br/>
      <input type="submit" value="Submit"/>
    </form>
      </div>
    );
  }
}

*/

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
