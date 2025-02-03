import { Scene } from "three";
import { initLunchbox, ThreeLunchbox } from "../src";
import { beforeAll, describe, expect, it } from 'vitest';

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
});