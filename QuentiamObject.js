"use strict";

class QuentiamObject {
  constructor(server){
    this.id = ""; //String ID used when sending or receiving websocket messages
    this.params = {}; //Object of parameters to transmit to everyone in the scope

    this.server = server; //QuentiamServer instance that addObject was used on
    this.scope = []; //Array of QuentiamClient instances that will be transmitted to

    this.server.emitter.on("client_connect", (client) => this.clientConnect(client));
    this.server.emitter.on("client_message", (client, obj, data) => {
      if(obj === this){
        this.clientMessage(client, data);
      }
    });
    this.server.emitter.on("client_disconnect", (client) => this.clientDisconnect(client));
    this.server.emitter.on("client_flag_change", (client, key, val) => this.clientFlagChange(client, key, val));
  }

  clientConnect(client){}

  clientDisconnect(client){
    this.removeFromScope(client);
  }

  clientMessage(client, data){
    this.server.winston.log("debug", `Received message for "${this.id}" - ${JSON.stringify(data)}`);
  }

  clientFlagChange(client, key, val){}

  transmit(){
    this.server.winston.log("debug", `Transmitting "${this.id}" object with parameters ${JSON.stringify(this.params)}.`);

    for(let client of this.scope){
      client.sendMessage(this.id, this.params);
    }
  }

  addToScope(client){
    if(this.scope.indexOf(client) === -1){
      this.scope.push(client);
    }
  }

  removeFromScope(client){
    let clientI = this.scope.indexOf(client);

    if(clientI !== -1){
      this.scope.splice(clientI, 1);
    }
  }
}

module.exports = QuentiamObject;
