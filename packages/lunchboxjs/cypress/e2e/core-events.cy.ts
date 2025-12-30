import { ThreeIntersectEvent, ThreeLunchbox } from "../../src";
import * as THREE from 'three';

describe('vanilla HTML spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/cypress/pages/core-events.html', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });

  it('fires the custom click event correctly', () => {
    cy.window().then(win => {
      cy.get('three-mesh[data-name="base"]').then(async c => {
        // add threeclick listener as custom value
        c.get(0).addEventListener('threeclick', (evt) => {
          const event = evt as CustomEvent<ThreeIntersectEvent>;
          win.console.log(event.detail.element?.getAttribute('data-name'));
          expect(event.detail.intersect.point.toArray()).to.deep.eq([0, 0, -4.0205678939819345]);
        });
      });
    });
    cy.get('three-lunchbox').trigger('click', 'center');
    cy.get('@consoleLog').should('be.calledWith', 'base');
  });

  it('fires the native click event correctly', () => {
    // miss the target
    cy.get('three-lunchbox').trigger('click', 'topLeft');
    cy.get('@consoleLog').should('not.be.called');

    // click the target
    cy.get('three-lunchbox').trigger('click', 'center');
    cy.get('@consoleLog').should('be.calledWith', 'clicked');
  });

  it('fires the native pointer/mouse move events correctly', () => {
    // POINTER
    // miss the target
    cy.get('three-lunchbox').trigger('pointermove', 'topLeft');
    cy.get('@consoleLog').should('not.be.calledWith', 'pointer moved');

    // move over the target
    cy.get('three-lunchbox').trigger('pointermove', 'center');
    cy.get('@consoleLog').should('be.calledWith', 'pointer moved');

    // MOUSE
    // miss the target
    cy.get('three-lunchbox').trigger('mousemove', 'topLeft');
    cy.get('@consoleLog').should('not.be.calledWith', 'mouse moved');

    // move over the target
    cy.get('three-lunchbox').trigger('mousemove', 'center');
    cy.get('@consoleLog').should('be.calledWith', 'mouse moved');
  });

  it('fires the custom instancecreated event correctly', () => {
    let lb: ThreeLunchbox;

    cy.get('three-lunchbox').then(lunchbox => {
      lb = lunchbox.get(0) as unknown as ThreeLunchbox;
    });
    cy.window().then(win => {
      const el = win.document.createElement('three-mesh');
      el.addEventListener('instancecreated', evt => {
        win.console.log((evt.detail.instance as THREE.Mesh).type);
      });
      lb.appendChild(el as unknown as Node);
    });
    cy.get('@consoleLog').should('be.calledWith', 'Mesh');
  });

});