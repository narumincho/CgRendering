import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";

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

const scene = new THREE.Scene();

// requireにより，サーバーサイド読み込み
const vert = require("./vertex.vs").default;
const frag = require("./fragment.fs").default;

const otherUniforms = {
  modelcolor: new THREE.Uniform(new THREE.Vector3(0, 1, 0))
};
const uniforms = THREE.UniformsUtils.merge([
  THREE.UniformsLib["lights"],
  otherUniforms
]);
const material = new THREE.ShaderMaterial({
  lights: true,
  uniforms: uniforms,
  vertexShader: vert,
  fragmentShader: frag
});

const cloader = new ColladaLoader();
cloader.load("./monkey.dae", result => {
  console.log(result);
  const monkeyHeadLambert = result.scene.children[2].clone() as THREE.Mesh;
  const monkeyHeadHalfLambert = result.scene.children[2].clone() as THREE.Mesh;
  scene.add(monkeyHeadLambert);
  scene.add(monkeyHeadHalfLambert);
  monkeyHeadLambert.rotateX(-90);
  monkeyHeadHalfLambert.rotateX(-90);
  monkeyHeadLambert.position.set(0, 1.0, 0);
  monkeyHeadHalfLambert.position.set(0, -1.0, 0);

  monkeyHeadLambert.material = new THREE.MeshLambertMaterial({
    color: 0x00ff00
  });
  monkeyHeadHalfLambert.material = material;
});

const light = new THREE.DirectionalLight(0xffffff);
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
