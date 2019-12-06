import { Schema, type } from "@colyseus/schema"

export class Entity extends Schema {
    @type("number")
    x: number = 0;
  
    @type("number")
    y: number = 0;
  
    @type("number")
    z: number = 0;

    dX: number = 0;
    dY: number = 0;
    dZ: number = 0;
    dead: boolean = false;

    constructor(x: number, y: number, z: number) {
        super();

        this.x = x;
        this.y = y;
        this.z = z;
    }
}