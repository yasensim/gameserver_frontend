
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
var cors = require('cors')



const app = express();
const port = process.env.PORT || 3002;

app.use(cors())
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


function getScript(url){
  var obj = process.env.GAMES_SERVER_URL ? process.env.GAMES_SERVER_URL : "ws.yasensim.net:80"
  var cards = process.env.CARDS ? process.env.CARDS : 15
return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
  <link
rel="stylesheet"
href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta
    name="description"
    content="Pockemon memory game test"
  />
  <title>React App</title>
<link rel="shortcut icon" href="/public/favicon.ico"><link rel="shortcut icon" href="/favicon.ico"><link rel="shortcut icon" href="/favicon.ico"></head>
<body >
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>

  <script type="text/javascript">window.GameServerUrl="${obj}";window.cards=${cards}</script>
  <script type="text/javascript" src="/public/bundle.js"></script></script>
</body>
</html>
`
}
app.get('/game',(req, res) => {
  var obj = JSON.parse(fs.readFileSync(path.join(__dirname, '/src/tools/db.json'), 'utf8'));
  res.json(obj)
})

app.get('/',(req, res) => {
 
  res.writeHead(200, {
    'Content-Type': 'text/html'
});
  res.write(getScript())
  res.end()
})

app.get('/gamepage/:id',(req, res) => {
 
  res.writeHead(200, {
    'Content-Type': 'text/html'
});
  res.write(getScript())
  res.end()
})

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));




app.get('/gameserverurl',(req, res) => {
  var obj = process.env.GAMES_SERVER_URL ? process.env.GAMES_SERVER_URL : "ws.yasensim.net:80"
  res.json({gameserverurl:obj})
})

app.listen(port, "0.0.0.0", () => {
  console.log(__dirname)
  console.log(`JSON Server is running on port ${port}`);
});
