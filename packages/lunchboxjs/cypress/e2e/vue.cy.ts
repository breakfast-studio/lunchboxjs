import { Lunchbox, ThreeLunchbox } from "../../src";
import type * as THREE from 'three';

describe('Vue spec', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/cypress/pages/vue.html');
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

    it('updates position X on ref update', () => {
        cy.get('input[data-name="position-x"]').type('2');
        cy.get('three-mesh[data-name="base"]').then(m => {
            const instance = (m.get(0) as unknown as Lunchbox<THREE.Mesh>).instance;
            expect(instance.position.toArray()).to.deep.eq([2, 0, -5]);
        });
    });

    it('dynamically adds and removes boxes', () => {
        // add two boxes, ensure scene child counts update
        cy.get('button[data-name="add-box"]').click();
        cy.get('three-lunchbox').then(lb => {
            const scene = (lb.get(0) as unknown as ThreeLunchbox).three.scene;
            expect(scene.children.length).to.eq(2);
        });
        cy.get('button[data-name="add-box"]').click();
        cy.get('three-lunchbox').then(lb => {
            const scene = (lb.get(0) as unknown as ThreeLunchbox).three.scene;
            expect(scene.children.length).to.eq(3);
        });

        // remove a box, ensure scene child count updates
        cy.get('button[data-name="remove-box-0"]').click();
        cy.get('three-lunchbox').then(lb => {
            const scene = (lb.get(0) as unknown as ThreeLunchbox).three.scene;
            expect(scene.children.length).to.eq(2);
        });

    });

});