import * as THREE from "three";

export type ShootRay = {
  (e: THREE.Vector3, v: THREE.Vector3, currentDepth: number): THREE.Color;
};
