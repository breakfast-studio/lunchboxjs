import { ThreeLunchbox } from "../../src";

describe('vanilla HTML spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/cypress/pages/loader.html');
  });

  it('loads and sets up a basic scene', () => {
    cy.get('three-lunchbox').then(c => {
      const lb = c[0] as unknown as ThreeLunchbox;
      // ensure scene has correct number of children
      expect(lb.three.scene.children).to.have.length(1);
      // ensure material has no map
      cy.get('mesh-basic-material').then(mat => {
        cy.wrap(mat.get(0))
          .should('have.a.property', 'instance')
          .should('have.a.property', 'map')
          .should('not.exist');

        (mat.get(0) as unknown as HTMLElement).innerHTML = `                <texture-loader
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAABNJREFUCB1jZGBg+A/EDEwgAgQADigBA//q6GsAAAAASUVORK5CYII%3D"
                    attach="map"></texture-loader>`;
      });
      cy.get('mesh-basic-material').then(mat => {
        cy.wrap(mat.get(0))
          .should('have.a.property', 'instance')
          .should('have.a.property', 'map')
          .should('have.a.property', 'isTexture')
          .should('be.true');
      });
    });
  });
});