'use strict'

import kosmos_query from "./nvidia_api.js";

import express from "express";
//import cors from "cors";
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 10000;

const DEBUGGING_LOCAL = 0;

// CORS related
var cors_origin = "https://nvidia-contest-react-app.onrender.com";

if (DEBUGGING_LOCAL == 1)
  cors_origin = "http://localhost:3000"

var corsOptions = {
  origin: cors_origin,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// create an error with .status. we
// can then use the property in our
// custom error handler (Connect respects this prop as well)

function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

app.use(function (req, res, next) {
  // console.log('Time: %d', Date.now())
  res.append('Access-Control-Allow-Origin', cors_origin)
  res.append('Access-Control-Allow-Headers', 'Content-Type')

  next()
})

var rawBodyParser = bodyParser.raw({type: "image/jpeg"})

// example: http://localhost:3000/api/users/?api-key=foo
app.post('/user/message',
    rawBodyParser,
    //cors(corsOptions),
    async function (req, res) {
      var query = req.query['query'];

      var response = "Failed to answer";
      try {
        response = await kosmos_query(query, req.body);
      } catch (e) {
        response = "Failed to answer. " + e.name + ": " + e.message;
      }

      console.log(response);
      res.send(response);
    }
);

app.listen(port);
console.log(`Nvidia contest web services app started on port ${port}`);
