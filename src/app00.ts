import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * @author 17FI082 鳴海秀人
 * @description CGレンダリングおよび演習 第1回 XYZ各座標軸を原点から正の方向に線を描画し可視化せよ．
 * X：赤色
 * Y：緑色
 * Z：青色
 *
 * とする．
 */

document.documentElement.style.height = "100%";
document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
const canvasElement: HTMLCanvasElement = document.createElement("canvas");
canvasElement.style.display = "block";
canvasElement.style.width = "100%";
canvasElement.style.height = "100%";
canvasElement.style.margin = "0";
document.body.append(canvasElement);

const scene = new THREE.Scene();
const xAxisGeometry = new THREE.Geometry();
xAxisGeometry.vertices.push(
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(8, 0, 0)
);
scene.add(
  new THREE.Line(
    xAxisGeometry,
    new THREE.LineBasicMaterial({ color: 0xff0000 })
  )
);
const yAxisGeometry = new THREE.Geometry();
yAxisGeometry.vertices.push(
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 8, 0)
);
scene.add(
  new THREE.Line(
    yAxisGeometry,
    new THREE.LineBasicMaterial({ color: 0x00ff00 })
  )
);
const zAxisGeometry = new THREE.Geometry();
zAxisGeometry.vertices.push(
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 8)
);
scene.add(
  new THREE.Line(
    zAxisGeometry,
    new THREE.LineBasicMaterial({ color: 0x0000ff })
  )
);

const box = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshDistanceMaterial({})
);
box.castShadow = true;
scene.add(box);

// ライトの設定
const light: THREE.Light = new THREE.DirectionalLight(0xffffff);
light.position.copy(new THREE.Vector3(10, 10, 10));
light.castShadow = true;
light.shadow.camera = new THREE.OrthographicCamera(-30, 30, -30, 30);
scene.add(light);

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
  canvas: canvasElement
});
const canvasWidth = canvasElement.clientWidth;
const canvasHeight = canvasElement.clientHeight;
renderer.setSize(canvasWidth, canvasHeight, false);
renderer.setClearColor(new THREE.Color(0x000000));
renderer.shadowMap.enabled = true;
// カメラの設定
const camera = new THREE.PerspectiveCamera(
  75,
  canvasWidth / canvasHeight,
  0.1,
  1000
);
camera.position.set(10, 10, 10);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const orbitControls = new OrbitControls(camera, canvasElement);

const update = (): void => {
  orbitControls.update();

  renderer.setSize(
    canvasElement.clientWidth,
    canvasElement.clientHeight,
    false
  );

  camera.aspect = canvasElement.clientWidth / canvasElement.clientHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);

  requestAnimationFrame(update);
};
update();
