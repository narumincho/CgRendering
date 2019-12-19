import * as THREE from "three";
import { PointLight } from "./pointlight";
import { BaseShape } from "./shapes/baseshape";
import { Ellipse } from "./shapes/ellipse";
import { Triangle } from "./shapes/triangle";
import { ShootRay } from "../@types/ShootRay";

import rtScene from "./scenes/scene4";

export class RaytraceManager {
    private bgcolor: THREE.Color;
    private pointlight: PointLight;
    private shapes: BaseShape[];

    public static readonly MAX_DEPTH = 5;

    constructor() {
        this.loadScene();
    }

    // シーンの読み込み
    private loadScene = () => {
        const s = rtScene;

        this.bgcolor = new THREE.Color(s.bgcolor.r, s.bgcolor.g, s.bgcolor.b);
        this.pointlight = new PointLight(new THREE.Vector3(s.pointlight.x, s.pointlight.y, s.pointlight.z), s.pointlight.ii);
        this.shapes = [];
        for (let i = 0; i < s.ellipses.length; i++) {
            const ellipse = new Ellipse(
                new THREE.Vector3(s.ellipses[i].x, s.ellipses[i].y, s.ellipses[i].z),
                new THREE.Vector3(s.ellipses[i].a, s.ellipses[i].b, s.ellipses[i].c),
                new THREE.Color(s.ellipses[i].material.r, s.ellipses[i].material.g, s.ellipses[i].material.b),
                s.ellipses[i].material.ia, s.ellipses[i].material.id, s.ellipses[i].material.is, s.ellipses[i].material.n);
            this.shapes.push(ellipse);
        }

        for (let i = 0; i < s.triangles.length; i++) {
            const triangle = new Triangle(
                new THREE.Vector3(s.triangles[i].x0, s.triangles[i].y0, s.triangles[i].z0),
                new THREE.Vector3(s.triangles[i].x1, s.triangles[i].y1, s.triangles[i].z1),
                new THREE.Vector3(s.triangles[i].x2, s.triangles[i].y2, s.triangles[i].z2),
                new THREE.Color(s.triangles[i].material.r, s.triangles[i].material.g, s.triangles[i].material.b),
                s.triangles[i].material.ia, s.triangles[i].material.id, s.triangles[i].material.is, s.triangles[i].material.n);
            this.shapes.push(triangle);
        }

    }

    private shootRay: ShootRay = (e: THREE.Vector3, v: THREE.Vector3, currentDepth: number) => {
        const nearest = { shape: <BaseShape>undefined, t: Number.MAX_VALUE }
        for (let i = 0; i < this.shapes.length; i++) {
            const tmpt = this.shapes[i].calcT(e, v);
            if (tmpt > 0 && (tmpt < nearest.t)) {
                nearest.shape = this.shapes[i];
                nearest.t = tmpt;
            }
        }

        if (nearest.shape !== undefined) {
            const hitpos = new THREE.Vector3();
            hitpos.copy(e);
            hitpos.add(v.multiplyScalar(nearest.t));
            const objcol = nearest.shape.calcShading(this.pointlight, hitpos, e, v, this.shootRay, currentDepth);
            return objcol;
        }
        else {
            return this.bgcolor;
        }
    }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.style.cssFloat = "left";
        canvas.style.margin = "10px";

        const context = canvas.getContext("2d");

        const img = new ImageData(canvas.width, canvas.height);
        for (let y = 0; y < img.height; y++) {
            for (let x = 0; x < img.width; x++) {
                const target = new THREE.Vector3(x - img.width / 2, -y + img.height / 2, 0);
                const v = new THREE.Vector3();
                v.copy(target);
                v.sub(cameraPos).normalize();

                const rayColor = this.shootRay(cameraPos, v, 0);

                const index = x + y * img.width;
                img.data[index * 4 + 0] = rayColor.r;   //R
                img.data[index * 4 + 1] = rayColor.g;   //G
                img.data[index * 4 + 2] = rayColor.b;   //B
                img.data[index * 4 + 3] = 255;
            }
        }


        context.putImageData(img, 0, 0);
        return canvas;
    }
}


const container = new RaytraceManager();

const viewport = container.createRendererDOM(256, 256, new THREE.Vector3(0, 0, 700));
document.body.appendChild(viewport);
