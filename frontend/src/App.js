import React, { Component } from 'react';
import './App.css';
import openSocket from 'socket.io-client';
import { Route, Switch } from 'react-router'
import firebase from 'firebase'
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import 'semantic-ui-css/semantic.min.css';
//import injectTapEventPlugin from 'react-tap-event-plugin';
import { Grid } from 'semantic-ui-react'

const gridStyles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100%',
    height: '80vh',
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
      let file = e.target.files[0]
      if(!file)
        return
      const name = "uploadimage"+this.state.posCount;
      const metadata = {
         contentType: file.type
      };
      let { state } = this
      const task = storage.child(name).put(file, metadata);
        task.then((snapshot) => {
          const url = snapshot.downloadURL;
          console.log(url);
          state[type+'ImageUrl'].push(url)
          state[type+'Count']+=1;
          this.setState(state)
          this.describeImage(type, e);
        }).catch((error) => {
          console.error(error);
        });
    }


    describeImage = (type, e) => {
        let arrtype = this.state[type+'ImageUrl'];

        let req= {
        "requests": [
            {
              "image": {
                "source": {
                  "imageUri": arrtype[arrtype.length-1]
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
        .then(json =>{
            let arr = json['responses'][0]['labelAnnotations'];
            let { state } = this
            state[type+'ImageDesc'].push(arr)
            this.setState(state)
          })
        .catch(error => console.log(error));
    }


  search = (term) => {
    fetch('https://www.googleapis.com/customsearch/v1?key=AIzaSyCVNcHkdrsOsgzmpgCWtr_4tPcEo2-U2kk&cx=002590090237152809819:yqtwpa9qvr0&q='+term+'&searchType=image')
    .then(response => response.json())
    .then(myJson => {
      if(myJson.items){
        let image3 = myJson.items[0].link;
        this.setState({image3});
        console.log(image3);
      }
    });
  }

   getAnalogy = (e) => {
     alert("getting analogy");
     let pos = ''
     let neg = ''
     this.state.posImageDesc.forEach(desc =>
        pos+=desc[0].description + ' ' )
    this.state.negImageDesc.forEach(desc =>
        neg+=desc[0].description+ ' ' )
    pos=pos.trim()
    neg=neg.trim()
     alert(pos)
     alert(neg)
    socket.emit('calculateWord',{pos:pos,neg:neg});
    if(!init){
      socket.on("wordResult", data => {
        alert("Received data")
        data = data.split(" ")[0];
        this.setState({word:data})
        this.search(data)
      });
      init = true;
    }
  }

  render() {
    return (
    <Grid >
    <Grid.Row>
      <Grid.Column mobile={16} tablet={16} computer={5}>
        <GridList cellHeight={180} style={gridStyles.gridList}  >

        <Subheader>Positive</Subheader>
            { this.state.posImageDesc.map( (desc,index) =>
                <GridTile
                  key={desc[0].description+'pos'+index}
                  title={desc[0].description}
                  actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                >
                  <img style={{width:'300px'}} src={this.state.posImageUrl[index]} />
                </GridTile>
            )}
      </GridList>
      <input type="file" onChange={ this.updateFirebase.bind(this,'pos') }/>
      </Grid.Column>
      <Grid.Column mobile={16} tablet={16} computer={5}>
        <h2 >{this.state.word}</h2>
        <img style={{width:'300px'}} src={this.state.image3}/>
        <button onClick={this.getAnalogy.bind(this)}>Submit</button>
      </Grid.Column>
      <Grid.Column mobile={16} tablet={16} computer={5}>
          <GridList cellHeight={180} style={gridStyles.gridList}  >
          <Subheader>Negative</Subheader>
            { this.state.negImageDesc.map( (desc,index) =>
                <GridTile
                  key={desc[0].description+'neg'+index}
                  title={desc[0].description}
                  actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                >
                  <img style={{width:'300px'}} src={this.state.negImageUrl[index]} />
                </GridTile>
            )}
      </GridList>
      <input type="file" onChange={ this.updateFirebase.bind(this,'neg') }/>
      </Grid.Column>
    </Grid.Row>
  </Grid>
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
