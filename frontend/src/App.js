import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');
let init = false;

class App extends Component {
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

export default App;
