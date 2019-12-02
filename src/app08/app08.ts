import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";

let scene: THREE.Scene;
let material: THREE.Material;
let light: THREE.Light;
let uniforms: Array<THREE.Uniform>;
let cloader: ColladaLoader;
let monkeyheadlambert: THREE.Mesh;
let monkeyheadhalflambert: THREE.Mesh;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(new THREE.Color(0x495ed));

const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.copy(new THREE.Vector3(0, 0, 5));
camera.lookAt(new THREE.Vector3(0, 0, 0));

renderer.domElement.style.cssFloat = "left";
renderer.domElement.style.margin = "10px";

scene = new THREE.Scene();

// requireにより，サーバーサイド読み込み
const vert = require("./vertex.vs").default;
const frag = require("./fragment.fs").default;

let otherUniforms = {
  modelcolor: new THREE.Uniform(new THREE.Vector3(0, 1, 0))
};
uniforms = THREE.UniformsUtils.merge([
  THREE.UniformsLib["lights"],
  otherUniforms
]);
material = new THREE.ShaderMaterial({
  lights: true,
  uniforms: uniforms,
  vertexShader: vert,
  fragmentShader: frag
});

cloader = new ColladaLoader();
cloader.load("./monkey.dae", result => {
  console.log(result);
  monkeyheadlambert = result.scene.children[2].clone() as THREE.Mesh;
  monkeyheadhalflambert = result.scene.children[2].clone() as THREE.Mesh;
  scene.add(monkeyheadlambert);
  scene.add(monkeyheadhalflambert);
  monkeyheadlambert.rotateX(-90);
  monkeyheadhalflambert.rotateX(-90);
  monkeyheadlambert.position.set(0, 1.0, 0);
  monkeyheadhalflambert.position.set(0, -1.0, 0);

  monkeyheadlambert.material = new THREE.MeshLambertMaterial({
    color: 0x00ff00
  });
  monkeyheadhalflambert.material = material;
});

light = new THREE.DirectionalLight(0xffffff);
light.position.copy(new THREE.Vector3(1, 1, 1).normalize());
scene.add(light);

document.body.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);

const update = (): void => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  orbitControls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(update);
};
update();
