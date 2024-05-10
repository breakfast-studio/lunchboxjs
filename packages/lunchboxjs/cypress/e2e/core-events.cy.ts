import { Lunchbox, ThreeIntersectEvent, ThreeLunchbox } from "../../src";
import type * as THREE from 'three';
import { Vector3 } from "three";

describe('vanilla HTML spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/cypress/pages/core-events.html', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });


  it('fires the native click event correctly', () => {
    // miss the target
    cy.get('three-lunchbox').trigger('click', 'topLeft');
    cy.get('@consoleLog').should('not.be.called');

    // click the target
    cy.get('three-lunchbox').trigger('click', 'center');
    cy.get('@consoleLog').should('be.calledWith', 'clicked');
  });

  it('fires the custom click event correctly', () => {
    cy.get('three-mesh[data-name="base"]').then(async c => {
      // add threeclick listener as custom value
      c.get(0).addEventListener('threeclick', (evt) => {
        const event = evt as CustomEvent<ThreeIntersectEvent>;
        expect(event.detail.element?.getAttribute('data-name')).to.eq('base');
        expect(event.detail.intersect.point.toArray()).to.deep.eq([0, 0, -4.0205678939819345]);
      });
    });
  });
});