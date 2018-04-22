import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';
import { Route,Switch } from 'react-router'
const socket = openSocket('http://localhost:3000');
let init = false;
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


class ImageVersion extends Component {
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
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Calculator</h1>
        </header>
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



class App extends Component {
  render() {
    return (

    <Switch>
      <Route path='/text' component={TextVersion}/>
      <Route path='/image' component={ImageVersion}/>
      <Route path='/' component={TextVersion}/>
    </Switch>

    );
  }
}


export default App;
