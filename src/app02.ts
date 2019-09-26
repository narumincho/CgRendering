import * as three from "three";

/**
 * @author 17FI082 鳴海秀人
 * 床に色の異なる正方形を交互に並べて市松模様を作る（色，数などは任意で良い）
 * 投影方法を平行投影にする
 * キーボードのZおよびXキーで映す範囲を変更できる
 * 以上を実装したプログラムを作成せよ．
 *
 * Cで回転するようにもした
 */

document.documentElement.style.height = "100%";
document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
const canvasElement = document.createElement("canvas");
canvasElement.style.display = "block";
canvasElement.style.width = "100%";
canvasElement.style.height = "100%";
canvasElement.style.margin = "0";
document.body.appendChild(canvasElement);

const randomColor = (): three.Color =>
    new three.Color(Math.random(), Math.random(), Math.random());

const renderer = new three.WebGLRenderer({ canvas: canvasElement });
renderer.setSize(canvasElement.width, canvasElement.height, false);
renderer.setClearColor(new three.Color(0x000000));
renderer.shadowMap.enabled = true;

const scene = new three.Scene();

const geometry = new three.BoxGeometry(1, 1, 1);
const cube = new three.Mesh(
    geometry,
    new three.MeshLambertMaterial({ color: randomColor() })
);
scene.add(cube);

const floor: Array<three.Mesh> = [];
{
    const panelMaterialA = new three.MeshLambertMaterial({
        color: randomColor()
    });
    const panelMaterialB = new three.MeshLambertMaterial({
        color: randomColor()
    });
    for (let x = 0; x < 20; x++) {
        for (let y = 0; y < 20; y++) {
            const mesh = new three.Mesh(
                geometry,
                (x + y) % 2 === 0 ? panelMaterialA : panelMaterialB
            );
            mesh.position.copy(new three.Vector3(x - 10, -3, y - 10));
            scene.add(mesh);
            floor.push(mesh);
        }
    }
}
{
    const light: THREE.Light = new three.DirectionalLight(0xffffff);
    light.position.copy(new three.Vector3(10, 10, 10));
    light.castShadow = true;
    light.shadow.camera = new three.OrthographicCamera(-30, 30, 30, -30);
    scene.add(light);
}

let cameraWidth = 10;
let isFloorRotation = false;

const camera = new three.OrthographicCamera(
    -cameraWidth / 2,
    cameraWidth / 2,
    (cameraWidth * canvasElement.height) / canvasElement.width / 2,
    (-cameraWidth * canvasElement.height) / canvasElement.width / 2,
    0
);
camera.position.copy(new three.Vector3(10, 10, 10));
camera.lookAt(new three.Vector3(0, 0, 0));

const update = () => {
    camera.left = -cameraWidth / 2;
    camera.right = cameraWidth / 2;
    camera.top = (cameraWidth * canvasElement.height) / canvasElement.width / 2;
    camera.bottom =
        (-cameraWidth * canvasElement.height) / canvasElement.width / 2;
    camera.updateProjectionMatrix();

    cube.rotateX(0.01);
    if (isFloorRotation) {
        floor.map(e => {
            e.rotateX(0.02);
            e.rotateY(0.03);
            e.rotateZ(0.05);
        });
    }

    renderer.setSize(
        canvasElement.clientWidth,
        canvasElement.clientHeight,
        false
    );
    renderer.render(scene, camera);

    requestAnimationFrame(update);
};
update();

addEventListener("keydown", e => {
    if (e.key === "z") {
        cameraWidth += 0.1;
    }
    if (e.key === "x") {
        cameraWidth -= 0.1;
    }
    if (e.key === "c") {
        isFloorRotation = true;
    }
});
