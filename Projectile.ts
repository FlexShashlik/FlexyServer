import { Entity } from "./Entity";

export class Projectile extends Entity {
    ownerSessionId: string = "";

    constructor(x: number, y: number, z: number, sessionId: string) {
        super(x, y, z);
        this.ownerSessionId = sessionId;
    }
}