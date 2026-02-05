import { PerspectiveCamera, Scene } from "three";
import { initLunchbox, ThreeLunchbox } from "../src";
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { customElement } from "lit/decorators.js";

describe('three-lunchbox wrapper', () => {
  beforeAll(() => {
    initLunchbox();
  });

  it('mounts the wrapper', () => {
    const lunchbox = document.createElement('three-lunchbox') as ThreeLunchbox;
    expect(lunchbox.three).toHaveProperty('scene');
    expect(lunchbox.three.scene).toBeInstanceOf(Scene);
  });

  it('mounts example scene objects', async () => {
    const lunchbox = document.createElement('three-lunchbox') as ThreeLunchbox;
    lunchbox.setAttribute('headless', 'true');
    lunchbox.innerHTML = '<three-mesh></three-mesh>';
    document.body.append(lunchbox as unknown as Node);
    expect(lunchbox.three.scene.children).toHaveLength(1);
  });

  it('accepts a custom createThree function', async() => {
    class ExtendedScene extends Scene {
    }
    class ExtendedCamera extends PerspectiveCamera {
    }
    class CustomRenderer {
      domElement = document.createElement('canvas');
      dispose(){}
      render(){}
    }

    @customElement('extended-lunchbox')
    class ExtendedLunchbox extends ThreeLunchbox {
      createThree(){
        return {
          scene: new ExtendedScene(),
          camera: new ExtendedCamera(),
          renderer: new CustomRenderer() as any,
        }
      }
    }

    const extended = document.createElement('extended-lunchbox') as ExtendedLunchbox;
    const readyPromise = new Promise(r => extended.addEventListener('three-ready', r));
    document.body.append(extended as unknown as Node);
    await vi.waitUntil(async () => await readyPromise);
    expect(extended.three.scene).toBeInstanceOf(ExtendedScene);
    expect(extended.three.camera).toBeInstanceOf(ExtendedCamera);
    expect(extended.three.renderer).toBeInstanceOf(CustomRenderer);
  })
});
