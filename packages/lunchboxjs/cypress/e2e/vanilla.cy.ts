import { Lunchbox, ThreeLunchbox } from "../../src";
import type * as THREE from 'three';

describe('template spec', () => {
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

    cy.get('three-mesh').then(c => {
      expect(c.length).to.eq(1);
      const mesh = c.get(0) as Lunchbox<THREE.Mesh>;
      // update mesh property
      mesh.setAttribute('position-x', '1');
    });
    cy.get('three-mesh').then(c => {
      const mesh = c.get(0) as Lunchbox<THREE.Mesh>;
      expect(mesh.instance.position.x).to.eq(1);
    });
    cy.get('mesh-basic-material').then(c => {
      expect(c.length).to.eq(1);
      const mat = c.get(0) as Lunchbox<THREE.MeshBasicMaterial>;
      // update material property
      mat.setAttribute('color', 'red');
    });
    cy.get('mesh-basic-material').then(c => {
      const mat = c.get(0) as Lunchbox<THREE.MeshBasicMaterial>;
      expect(mat.instance.color.toArray()).to.deep.eq([1, 0, 0]);
      // update material color to hex
      mat.setAttribute('color', '0x0000ff');

    });
    cy.get('mesh-basic-material').then(c => {
      const mat = c.get(0) as Lunchbox<THREE.MeshBasicMaterial>;
      expect(mat.instance.color.toArray()).to.deep.eq([0, 0, 1]);
      // update material color to hash hex
      mat.setAttribute('color', '#00ff00');

    });
    cy.get('mesh-basic-material').then(c => {
      const mat = c.get(0) as Lunchbox<THREE.MeshBasicMaterial>;
      expect(mat.instance.color.toArray()).to.deep.eq([0, 1, 0]);
      // update material color to shortened hash hex
      mat.setAttribute('color', '#f0f');
    });
    cy.get('mesh-basic-material').then(c => {
      const mat = c.get(0) as Lunchbox<THREE.MeshBasicMaterial>;
      expect(mat.instance.color.toArray()).to.deep.eq([1, 0, 1]);
    });
  });

  it('handles adding and removing nested children correctly', () => {
    cy.get('three-mesh').then(c => {
      expect(c.length).to.eq(1);
      const html = `<three-mesh data-name="child">
        <icosahedron-geometry></icosahedron-geometry>
        <mesh-basic-material color="black"></mesh-basic-material> 
      </three-mesh>`;
      (c.get(0) as Lunchbox<THREE.Mesh>).innerHTML = html;
    });
    cy.get('three-mesh[data-name="child"]').then((c) => {
      const child = c.get(0) as Lunchbox<THREE.Mesh>;
      expect(c.length).to.eq(1);
      expect(child.instance.position.toArray()).to.deep.eq([0, 0, 0]);
    });
    cy.get('three-mesh[data-name="base"').then(c => {
      expect(c.length).to.eq(1);
      const mesh = c.get(0) as Lunchbox<THREE.Mesh>;
      // update mesh property
      mesh.setAttribute('position-x', '1');
    });


    // cy.get('three-lunchbox').then(() => {
    //   expect(parent.instance.children.length).to.eq(1);
    // });

  });
});