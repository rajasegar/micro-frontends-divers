const express = require('express');
const dotenv = require('dotenv');
const result = dotenv.config();
const Podlet = require('@podium/podlet');
const fs = require('fs');

const app = express();

const podlet = new Podlet({
    name: 'reactNavPodlet', // required
    version: '0.1.0', // required
    pathname: '/', // required
    manifest: '/manifest.json', // optional, defaults to '/manifest.json'
    development: true, // optional, defaults to false
  });

let rawdata = fs.readFileSync('build/asset-manifest.json');
let assets = JSON.parse(rawdata);

// podlet.js({ value: 'https://unpkg.com/react@16/umd/react.production.min.js', crossorigin:'', type:'application/javascript' });
// podlet.js({ value: 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js', crossorigin:'', type:'application/javascript' });

assets.entrypoints.forEach((element, index) => {
  if(element.indexOf('.css') !== -1){
    let elementFinal = element.replace('static/', '');
    podlet.css({ value: process.env.PUBLIC_URL + ':' + process.env.PORT + '/' + elementFinal });
    
  }else if(element.indexOf('.js') !== -1) {
    let elementFinal = element.replace('static/', '');
    podlet.js({ value: process.env.PUBLIC_URL + ':' + process.env.PORT + '/' + elementFinal });
  }
});

app.use(podlet.middleware());

app.use(express.static('build/static'))

app.get(podlet.content(), (req, res) => {
  res.status(200).podiumSend('<div id="reactnavpod"></div>');
});

app.get(podlet.manifest(), (req, res) => {
  res.status(200).send(podlet);
});


app.listen(process.env.PORT);