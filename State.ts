import { Schema, type, MapSchema } from "@colyseus/schema";
import { Entity } from "./Entity";
import { User } from "./User";
import { Projectile } from "./Projectile";
import { generateId } from "colyseus";
import { isSphereIntersectsBox } from "./FlexyMath";

export class State extends Schema {
    @type({ map: Entity })
    entities = new MapSchema<Entity>();

    createUser(sessionId: string) {
        this.entities[sessionId] = new User();
    }

    createProjectile(data: Projectile, sessionId: string) {
        this.entities[generateId()] = new Projectile (
            data.x, data.y, data.z, data.angle,
            sessionId
        );
    }

    update(deltaTime) {
        const WORLD_SIZE: number = 15;

        for (const sessionId in this.entities) {
            const entity = this.entities[sessionId];
            
            if(entity instanceof Projectile) {
                const dP: number = 5;
                
                entity.x += Math.cos(entity.angle) * dP * deltaTime / 1000;
                entity.z += Math.sin(entity.angle) * dP * deltaTime / 1000;

                for(const hitId in this.entities) {
                    const hitEntity = this.entities[hitId];

                    if(hitId != entity.ownerSessionId && hitEntity instanceof User && hitEntity.health > 0) {
                        if(isSphereIntersectsBox(entity, hitEntity)) {
                            // Collision detection processing
                            console.log(sessionId, "hit", hitId);

                            hitEntity.health -= 20;
                            if(hitEntity.health > 0) {
                                console.log(hitId, "died");
                            }

                            // Destroy projectile
                            delete this.entities[sessionId];
                        }
                    }
                }
            
                if (entity.x >= WORLD_SIZE  ||
                    entity.x <= -WORLD_SIZE ||
                    entity.z >= WORLD_SIZE  ||
                    entity.z <= -WORLD_SIZE) {
                    delete this.entities[sessionId];
                }
            }
        }
    }
}