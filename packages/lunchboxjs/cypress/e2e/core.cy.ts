import { Lunchbox, ThreeLunchbox } from "../../src";
import type * as THREE from 'three';
import { Vector3 } from "three";

describe('vanilla HTML spec', () => {
  beforeEach(() => {
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
      expect(c.length).to.eq(1);
      const mesh = c.get(0) as Lunchbox<THREE.Mesh>;
      // update mesh property
      mesh.setAttribute('position-x', '1');
    });
    cy.get('three-mesh').then(async c => {
      const mesh = c.get(0) as Lunchbox<THREE.Mesh>;
      expect(mesh.instance.position.x).to.eq(1);
    });
    cy.get('mesh-basic-material').then(async c => {
      expect(c.length).to.eq(1);
      const mat = c.get(0) as Lunchbox<THREE.MeshBasicMaterial>;
      // update material property
      mat.setAttribute('color', 'red');
    });
    cy.get('mesh-basic-material').then(async c => {
      const mat = c.get(0) as Lunchbox<THREE.MeshBasicMaterial>;
      expect(mat.instance.color.toArray()).to.deep.eq([1, 0, 0]);
      // update material color to hex
      mat.setAttribute('color', '0x0000ff');

    });
    cy.get('mesh-basic-material').then(async c => {
      const mat = c.get(0) as Lunchbox<THREE.MeshBasicMaterial>;
      expect(mat.instance.color.toArray()).to.deep.eq([0, 0, 1]);
      // update material color to hash hex
      mat.setAttribute('color', '#00ff00');

    });
    cy.get('mesh-basic-material').then(async c => {
      const mat = c.get(0) as Lunchbox<THREE.MeshBasicMaterial>;
      expect(mat.instance.color.toArray()).to.deep.eq([0, 1, 0]);
      // update material color to shortened hash hex
      mat.setAttribute('color', '#f0f');
    });
    cy.get('mesh-basic-material').then(async c => {
      const mat = c.get(0) as Lunchbox<THREE.MeshBasicMaterial>;
      expect(mat.instance.color.toArray()).to.deep.eq([1, 0, 1]);
    });
  });

  it('handles adding and removing nested children correctly', () => {
    // add a child
    cy.get('three-mesh').then(async c => {
      expect(c.length).to.eq(1);
      const html = `<three-mesh data-name="child">
        <icosahedron-geometry></icosahedron-geometry>
        <mesh-basic-material color="black"></mesh-basic-material> 
      </three-mesh>`;
      (c.get(0) as Lunchbox<THREE.Mesh>).innerHTML = html;
    });
    // get basic child position
    cy.get('three-mesh[data-name="child"]').then(async (c) => {
      const child = c.get(0) as Lunchbox<THREE.Mesh>;
      expect(c.length).to.eq(1);
      expect(child.instance.position.toArray()).to.deep.eq([0, 0, 0]);
    });
    // move parent
    cy.get('three-mesh[data-name="base"').then(async c => {
      expect(c.length).to.eq(1);
      const mesh = c.get(0) as Lunchbox<THREE.Mesh>;
      // update mesh property
      mesh.setAttribute('position-x', '1');
    });
    // ensure child local/world positions are correct, update local position
    cy.get('three-mesh[data-name="child"]').then(async (c) => {
      const child = c.get(0) as Lunchbox<THREE.Mesh>;
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
      const child = c.get(0) as Lunchbox<THREE.Mesh>;
      expect(c.length).to.eq(1);
      expect(child.instance.position.toArray()).to.deep.eq([-1, 0, 0]);
      const worldArray = child.instance.getWorldPosition(new Vector3()).toArray();
      expect(worldArray).to.deep.eq([0, 0, -5]);
    });
  });
});