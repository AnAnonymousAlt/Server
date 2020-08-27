// Modules
const debug = require("debug");
const ds = debug("server");
const express = require('express');
const app = express();
const path = require("path");

// Global variable
const port = 3000;

// Rules
app.get('/', function (req,res) 
  {
    ds(req.hostname);
    // res.send("Hello World!")
    res.sendFile(__dirname + "/PersonalWebsite/doc/" + "index.html");
  });

//app.get('*.css', function ( req, res ) 
//  {
//    ds(req.path);
//    res.sendFile ( __dirname + "/PersonalWebsite/style/" + "style.css" );
//  });

app.get('*', function ( req, res )
  {
    ds(req.path);
    res.sendFile ( __dirname + "/PersonalWebsite" + req.path );
  });

// start
app.listen(port, () => {
  ds(`Example app listening at http://localhsot:${port}`);
});
