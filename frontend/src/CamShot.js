import React, { Component } from 'react';
import Webcam from 'react-webcam';

export default class CamShot extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      capture: ""
    };
  }

  putImage = () => {
    fetch(this.state.capture)
    .then(res => res.blob())
    .then(blob => this.props.pushImage(blob));
  }

  capture = () => {
    const img = this.webcam.getScreenshot();
    this.setState({capture:img});
  }

  render() {
    return (
      <div>
        <Webcam audio={false} width = {480} height={360} 
          screenshotFormat="image/jpeg"
          ref={webcam => this.webcam = webcam}
        />
        <button onClick={this.capture}>Capture</button>
        {this.state.capture && <img id="cap" src={this.state.capture}/>}
        <button onClick={this.putImage}>Upload</button>
      </div>
    );
  }

}