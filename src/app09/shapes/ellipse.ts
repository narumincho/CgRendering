import * as THREE from "three";
import { BaseShape } from "./baseshape";
import { PointLight } from "../pointlight";

export class Ellipse implements BaseShape {
  private mpositioin: THREE.Vector3;
  get position(): THREE.Vector3 {
    return this.mpositioin;
  }

  private msize: THREE.Vector3;
  get size(): THREE.Vector3 {
    return this.msize;
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

  constructor(
    position: THREE.Vector3,
    size: THREE.Vector3,
    color: THREE.Color,
    ka: number,
    kd: number,
    ks: number,
    n: number
  ) {
    this.mpositioin = new THREE.Vector3();
    this.mpositioin.copy(position);
    this.msize = new THREE.Vector3();
    this.msize.copy(size);
    this.mcolor = new THREE.Color();
    this.mcolor.copy(color);
    this.mka = ka;
    this.mkd = kd;
    this.mks = ks;
    this.mn = n;
  }

  calcT(e: THREE.Vector3, v: THREE.Vector3): number {
    const k = 1;
    const r0d = new THREE.Vector3();
    r0d.subVectors(e, this.position);
    const m = new THREE.Matrix4();
    m.scale(
      new THREE.Vector3(
        1 / this.msize.x ** 2,
        1 / this.msize.y ** 2,
        1 / this.msize.z ** 2
      )
    );
    const alpha = v.dot(v.clone().applyMatrix4(m));
    const beta = v.dot(r0d.clone().applyMatrix4(m));
    const gamma = r0d.dot(r0d.clone().applyMatrix4(m)) - k;
    const d = beta * beta - alpha * gamma;
    if (d < 0) {
      return -2;
    }
    return (-beta - Math.sqrt(d)) / alpha;
  }

  calcNorm(p: THREE.Vector3): THREE.Vector3 {
    const mscale = new THREE.Matrix4().scale(
      new THREE.Vector3(
        1 / (this.size.x * this.size.x),
        1 / (this.size.y * this.size.y),
        1 / (this.size.z * this.size.z)
      )
    );
    const postop = p;
    postop.sub(this.position);
    return postop.applyMatrix4(mscale).normalize();
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
