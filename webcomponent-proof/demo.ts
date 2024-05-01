import { ThreeLunchbox, initLunchbox } from './src/index.ts'
initLunchbox()

const t = document.querySelector<ThreeLunchbox>('three-lunchbox')!;
t.camera.position.z = 5
console.log(t.scene)