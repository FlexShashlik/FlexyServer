import { Schema, type, MapSchema } from "@colyseus/schema";
import { Entity } from "./Entity";
import { User } from "./User";

export class State extends Schema {
    @type({ map: Entity })
    entities = new MapSchema<Entity>();

    createUser(sessionId: string) {
        this.entities[sessionId] = new User();
    }

    update() {

    }
}