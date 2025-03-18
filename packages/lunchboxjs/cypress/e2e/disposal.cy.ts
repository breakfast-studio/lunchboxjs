import { Lunchbox, ThreeLunchbox } from "../../src";
import type * as THREE from 'three';
// import { Vector3 } from "three";

describe('vanilla HTML spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/cypress/pages/core.html');
  });

  it('handles disposal correctly', () => {
    cy.get('three-lunchbox').then(c => {
      const lb = c[0] as unknown as ThreeLunchbox;
      // ensure scene has correct number of children...
      expect(lb.three.scene.children).to.have.length(2);
      // ...geometries in memory...
      expect(lb.three.renderer?.info.memory.geometries).to.eq(2);
      // ...and draw calls
      expect(lb.three.renderer?.info.render.calls).to.eq(2);
      // set child to invisible - note no change to child/geo counts
      cy.get('three-mesh').then(async mesh => {
        const el = mesh.get(0) as unknown as Lunchbox<THREE.Mesh>;
        el.setAttribute('visible', 'false');
      });
      cy.get('three-mesh').then(async mesh => {
        const el = mesh.get(0) as unknown as Lunchbox<THREE.Mesh>;
        expect(el.instance.visible).to.be.false;
        expect(lb.three.scene.children).to.have.length(2);
        expect(lb.three.renderer?.info.memory.geometries).to.eq(2);

        // remove child - should see child, geo, and draw call count changes after this
        el.remove();
        expect(lb.three.scene.children).to.have.length(1);
        expect(lb.three.renderer?.info.memory.geometries).to.eq(1);
        // (note we're waiting a frame so the draw calls count has the opportunity to update)
        await new Promise(requestAnimationFrame);
        expect(lb.three.renderer?.info.render.calls).to.eq(1);
      });
    });
  });
});