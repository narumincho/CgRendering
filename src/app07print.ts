import { Vector3 } from "three";

const I: Vector3 = new Vector3(1 / 2, -Math.sqrt(3) / 2, 0);
const N: Vector3 = new Vector3(0, 1, 0);
const IPrime: Vector3 = I.clone().divideScalar(Math.abs(I.clone().dot(N)));
for (let ni = 0; ni < 3; ni += 0.01) {
  const n: number = 1 / ni;
  const kf2: number =
    1 /
    (n ** 2 * IPrime.lengthSq() -
      I.clone()
        .add(N)
        .lengthSq());
  const T: Vector3 = I.clone()
    .add(N)
    .multiplyScalar(Math.sqrt(kf2))
    .sub(N);
  console.group("ni=", ni);
  console.log(T);
  console.groupEnd();
}
