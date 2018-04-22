import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';
import { Route,Switch } from 'react-router'
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
//const socket = openSocket('http://localhost:3000');
let init = false;



class ImageVersion extends Component {
    constructor(props) {
      super(props);
      this.state = {
        word: "",
        uploadimage1:'',
        uploadimage2:''
        }
    }

    updateImage(num,e) {
      let file = e.target.files[0]
      const name = "uploadimage"+num;
      this.setState({file:file})

      const metadata = {
         contentType: file.type
      };
      let { state } = this
      const task = storage.child(name).put(file, metadata);
        task.then((snapshot) => {
          const url = snapshot.downloadURL;
          console.log(url);
          state[name] = url
          this.setState(state)
        }).catch((error) => {
          console.error(error);
        });
    }

    getImage (image) {
        let { state } = this
        storage.child(`${image}.png`).getDownloadURL().then((url) => {
          state[image] = url
          this.setState(state)
        }).catch((error) => {
          // Handle any errors
        })
    }

  render() {
    return (
      <div >
       <img src={this.state.uploadimage1}/>
      <input type="file" onChange={ this.updateImage.bind(this, '1') }/>
       <img src={this.state.uploadimage2}/>
      <input type="file" onChange={ this.updateImage.bind(this, '2') }/>
        <h2 >{this.state.word}</h2>
        <h2 >HERE</h2>
      </div>
    );
  }
}
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
