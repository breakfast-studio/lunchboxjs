import { ThreeLunchbox } from "../../src";
// import type * as THREE from 'three';
// import { Vector3 } from "three";

describe('vanilla HTML spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/cypress/pages/camera.html');
  });

  it('loads and sets up a basic scene', () => {
    cy.get('three-lunchbox').then(c => {
      const lb = c[0] as unknown as ThreeLunchbox;
      // ensure scene has correct number of children and correct camera type and position
      expect(lb.three.scene.children).to.have.length(1);
      expect(lb.three.camera?.type).to.eq('OrthographicCamera');
      expect(lb.three.camera?.position.toArray()).to.deep.eq([0.25, 0.5, 0]);
    });
  });
});