import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
/**
 * @author 17FI082 鳴海秀人
 * ブレンディングを利用し，火の玉を作れ．多少正常に表示されない場合もあるが気にしなくてよい．
 */

document.documentElement.style.height = "100%";
document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
document.body.style.display = "grid";
const canvasElement = document.createElement("canvas");
canvasElement.style.justifySelf = "stretch";
canvasElement.style.alignSelf = "stretch";
document.body.appendChild(canvasElement);
const renderer = new three.WebGLRenderer({ canvas: canvasElement });
renderer.setClearColor(new three.Color(0, 0, 0));
console.log(renderer.shadowMap.enabled);
const scene = new three.Scene();
scene.add(new three.AxesHelper(3));

const geometry = new three.PlaneGeometry(2, 2);
const material = new three.MeshBasicMaterial({
  map: new three.TextureLoader().load("glow.png"),
  transparent: true,
  opacity: 0.3,
  blending: three.AdditiveBlending
});

const meshList: Array<three.Mesh> = [];
for (let i = 0; i < 360; i += 3) {
  const mesh = new three.Mesh(geometry, material);
  const angle = (i * Math.PI * 2) / 360;
  mesh.position.set(Math.cos(angle) * 2, 0, Math.sin(angle) * 2);
  meshList.push(mesh);
  scene.add(mesh);
}

const light = new three.DirectionalLight(new three.Color(1, 1, 1));
light.position.copy(new three.Vector3(1, 1, 1).normalize());
scene.add(light);

const camera = new three.PerspectiveCamera(
  75,
  renderer.domElement.clientWidth / renderer.domElement.clientHeight,
  0.1,
  1000
);

camera.position.copy(new three.Vector3(3, 3, 3));
camera.lookAt(new three.Vector3(0, 0, 0));

const orbitControls = new OrbitControls(camera, renderer.domElement);

let count = 0;

const loop = (): void => {
  orbitControls.update();

  for (let i = 0; i < meshList.length; i++) {
    const mesh = meshList[i];
    const vec = new three.Vector3(1, 1, 1);
    const pos = (i + count) % meshList.length;
    mesh.scale.copy(
      vec.multiplyScalar(pos < 10 ? 0 : 1 - pos / meshList.length)
    );
    mesh.lookAt(camera.position);
  }
  count = count + 1;

  renderer.setSize(
    renderer.domElement.clientWidth,
    renderer.domElement.clientHeight,
    false
  );
  camera.aspect =
    renderer.domElement.clientWidth / renderer.domElement.clientHeight;
  camera.updateProjectionMatrix();

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
};
loop();
