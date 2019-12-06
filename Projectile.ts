import { Entity } from "./Entity";
import { type } from "@colyseus/schema";

export class Projectile extends Entity {
    @type("number")
    angle: number = 0;

    ownerSessionId: string = "";

    constructor(x: number, y: number, z: number, angle: number, sessionId: string) {
        super(x, y, z);

        this.angle = angle;
        this.ownerSessionId = sessionId;
    }
}