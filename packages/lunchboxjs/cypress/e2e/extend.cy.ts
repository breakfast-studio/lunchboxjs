import { Lunchbox, ThreeLunchbox, extend } from "../../src";
import type * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { IsClass } from "../../src/utils";
// import { Vector3 } from "three";

describe('vanilla HTML spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/cypress/pages/core.html');
  });

  it('handles an extend call', () => {
    // orbit-controls shouldn't exist as a custom element yet, but three-lunchbox should
    cy.window().then(async win => {
      cy.wrap(win).invoke('customElements.get', 'three-lunchbox').should('exist');
      cy.wrap(win).invoke('customElements.get', 'orbit-controls').should('not.exist');

      // extend...
      cy.wrap(win).then(() => {
        extend('orbit-controls', OrbitControls, win);
      });
      // ...and check
      cy.wrap(win).invoke('customElements.get', 'orbit-controls').should('exist');
    });
  });

  it('handles an incorrect extend call', () => {
    // orbit-controls shouldn't exist as a custom element yet, but three-lunchbox should
    cy.window().then(async win => {
      cy.wrap(win).invoke('customElements.get', 'three-lunchbox').should('exist');
      cy.wrap(win).invoke('customElements.get', 'orbit-controls').should('not.exist');

      // handle incorrect extension
      expect(() => extend('incorrect-extension', {} as IsClass, win)).to.throw();
    });
  });
});