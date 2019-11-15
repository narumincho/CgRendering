import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * @author 17FI082 鳴海秀人
 * メッシュの色をモデル座標系における位置の値で描画せよ．XをR，YをG，ZをBとする．
 */

document.documentElement.style.height = "100%";
document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
document.body.style.display = "grid";
const canvasElement = document.createElement("canvas");
canvasElement.style.display = "block";
canvasElement.style.justifySelf = "stretch";
canvasElement.style.alignSelf = "stretch";
document.body.appendChild(canvasElement);

const renderer = new three.WebGLRenderer({ canvas: canvasElement });
renderer.setClearColor(new three.Color(0, 0, 0));

const scene = new three.Scene();
scene.add(new three.AxesHelper(3));

const time = new three.Uniform(0);

scene.add(
    new three.Mesh(
        new three.BoxGeometry(2, 2, 2),
        new three.ShaderMaterial({
            vertexShader: `
varying vec3 vPosition;

void main()
{
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vPosition = position;
    gl_Position = projectionMatrix * mvPosition;
}
`,
            fragmentShader: `
varying vec3 vPosition;

void main()
{
    gl_FragColor = vec4( floor((vPosition + vec3(1.0)) * 2.0) / 4.0, 1.0 );
    // gl_FragColor = vec4( (vPosition + vec3(1.0)) / 2.0, 1.0 );    
}`
        })
    )
);
const camera = new three.PerspectiveCamera(
    75,
    renderer.domElement.clientWidth / renderer.domElement.clientHeight,
    0.1,
    1000
);
camera.position.copy(new three.Vector3(3, 3, 3));
camera.lookAt(new three.Vector3(0, 0, 0));
const orbitControls = new OrbitControls(camera, renderer.domElement);

const loop = (): void => {
    time.value = performance.now() / 1000;
    orbitControls.update();
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
