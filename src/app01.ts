import * as THREE from "three";

/**
 * @author 17FI082 鳴海秀人
 * 複数のWebGLRendererを作成，使用し，
 * A:カメラを座標(3,3,3)を配置したレンダリング結果を表示
 * B:X軸（座標(3,0,0)）にカメラを配置したレンダリング結果を表示
 * C:Y軸（座標(0,3,0)）にカメラを配置したレンダリング結果を表示
 * D:Z軸（座標(0,0,3)）にカメラを配置したレンダリング結果を表示
 * するようにapp.tsを改良せよ．
 *
 * レイアウトはブラウザのウインドウサイズによって異なるので，実行例と異なっていてもよい．
 */

document.documentElement.style.height = "100%";
document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
document.body.style.display = "grid";
document.body.style.gap = "8px";
document.body.style.gridTemplateColumns = "1fr 300px";
document.body.style.justifyItems = "stretch";
document.body.style.alignItems = "stretch";
const mainRender = new THREE.WebGLRenderer();
mainRender.setClearColor(new THREE.Color(0x000000));
mainRender.setSize(100, 100, false);

const axisContainer = document.createElement("div");
axisContainer.style.display = "grid";
axisContainer.style.gridTemplateRows = "1fr 1fr 1fr";
axisContainer.style.gap = "8px";
axisContainer.style.justifyItems = "stretch";
axisContainer.style.alignItems = "stretch";
document.body.append(mainRender.domElement, axisContainer);
const xRender = new THREE.WebGLRenderer();
xRender.setClearColor(new THREE.Color(0x000000));
xRender.setSize(100, 100, false);

const yRender = new THREE.WebGLRenderer();
yRender.setClearColor(new THREE.Color(0x000000));
yRender.setSize(100, 100, false);

const zRender = new THREE.WebGLRenderer();
zRender.setClearColor(new THREE.Color(0x000000));
zRender.setSize(100, 100, false);

axisContainer.append(
  xRender.domElement,
  yRender.domElement,
  zRender.domElement
);

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(3));
const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshPhongMaterial({ color: 0x33ddff })
);
scene.add(box);

// ライトの設定
const light: THREE.Light = new THREE.PointLight(0xffffff);
light.position.copy(new THREE.Vector3(3, 1, 2));
light.castShadow = true;
scene.add(light);

const makeCamera = (position: THREE.Vector3): THREE.PerspectiveCamera => {
  const camera = new THREE.PerspectiveCamera(
    75,
    mainRender.domElement.clientWidth / mainRender.domElement.clientHeight,
    0.1,
    1000
  );
  camera.position.copy(position);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  return camera;
};

const mainCamera = makeCamera(new THREE.Vector3(3, 3, 3));
const xCamera = makeCamera(new THREE.Vector3(3, 0, 0));
const yCamera = makeCamera(new THREE.Vector3(0, 3, 0));
const zCamera = makeCamera(new THREE.Vector3(0, 0, 3));

const loop = (): void => {
  mainRender.setSize(
    mainRender.domElement.clientWidth,
    mainRender.domElement.clientHeight,
    false
  );
  mainCamera.aspect =
    mainRender.domElement.clientWidth / mainRender.domElement.clientHeight;
  mainCamera.updateProjectionMatrix();
  mainRender.render(scene, mainCamera);

  xRender.setSize(
    xRender.domElement.clientWidth,
    xRender.domElement.clientHeight,
    false
  );
  xCamera.aspect =
    xRender.domElement.clientWidth / xRender.domElement.clientHeight;
  xCamera.updateProjectionMatrix();
  xRender.render(scene, xCamera);

  yRender.setSize(
    yRender.domElement.clientWidth,
    yRender.domElement.clientHeight,
    false
  );
  yCamera.aspect =
    yRender.domElement.clientWidth / yRender.domElement.clientHeight;
  yCamera.updateProjectionMatrix();
  yRender.render(scene, yCamera);

  zRender.setSize(
    zRender.domElement.clientWidth,
    zRender.domElement.clientHeight,
    false
  );
  zCamera.aspect =
    zRender.domElement.clientWidth / zRender.domElement.clientHeight;
  zCamera.updateProjectionMatrix();
  zRender.render(scene, zCamera);

  requestAnimationFrame(loop);
};
loop();
