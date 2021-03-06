import * as THREE from "three";
import { PointLight } from "./pointlight";
import { BaseShape } from "./shapes/baseshape";
import { Ellipse } from "./shapes/ellipse";
import { Triangle } from "./shapes/triangle";
import { ShootRay } from "./@types/ShootRay";

import rtScene from "./scenes/scene4";
import { Font } from "three";

export class RaytraceManager {
  private bgColor: THREE.Color;
  private pointLight: PointLight;
  private shapes: Array<BaseShape>;

  public static readonly MAX_DEPTH = 5;

  constructor() {
    const s = rtScene;

    this.bgColor = new THREE.Color(s.bgcolor.r, s.bgcolor.g, s.bgcolor.b);
    this.pointLight = new PointLight(
      new THREE.Vector3(s.pointlight.x, s.pointlight.y, s.pointlight.z),
      s.pointlight.ii
    );
    this.shapes = [];
    for (const ellipse of s.ellipses) {
      const ellipseCloned = new Ellipse(
        new THREE.Vector3(ellipse.x, ellipse.y, ellipse.z),
        new THREE.Vector3(ellipse.a, ellipse.b, ellipse.c),
        new THREE.Color(
          ellipse.material.r,
          ellipse.material.g,
          ellipse.material.b
        ),
        ellipse.material.ia,
        ellipse.material.id,
        ellipse.material.is,
        ellipse.material.n
      );
      this.shapes.push(ellipseCloned);
    }

    for (let i = 0; i < s.triangles.length; i++) {
      const triangle = new Triangle(
        new THREE.Vector3(
          s.triangles[i].x0,
          s.triangles[i].y0,
          s.triangles[i].z0
        ),
        new THREE.Vector3(
          s.triangles[i].x1,
          s.triangles[i].y1,
          s.triangles[i].z1
        ),
        new THREE.Vector3(
          s.triangles[i].x2,
          s.triangles[i].y2,
          s.triangles[i].z2
        ),
        new THREE.Color(
          s.triangles[i].material.r,
          s.triangles[i].material.g,
          s.triangles[i].material.b
        ),
        s.triangles[i].material.ia,
        s.triangles[i].material.id,
        s.triangles[i].material.is,
        s.triangles[i].material.n
      );
      this.shapes.push(triangle);
    }
  }

  private shootRay: ShootRay = (
    e: THREE.Vector3,
    v: THREE.Vector3,
    currentDepth: number
  ) => {
    const nearest = {
      shape: undefined as BaseShape | undefined,
      t: Number.MAX_VALUE
    };
    for (const shape of this.shapes) {
      const tmpt = shape.calcT(e, v);
      if (tmpt > 0 && tmpt < nearest.t) {
        nearest.shape = shape;
        nearest.t = tmpt;
      }
    }

    if (nearest.shape !== undefined) {
      const hitpos = new THREE.Vector3();
      hitpos.copy(e);
      hitpos.add(v.multiplyScalar(nearest.t));
      const objcol = nearest.shape.calcShading(
        this.pointLight,
        hitpos,
        e,
        v,
        this.shootRay,
        currentDepth
      );
      return objcol;
    }
    return this.bgColor;
  };

  // 画面部分の作成(表示する枠ごとに)
  public createRendererDOM = (
    width: number,
    height: number,
    cameraPos: THREE.Vector3
  ) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.style.cssFloat = "left";
    canvas.style.margin = "10px";

    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    const img = new ImageData(canvas.width, canvas.height);
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const target = new THREE.Vector3(
          x - img.width / 2,
          -y + img.height / 2,
          0
        );
        const v = new THREE.Vector3();
        v.copy(target);
        v.sub(cameraPos).normalize();

        const rayColor = this.shootRay(cameraPos, v, 0);

        const index = x + y * img.width;
        img.data[index * 4 + 0] = rayColor.r; //R
        img.data[index * 4 + 1] = rayColor.g; //G
        img.data[index * 4 + 2] = rayColor.b; //B
        img.data[index * 4 + 3] = 255;
      }
    }

    context.putImageData(img, 0, 0);
    return canvas;
  };
}

const container = new RaytraceManager();

const viewport = container.createRendererDOM(
  256,
  256,
  new THREE.Vector3(0, 0, 700)
);
document.body.appendChild(viewport);
