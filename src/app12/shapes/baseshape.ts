import * as THREE from "three";
import { PointLight } from "../pointlight";
import { ShootRay } from "../../@types/ShootRay";

export interface BaseShape {
    calcT(e: THREE.Vector3, v: THREE.Vector3): number;
    calcNorm(p: THREE.Vector3): THREE.Vector3;
    calcShading(q: PointLight, p: THREE.Vector3, e: THREE.Vector3,
        v: THREE.Vector3, shootRay: ShootRay, currentDepth: number): THREE.Color;
}
