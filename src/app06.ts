import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * @author 17FI082 鳴海秀人
 * 位相を加え，物体が波打つような表現を実装せよ．
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

{
    const light: THREE.Light = new three.DirectionalLight(0xffffff);
    light.position.copy(new three.Vector3(10, 10, 10));
    light.castShadow = true;
    light.shadow.camera = new three.OrthographicCamera(-30, 30, 30, -30);
    scene.add(light);
}

const time = new three.Uniform(0);

scene.add(
    new three.Mesh(
        new three.TorusGeometry(2, 0.5, 16, 100),
        new three.ShaderMaterial({
            uniforms: { time },
            wireframe: true,
            vertexShader: `
uniform float time; 

void main()
{
    vec3 mPos = position;
    mPos.z += cos((mPos.y * 10.0) + time) * 0.3;
    vec4 mvPosition = modelViewMatrix * vec4(mPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}
`,
            fragmentShader: `
void main()
{
    gl_FragColor = vec4( 0.0, 1.0, 0.0, 1.0 );
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

const loop = () => {
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
