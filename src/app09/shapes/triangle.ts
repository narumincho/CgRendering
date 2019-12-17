import * as THREE from "three";
import { BaseShape } from "./baseshape";
import { PointLight } from "../pointlight";

export class Triangle implements BaseShape {
  private mverticies: Array<THREE.Vector3>;
  get verticies(): Array<THREE.Vector3> {
    return this.mverticies;
  }

  private mcolor: THREE.Color;
  get color(): THREE.Color {
    return this.mcolor;
  }

  private mka: number;
  get ka(): number {
    return this.mka;
  }

  private mkd: number;
  get kd(): number {
    return this.mkd;
  }

  private mks: number;
  get ks(): number {
    return this.mks;
  }

  private mn: number;
  get n(): number {
    return this.mn;
  }

  private mnormal: THREE.Vector3;
  get normal(): THREE.Vector3 {
    return this.mnormal;
  }

  constructor(
    p0: THREE.Vector3,
    p1: THREE.Vector3,
    p2: THREE.Vector3,
    color: THREE.Color,
    ia: number,
    id: number,
    is: number,
    n: number
  ) {
    this.mverticies = [];
    this.mverticies[0] = new THREE.Vector3().copy(p0);
    this.mverticies[1] = new THREE.Vector3().copy(p1);
    this.mverticies[2] = new THREE.Vector3().copy(p2);
    this.mcolor = new THREE.Color();
    this.mcolor.copy(color);
    this.mka = ia;
    this.mkd = id;
    this.mks = is;
    this.mn = n;

    //法線を計算，時計回りを表面とする
    const v1 = new THREE.Vector3().subVectors(
      this.verticies[2],
      this.verticies[0]
    );
    const v2 = new THREE.Vector3().subVectors(
      this.verticies[1],
      this.verticies[0]
    );
    this.mnormal = new THREE.Vector3().crossVectors(v1, v2).normalize();
  }

  private det(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): number {
    return (
      a.x * b.y * c.z +
      a.y * b.z * c.x +
      a.z * b.x * c.y -
      a.x * b.z * c.y -
      a.y * b.x * c.z -
      a.z * b.y * c.x
    );
  }

  calcT(e: THREE.Vector3, v: THREE.Vector3): number {
    const tParent = v.dot(this.normal);
    if (Math.abs(tParent) < 0.000001) {
      return -1;
    }
    const tChild = this.normal.dot(this.verticies[0].clone().sub(e));
    const t = tChild / tParent;
    const v0 = this.mverticies[0];
    const v1 = this.mverticies[1];
    const v2 = this.mverticies[2];

    const e0 = v1.clone().sub(v0);
    const e1 = v2.clone().sub(v1);
    const e2 = v0.clone().sub(v2);
    const i: THREE.Vector3 = e.clone().add(v.clone().multiplyScalar(t));
    const iv0 = i.clone().sub(v0);
    const iv1 = i.clone().sub(v1);
    const iv2 = i.clone().sub(v2);
    const cross0 = iv0.clone().cross(e0);
    const cross1 = iv1.clone().cross(e1);
    const cross2 = iv2.clone().cross(e2);
    if (
      0 < cross0.dot(this.normal) &&
      0 < cross1.dot(this.normal) &&
      0 < cross2.dot(this.normal)
    ) {
      return t;
    }
    return -1;
  }

  private average(array: Array<THREE.Vector3>): THREE.Vector3 {
    const sum = new THREE.Vector3(0, 0, 0);
    for (const vector of array) {
      sum.add(vector);
    }
    return sum.divideScalar(array.length);
  }

  calcNorm(p: THREE.Vector3): THREE.Vector3 {
    return this.normal.clone();
  }

  calcShading(q: PointLight, p: THREE.Vector3, e: THREE.Vector3): THREE.Color {
    const ambientLight = this.ka;
    const r = q.position.distanceTo(p);
    const N: THREE.Vector3 = this.calcNorm(p);
    const L: THREE.Vector3 = q.position
      .clone()
      .sub(p)
      .normalize();

    const diffuseReflection = ((this.kd * q.ii) / r ** 2) * N.dot(L);

    const R: THREE.Vector3 = N.clone()
      .multiplyScalar(2 * N.dot(L))
      .sub(L);

    const V: THREE.Vector3 = e
      .clone()
      .sub(p)
      .normalize();

    const specularReflection = ((this.ks * q.ii) / r ** 2) * R.dot(V) ** this.n;
    if (0 < N.dot(L)) {
      return this.color
        .clone()
        .multiplyScalar(ambientLight + diffuseReflection)
        .add(new THREE.Color(255, 255, 255).multiplyScalar(specularReflection));
    }
    return this.color.clone().multiplyScalar(ambientLight);
  }
}
