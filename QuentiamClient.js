"use strict";

class QuentiamClient {
  constructor(server, connection){
    this.server = server;
    this.connection = connection;
    this.flags = {};

    server.winston.log("debug", "QuentiamClient instantiated");
    server.emitter.emit("client_connect", this);

    connection.on("text", (str) => {
      try{
        let data = JSON.parse(str);

        for(let quentiamObj of server.objects){
          if(quentiamObj.id === data.id){
            server.emitter.emit("client_message", this, quentiamObj, data);
            break;
          }
        }
      }catch(e){}
    });

    connection.on("close", () => {
      this.server.emitter.emit("client_disconnect", this);

      this.server.winston.log("debug", "QuentiamClient disconnected");
    });
  }

  sendMessage(id, params){
    this.server.winston.log("debug", `Sent client message with id "${id}": ${JSON.stringify(params)}`);

    let clone = JSON.parse(JSON.stringify(params)); //clone the object
    clone.id = id;

    this.connection.send(JSON.stringify(clone));
  }

  setFlag(key, val){
    this.flags[key] = val;

    this.server.winston.log("debug", `Client changed flag (set ${key} to ${val})`);
    this.server.emitter.emit("client_flag_change", this, key, val);
  }
}

module.exports = QuentiamClient;
