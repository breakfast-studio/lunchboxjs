import { initLunchbox, ThreeLunchbox } from "../src";
import { beforeAll, describe, expect, it } from 'vitest';

describe('three-lunchbox wrapper', () => {
  beforeAll(() => {
    initLunchbox();
  });

  it('mounts the headless wrapper', () => {
    const lunchbox = document.createElement('three-lunchbox') as ThreeLunchbox;
    expect(lunchbox.three).toBeTruthy();
  });
});