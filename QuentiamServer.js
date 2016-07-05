"use strict";

const websocket = require("nodejs-websocket");
const EventEmitter = require("events").EventEmitter;
const QuentiamClient = require("./QuentiamClient.js");

class QuentiamServer {
  constructor(logger_level="debug"){
    this.emitter = new EventEmitter();
    this.winston = require("winston");
    this.clients = [];
    this.objects = [];

    this.winston.level = logger_level;

    this.winston.log("debug", "Created Quentiam server object");
  }

  start(port){
    this.winston.info("Started Quentiam server");

    this.wsServer = websocket.createServer((conn) => {
      let client = new QuentiamClient(this, conn);

      this.clients.push(client);
    }).listen(port);
  }

  addObject(object){
    const obj = new object(this);

    this.objects.push(obj);
    this.winston.log("debug", `Added object "${obj.id}"`);

    return obj;
  }
}

module.exports = QuentiamServer;
