"use strict";

const QuentiamServer = require("../../QuentiamServer.js");
let server = new QuentiamServer();

server.addObject(require("./PingObject.js"));

server.start(7777);
