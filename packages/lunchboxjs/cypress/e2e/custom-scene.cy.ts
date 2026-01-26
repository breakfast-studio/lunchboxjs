import { Scene } from "three";
import { ThreeLunchbox } from "../../src";
// import type * as THREE from 'three';
// import { Vector3 } from "three";

describe('vanilla HTML spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/cypress/pages/custom-scene.html');
  });

  it('loads and sets up a basic scene', () => {
    cy.get('custom-scene').then(c => {
      const lb = c[0] as unknown as ThreeLunchbox;
      expect((lb.three.scene as Scene & { isCustomScene: boolean }).isCustomScene).eq(true);
    });
  });
});