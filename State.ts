import { Schema, type, MapSchema } from "@colyseus/schema";
import { Entity } from "./Entity";
import { User } from "./User";
import { Projectile } from "./Projectile";
import { generateId } from "colyseus";

export class State extends Schema {
    @type({ map: Entity })
    entities = new MapSchema<Entity>();

    createUser(sessionId: string) {
        this.entities[sessionId] = new User();
    }

    createProjectile(data: Projectile, sessionId: string) {
        this.entities[generateId()] = new Projectile(
            data.x, data.y, data.z, data.angle,
            sessionId
        );
    }

    update() {

    }
}