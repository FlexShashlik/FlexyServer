import { Entity } from "./Entity";
import { type } from "@colyseus/schema";

export class User extends Entity{
    @type("uint32")
    stateNum: number = 0

    @type("number")
    health: number = 100;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super(x, y, z);
    }
}