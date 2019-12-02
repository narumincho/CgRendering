import * as three from "three";

/**
 * @author 17FI082 鳴海秀人
 * THREE.MeshNormalMaterial⇒Zキー
 * THREE.MeshLambertMaterial⇒Xキー
 * THREE.MeshPhongMaterial（デフォルト（スムーズシェーディング））⇒Cキー
 * THREE.MeshPhongMaterial（フラットシェーディング）⇒Vキー
 * THREE.MeshPhongMaterial（ワイヤーフレーム）⇒Bキー
 *
 * をキーボードで切り替えて表示できるようにせよ．
 */

document.documentElement.style.height = "100%";
document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
document.body.style.display = "grid";
document.body.style.gridTemplateRows = "calc(100% - 60px) 60px";
const canvasElement = document.createElement("canvas");
canvasElement.style.display = "block";
canvasElement.style.justifySelf = "stretch";
canvasElement.style.alignSelf = "stretch";
canvasElement.style.margin = "0";
const buttonContainer = document.createElement("div");
buttonContainer.style.display = "grid";
buttonContainer.style.gridAutoFlow = "column";

type MaterialId =
  | "normal"
  | "lambert"
  | "phongSmooth"
  | "phongFlat"
  | "phongWireframe";

let selectedMaterial: MaterialId = "normal";

const keys: Record<MaterialId, string> = {
  normal: "z",
  lambert: "x",
  phongSmooth: "c",
  phongFlat: "v",
  phongWireframe: "b"
};

const buttonElements: Map<MaterialId, HTMLButtonElement> = new Map();

const materialColor: three.Color = new three.Color(0x55ff00);

const materials: Record<MaterialId, three.Material> = {
  normal: new three.MeshNormalMaterial(),
  lambert: new three.MeshLambertMaterial(),
  phongSmooth: new three.MeshPhongMaterial({ color: materialColor }),
  phongFlat: new three.MeshPhongMaterial({
    color: materialColor,
    flatShading: true
  }),
  phongWireframe: new three.MeshPhongMaterial({
    color: materialColor,
    wireframe: true
  })
};
const geometry = new three.TorusGeometry(2, 0.5, 16, 100);

const mesh: three.Mesh = new three.Mesh(geometry, materials[selectedMaterial]);

const updateMaterial = (): void => {
  for (const [materialId, buttonElement] of buttonElements.entries()) {
    buttonElement.disabled = materialId === selectedMaterial;
  }
  console.log(selectedMaterial);
  mesh.material = materials[selectedMaterial];
};
updateMaterial();

for (const label of Object.keys(keys)) {
  const labelText = label as MaterialId;
  const button = document.createElement("button");
  button.textContent = labelText + "[" + keys[labelText] + "]";
  button.style.boxSizing = "border-box";
  button.addEventListener("click", () => {
    selectedMaterial = labelText;
    updateMaterial();
  });
  buttonElements.set(labelText, button);
  buttonContainer.appendChild(button);
}
document.body.append(canvasElement, buttonContainer);

addEventListener("keydown", e => {
  for (const materialId of buttonElements.keys()) {
    if (e.key === keys[materialId]) {
      selectedMaterial = materialId;
      updateMaterial();
    }
  }
});

const renderer = new three.WebGLRenderer({ canvas: canvasElement });
renderer.setClearColor(new three.Color(0x000000));
renderer.shadowMap.enabled = true;
const scene = new three.Scene();
scene.add(new three.AxesHelper(3));

{
  const light: THREE.Light = new three.DirectionalLight(0xffffff);
  light.position.copy(new three.Vector3(10, 10, 10));
  light.castShadow = true;
  light.shadow.camera = new three.OrthographicCamera(-30, 30, 30, -30);
  scene.add(light);
}
const camera = new three.PerspectiveCamera(
  75,
  renderer.domElement.clientWidth / renderer.domElement.clientHeight,
  0.1,
  1000
);
camera.position.copy(new three.Vector3(3, 3, 3));
camera.lookAt(new three.Vector3(0, 0, 0));

console.log(materials[selectedMaterial]);
scene.add(mesh);

const loop = (): void => {
  mesh.rotateX(0.02);

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
