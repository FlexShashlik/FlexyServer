import { Room, Client } from "colyseus";
import { Schema, type } from "@colyseus/schema";
import { State } from "./State";

class MovementMessage extends Schema {
  @type("uint32") stateNum;
  @type("number") x;
  @type("number") y;
  @type("number") z;
  @type("string") msg;
}

export class DemoRoom extends Room<State> {

  onCreate () {
    console.log("DemoRoom created!");

    this.setState(new State());
    this.setSimulationInterval((dt) => this.state.update());
    this.setPatchRate(1000 / 30);
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.createUser(client.sessionId);
  }

  onMessage (client: Client, message: any) {
    const entity = this.state.entities[client.sessionId];

    // skip dead players
    if (!entity) {
      console.log("DEAD PLAYER ACTING...");
      return;
    }

    switch(message.command){
      case "movement":
          console.log(message.command, message.data, "received from", client.sessionId);
    
          this.state.entities[client.sessionId].x = message.data.x;
          this.state.entities[client.sessionId].y = message.data.y;
          this.state.entities[client.sessionId].z = message.data.z;
      
          const movementMessage: MovementMessage = message.data;
          movementMessage.msg = "Approved";
          this.send(client, [message.command, movementMessage]);
      
          console.log("x: %s y: %s z: %s", 
                      this.state.entities[client.sessionId].x,
                      this.state.entities[client.sessionId].y, 
                      this.state.entities[client.sessionId].z);

        break;
    }
  }

  async onLeave (client: Client, consented: boolean) {
    this.state.entities[client.sessionId].connected = false;

    try {
      if (consented) {
        throw new Error("consented leave!");
      }

      console.log("let's wait for reconnection!")
      const newClient = await this.allowReconnection(client, 10);
      console.log("reconnected!", newClient.sessionId);

    } catch (e) {
      console.log("disconnected!", client.sessionId);
      delete this.state.entities[client.sessionId];
    }
  }

  onDispose () {
    console.log("disposing DemoRoom...");
  }

}