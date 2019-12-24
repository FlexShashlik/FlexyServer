import { Entity } from "./Entity";

export function isSphereIntersectsBox(sphere: Entity, box: Entity) {
    const boxSize: number = 0.5;
    const sphereRadius: number = 0.5;

    // get box closest point to sphere center by clamping
    var x = Math.max(box.x - boxSize, Math.min(sphere.x, box.x + boxSize));
    var y = Math.max(box.y - boxSize, Math.min(sphere.y, box.y + boxSize));
    var z = Math.max(box.z - boxSize, Math.min(sphere.z, box.z + boxSize));

    var distance = Math.sqrt((x - sphere.x) * (x - sphere.x) +
                            (y - sphere.y) * (y - sphere.y) +
                            (z - sphere.z) * (z - sphere.z));
    
    return distance < sphereRadius;
}