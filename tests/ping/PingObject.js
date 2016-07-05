"use strict";

const QuentiamObject = require("../../QuentiamObject.js");

class PingObject extends QuentiamObject{
  constructor(server){
    super(server);

    this.id = "ping";
    this.params = {
      message: "Pong!"
    };
  }

  clientMessage(client, data){
    super.clientMessage(client, data);

    this.addToScope(client);
    this.transmit();
  }
}

module.exports = PingObject;
