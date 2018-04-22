import React, { Component } from 'react';
import lime from './sub-lime.png';
import './App.css';
import openSocket from 'socket.io-client';
import { Route, Switch } from 'react-router'
import firebase from 'firebase'
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

import RaisedButton from 'material-ui/RaisedButton';
import 'semantic-ui-css/semantic.min.css';
//import injectTapEventPlugin from 'react-tap-event-plugin';
import { Grid,Container,Responsive,Segment,Button,Header } from 'semantic-ui-react'

const gridStyles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100%',
    minHeight: '50vh',
    overflowY: 'auto',
  },
};

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
      posImageDesc:[],
      posImageUrl:[],
      posCount:0,
      negImageDesc:[],
      negImageUrl:[],
      negCount:0,
      image3:''
    }
  }

  updateFirebase = (type, e) => {
    let file = e.target.files[0];
    if(!file) return;
    const name = "uploadimage"+this.state.posCount;
    const metadata = {
       contentType: file.type
    };
    let { state } = this;
    try {
      const task = storage.child(name).put(file, metadata);
      task.then((snapshot) => {
        const url = snapshot.downloadURL;
        console.log(url);
        state[type+'ImageUrl'].push(url)
        state[type+'Count']+=1;
        this.setState(state);
        this.describeImage(type, e);
      }).catch((error) => {
        console.error(error);
      });
    }
    catch(e){
      console.log("Found upload error");
    }
  }


  describeImage = (type, e) => {
    let arrtype = this.state[type+'ImageUrl'];

    let req= {
      "requests": [{
        "image": {
          "source": {
            "imageUri": arrtype[arrtype.length-1]
          }
        },
        "features": [{
          "type": "LABEL_DETECTION",
           "maxResults": 4
        }]
      }]
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
        state[type+'ImageDesc'].push(arr);
        this.setState(state)
      })
    .catch(error => console.log(error));
  }


  search = (term) => {
    fetch('https://www.googleapis.com/customsearch/v1?key=AIzaSyCVNcHkdrsOsgzmpgCWtr_4tPcEo2-U2kk&cx=002590090237152809819:yqtwpa9qvr0&q='+term+'&searchType=image')
    .then(response => response.json())
    .then(myJson => {
      if(myJson.items) {
        let image3 = myJson.items[0].link;
        this.setState({image3});
        console.log(image3);
      }
    });
  }


  getAnalogy = (e) => {
    let pos = '';
    let neg = '';
    this.state.posImageDesc.forEach(desc => pos+=desc[0].description+' ');
    this.state.negImageDesc.forEach(desc => neg+=desc[0].description+' ');
    pos=pos.trim();
    neg=neg.trim();
    socket.emit('calculateWord',{pos:pos,neg:neg});
    if(!init){
      socket.on("wordResult", data => {
        data = data.split(" ")[0];
        this.setState({word:data});
        this.search(data);
      });
      init = true;
    }
  }

  render() {
    let imgStyle={
      width: '100%'
    }
    return (
      <Container style={{'marginTop':'3vh'}}>
        <Responsive minWidth={700}>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                  <Subheader style={{fontSize : '5em', textAlign:"center"}}>Sublimg</Subheader>
                  <Subheader style={{'marginTop':'3vh', fontSize : '2em', textAlign:"center"}}>Sublime subliminal image subtraction with some zesty citrusy lime ;)</Subheader>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>

              <Grid.Column width={4} style={{'marginTop':'3vh'}}>
                <Segment piled>
                  <GridList cols={1} cellHeight={180} style={gridStyles.gridList}>
                    {this.state.posImageDesc &&
                      this.state.posImageDesc.map( (desc,index) =>
                      <GridTile
                        key={desc[0].description+'pos'+index}
                        title={desc[0].description}
                        actionIcon={<IconButton><StarBorder color="white" /></IconButton>}>
                        <img src={this.state.posImageUrl[index]} />
                      </GridTile>
                    )}
                  </GridList>
                </Segment>
              </Grid.Column>

              <Grid.Column width={2} textAlign="center" style={{"margin":"auto", "display":"flex", "alignItems":"center"}}>
                <button style={{"background":"none","border":"none"}} onClick={this.getAnalogy.bind(this)}>
                  <img src={lime} class="lime" />
                  <Subheader class="sub" style={{fontSize : '6em'}}>-</Subheader>
                </button>
              </Grid.Column>

              <Grid.Column width={4}  style={{'marginTop':'3vh'}}>
                <Segment piled>
                  <GridList cols={1} cellHeight={180} style={gridStyles.gridList}>
                    {this.state.negImageDesc &&
                      this.state.negImageDesc.map( (desc,index) =>
                      <GridTile
                        key={desc[0].description+'neg'+index}
                        title={desc[0].description}
                        actionIcon={<IconButton><StarBorder color="white" /></IconButton>} >
                        <img src={this.state.negImageUrl[index]} />
                      </GridTile>
                    )}
                  </GridList>
                </Segment>
              </Grid.Column>

              <Grid.Column width={2} textAlign="center" style={{"margin":"auto", "display":"flex", "alignItems":"center"}}>
                <div>
                  <Subheader style={{fontSize : '4em', textAlign : 'center'}}>=</Subheader>
                </div>
              </Grid.Column>

              <Grid.Column width={4} textAlign="center" style={{"margin":"auto", "display":"flex", "alignItems":"center"}}>
                <div>
                  <Subheader style={{fontSize : '4em', textAlign : 'center'}}>{this.state.word ? this.state.word : "?"}</Subheader>
                  <img style={imgStyle} src={this.state.image3}/>
                </div>
              </Grid.Column>

            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={4} style={{'marginTop':'3vh'}}>
                <RaisedButton primary={true}  fullWidth={true} >
                  <label class = "uploadbutton" >
                    <input type="file" accept="image/*" onChange={ this.updateFirebase.bind(this,'pos') }/>
                    Add Photo
                  </label>
                </RaisedButton>
              </Grid.Column>

              <Grid.Column width={2} />

              <Grid.Column width={4} style={{'marginTop':'3vh'}}>
                <RaisedButton primary={true}  fullWidth={true} >
                  <label class = "uploadbutton" >
                    <input type="file" accept="image/*" onChange={ this.updateFirebase.bind(this,'neg') }/>
                    Add Photo
                  </label>
                </RaisedButton>
              </Grid.Column>
              
              <Grid.Column width={2} />

              <Grid.Column width={4} style={{'marginTop':'3vh'}}>
              </Grid.Column>

            </Grid.Row>
          </Grid>
        </Responsive>

        <Responsive as={Segment} maxWidth={699} >
          <Grid>
            <Grid.Row>
              <Subheader style={{fontSize : '4em', textAlign : 'center'}}>{this.state.word}</Subheader>
              <img style={imgStyle}  src={this.state.image3}/>
              <RaisedButton label="Submit" fullWidth={true} secondary={true} onClick={this.getAnalogy.bind(this)}/>
            </Grid.Row>
            <Grid.Row>
              <GridList cols={1} cellHeight={180} style={gridStyles.gridList}  >
                <Subheader style={{fontSize : '4em', textAlign : 'center'}}>Positive</Subheader>
                {this.state.posImageDesc &&
                  this.state.posImageDesc.map( (desc,index) =>
                  <GridTile
                    key={desc[0].description+'pos'+index}
                    title={desc[0].description}
                    actionIcon={<IconButton><StarBorder color="white" /></IconButton>}>
                    <img src={this.state.posImageUrl[index]} />
                  </GridTile>
                )}
              </GridList>
            </Grid.Row>
            <Grid.Row>
              <GridList cols={1} cellHeight={180} style={gridStyles.gridList}  >
                <Subheader style={{fontSize : '4em', textAlign : 'center'}}>Negative</Subheader>
                {this.state.negImageDesc &&
                  this.state.negImageDesc.map( (desc,index) =>
                  <GridTile
                    key={desc[0].description+'neg'+index}
                    title={desc[0].description}
                    actionIcon={<IconButton><StarBorder color="white" /></IconButton>} >
                    <img src={this.state.negImageUrl[index]} />
                  </GridTile>
                )}
              </GridList>
              <RaisedButton primary={true} fullWidth={true}><input type="file" accept="image/*" onChange={ this.updateFirebase.bind(this,'neg') }/></RaisedButton>
            </Grid.Row>
          </Grid>
        </Responsive>
      </Container>
    );
  }
}

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path='/image' component={ImageVersion}/>
        <Route path='/' component={ImageVersion}/>
      </Switch>
    );
  }
}

export default App;
