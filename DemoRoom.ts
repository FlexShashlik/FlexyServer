import { Room, Client, generateId } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { verifyToken, User, IUser } from "@colyseus/social";

class Entity extends Schema {
  @type("uint32")
  stateNum: number = 0
  
  @type("number")
  x: number = 0;

  @type("number")
  y: number = 0;

  @type("number")
  z: number = 0;
}

class State extends Schema {
  @type({ map: Entity })
  entities = new MapSchema<Entity>();
}

/**
 * Demonstrate sending schema data types as messages
 */
class Message extends Schema {
  @type("uint32") stateNum;
  @type("number") x;
  @type("number") y;
  @type("number") z;
  @type("string") msg;
}

export class DemoRoom extends Room {

  onCreate (options: any) {
    console.log("DemoRoom created!", options);

    this.setState(new State());

    this.setMetadata({
      str: "hello",
      number: 10
    });

    this.setPatchRate(1000 / 30);
    this.setSimulationInterval((dt) => this.update(dt));
  }

  async onAuth (client, options) {
    console.log("onAuth(), options!", options);
    return await User.findById(verifyToken(options.token)._id);
  }

  onJoin (client: Client, options: any, user: IUser) {
    console.log("client joined!", client.sessionId);
    this.state.entities[client.sessionId] = new Entity();
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

  onMessage (client: Client, data: Message) {
    console.log(data, "received from", client.sessionId);
    console.log(this.state.entities[client.sessionId].x, "wtf");

    this.state.entities[client.sessionId].x = data.x;
    this.state.entities[client.sessionId].y = data.y;
    this.state.entities[client.sessionId].z = data.z;

    const message = data;
    message.msg = "Approved";
    this.send(client, message);

    console.log("x: %s y: %s z: %s", 
                this.state.entities[client.sessionId].x,
                this.state.entities[client.sessionId].y, 
                this.state.entities[client.sessionId].z);

    //this.broadcast({ hello: "hello world" });
  }

  update (dt?: number) {
    // console.log("num clients:", Object.keys(this.clients).length);
  }

  onDispose () {
    console.log("disposing DemoRoom...");
  }

}