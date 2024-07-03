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

        // add image of black rectangle
        (mat.get(0) as unknown as HTMLElement).innerHTML = `<texture-loader
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAABNJREFUCB1jZGBg+A/EDEwgAgQADigBA//q6GsAAAAASUVORK5CYII%3D"
                    attach="map"></texture-loader>`;
      });

      // ensure instance map is updated
      cy.get('mesh-basic-material').then(mat => {
        cy.wrap(mat.get(0))
          .should('have.a.property', 'instance')
          .should('have.a.property', 'map')
          .should('have.a.property', 'isTexture')
          .should('be.true');
      });

      // ensure texture is accessible in loader
      cy.get('texture-loader').then(loader => {
        // ensure the loaded content is the instance
        cy.wrap(loader.get(0))
          .should('have.a.property', 'instance')
          .should('have.a.property', 'isTexture')
          .should('be.true');

        // ensure the loader is accessible
        cy.wrap(loader.get(0))
          .should('have.a.property', 'loader')
          .should('have.a.property', 'load');

        // ensure the loaded content is starting with the correct property
        cy.wrap(loader.get(0))
          .should('have.a.property', 'instance')
          .should('have.a.property', 'anisotropy')
          .should('eq', 1)
          .then(() => {
            // update anisotropy
            (loader.get(0) as unknown as HTMLElement).setAttribute('anisotropy', '32');
          });

        cy.wrap(loader.get(0))
          .should('have.a.property', 'instance')
          .should('have.a.property', 'anisotropy')
          .should('eq', 32);
      });
    });
  });
});