import { Entity } from "./Entity";
import { type } from "@colyseus/schema";

export class User extends Entity{    
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super(x, y, z);
    }
}