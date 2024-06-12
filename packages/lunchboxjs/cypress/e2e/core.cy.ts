import { Lunchbox, ThreeLunchbox } from "../../src";
import type * as THREE from 'three';
import { Vector3 } from "three";
import { initLunchbox } from '../../src';

describe('vanilla HTML spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/cypress/pages/core.html', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });

  it('loads and sets up a basic scene', () => {
    cy.get('three-lunchbox').then(c => {
      const lb = c[0] as unknown as ThreeLunchbox;
      // ensure scene has correct number of children
      expect(lb.three.scene.children).to.have.length(2);
      // ensure box position is correct
      const [box] = lb.three.scene.children;
      expect(box.type).to.eq('Mesh');
      expect(box).to.not.haveOwnProperty('data');

      // ensure geometry is correct
      const mesh = box as THREE.Mesh;
      const boxGeo = mesh.geometry as THREE.BoxGeometry;
      expect(boxGeo).to.not.haveOwnProperty('args');
      expect(boxGeo.parameters.width).to.eq(1);
      expect(boxGeo.parameters.height).to.eq(2);
      expect(boxGeo.parameters.depth).to.eq(3);

      // ensure material is correct
      const mat = mesh.material as THREE.MeshBasicMaterial;
      expect(mat.type).to.eq('MeshBasicMaterial');
      expect(mat.color.toArray()).to.deep.eq([0, 0, 0]);
      expect(mat.wireframe).to.eq(true);
    });
  });

  it('handles mesh and material changes correctly', () => {
    // NOTE: After setting attributes, values are tested in Cypress assertions so the DOM
    // has a chance to respond to the attribute update.

    cy.get('three-mesh').then(async c => {
      expect(c.length).to.eq(2);
      const mesh = c.get(0) as unknown as Lunchbox<THREE.Mesh>;
      // update mesh property
      mesh.setAttribute('position-x', '1');
    });
    cy.get('three-mesh').then(async c => {
      const mesh = c.get(0) as unknown as Lunchbox<THREE.Mesh>;
      expect(mesh.instance.position.x).to.eq(1);
    });
    cy.get('mesh-basic-material').then(async c => {
      expect(c.length).to.eq(2);
      const mat = c.get(0) as unknown as Lunchbox<THREE.MeshBasicMaterial>;
      // update material property
      mat.setAttribute('color', 'red');
    });
    cy.get('mesh-basic-material').then(async c => {
      const mat = c.get(0) as unknown as Lunchbox<THREE.MeshBasicMaterial>;
      expect(mat.instance.color.toArray()).to.deep.eq([1, 0, 0]);
      // update material color to hex
      mat.setAttribute('color', '0x0000ff');

    });
    cy.get('mesh-basic-material').then(async c => {
      const mat = c.get(0) as unknown as Lunchbox<THREE.MeshBasicMaterial>;
      expect(mat.instance.color.toArray()).to.deep.eq([0, 0, 1]);
      // update material color to hash hex
      mat.setAttribute('color', '#00ff00');

    });
    cy.get('mesh-basic-material').then(async c => {
      const mat = c.get(0) as unknown as Lunchbox<THREE.MeshBasicMaterial>;
      expect(mat.instance.color.toArray()).to.deep.eq([0, 1, 0]);
      // update material color to shortened hash hex
      mat.setAttribute('color', '#f0f');
    });
    cy.get('mesh-basic-material').then(async c => {
      const mat = c.get(0) as unknown as Lunchbox<THREE.MeshBasicMaterial>;
      expect(mat.instance.color.toArray()).to.deep.eq([1, 0, 1]);
    });
  });

  it('handles adding and removing nested children correctly', () => {
    // add a child
    cy.get('three-mesh').then(async c => {
      expect(c.length).to.eq(2);
      const html = `<three-mesh data-name="child">
        <icosahedron-geometry></icosahedron-geometry>
        <mesh-basic-material color="black"></mesh-basic-material> 
      </three-mesh>`;
      (c.get(0) as unknown as Lunchbox<THREE.Mesh>).innerHTML = html;
    });
    // get basic child position
    cy.get('three-mesh[data-name="child"]').then(async (c) => {
      const child = c.get(0) as unknown as Lunchbox<THREE.Mesh>;
      expect(c.length).to.eq(1);
      expect(child.instance.position.toArray()).to.deep.eq([0, 0, 0]);
    });
    // move parent
    cy.get('three-mesh[data-name="base"').then(async c => {
      expect(c.length).to.eq(1);
      const mesh = c.get(0) as unknown as Lunchbox<THREE.Mesh>;
      // update mesh property
      mesh.setAttribute('position-x', '1');
    });
    // ensure child local/world positions are correct, update local position
    cy.get('three-mesh[data-name="child"]').then(async (c) => {
      const child = c.get(0) as unknown as Lunchbox<THREE.Mesh>;
      expect(c.length).to.eq(1);
      // local position should be origin
      expect(child.instance.position.toArray()).to.deep.eq([0, 0, 0]);
      // world position should match parent
      const worldArray = child.instance.getWorldPosition(new Vector3()).toArray();
      expect(worldArray).to.deep.eq([1, 0, -5]);
      child.setAttribute('position-x', '-1');
    });
    // ensure child local/world positions are correct after update
    cy.get('three-mesh[data-name="child"]').then(async (c) => {
      const child = c.get(0) as unknown as Lunchbox<THREE.Mesh>;
      expect(c.length).to.eq(1);
      expect(child.instance.position.toArray()).to.deep.eq([-1, 0, 0]);
      const worldArray = child.instance.getWorldPosition(new Vector3()).toArray();
      expect(worldArray).to.deep.eq([0, 0, -5]);
    });
  });

  it('handles scalar, array, and object attributes correctly', () => {
    // scalar scale value, array position value, adjust scale to array
    cy.get('three-mesh[data-name="scaled"]').then(async (c) => {
      const child = c.get(0) as unknown as Lunchbox<THREE.Mesh>;
      expect(c.length).to.eq(1);
      expect(child.instance.position.toArray()).to.deep.eq([-2, 0, -5]);
      expect(child.instance.scale.toArray()).to.deep.eq([2, 2, 2]);
      child.setAttribute('scale', '[1, 3, 4]');
    });
    cy.get('three-mesh[data-name="scaled"]').then(async (c) => {
      const child = c.get(0) as unknown as Lunchbox<THREE.Mesh>;
      expect(c.length).to.eq(1);
      expect(child.instance.scale.toArray()).to.deep.eq([1, 3, 4]);
    });
  });

  it('handles attempted re-registering correctly', () => {
    cy.wrap(initLunchbox).should('not.throw');
  });

  it.only('registers before and after update events correctly', () => {
    cy.window().then(win => {
      cy.get('three-lunchbox').then(lb => {
        const lunchbox = lb.get(0) as unknown as ThreeLunchbox;
        lunchbox.addEventListener('beforerender', () => {
          win.console.log('before');
        }, { once: true });
        lunchbox.addEventListener('afterrender', () => {
          win.console.log('after');
        }, { once: true });
      });
      cy.get('@consoleLog').should('be.calledWith', 'before');
      cy.get('@consoleLog').should('be.calledWith', 'after');
    });
  });
});