import { ThreeLunchbox } from "../../src";
import type * as THREE from 'three';

describe('template spec', () => {
  before(() => {
    cy.visit('http://localhost:5173/cypress/pages/core.html');
  });

  it('loads and sets up a basic scene', () => {
    cy.get('three-lunchbox').then(c => {
      const lb = c[0] as unknown as ThreeLunchbox;
      // ensure scene has correct number of children
      expect(lb.three.scene.children).to.have.length(1);
      // ensure box position is correct
      const [box] = lb.three.scene.children;
      expect(box.type).to.eq('Mesh');

      // ensure geometry is correct
      const mesh = box as THREE.Mesh;
      const boxGeo = mesh.geometry as THREE.BoxGeometry;
      expect(boxGeo).to.not.haveOwnProperty('args');
      expect(boxGeo.parameters.width).to.eq(1);
      expect(boxGeo.parameters.height).to.eq(2);
      expect(boxGeo.parameters.depth).to.eq(3);

      // ensure material is correct
      // TODO: start here
    });
  });
});