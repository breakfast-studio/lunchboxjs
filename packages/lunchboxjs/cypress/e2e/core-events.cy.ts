import { ThreeIntersectEvent } from "../../src";

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

  // it('fires the native pointer/mouse enter and leave events correctly', () => {
  //   // POINTER
  //   // pointer miss the target
  //   cy.get('three-lunchbox').trigger('pointermove', 'topLeft');
  //   cy.get('@consoleLog').should('not.be.calledWith', 'pointer enter');
  //   cy.get('@consoleLog').should('not.be.calledWith', 'pointer leave');

  //   // pointer move over the target
  //   cy.get('three-lunchbox').trigger('pointermove', 'center');
  //   cy.get('@consoleLog').should('be.calledWith', 'pointer enter');

  //   // pointer leave the target
  //   cy.get('three-lunchbox').trigger('pointermove', 'topLeft');
  //   cy.get('@consoleLog').should('be.calledWith', 'pointer leave');

  //   // MOUSE
  //   // mouse miss the target
  //   cy.get('three-lunchbox').trigger('mousemove', 'topLeft');
  //   cy.get('@consoleLog').should('not.be.calledWith', 'mouse enter');
  //   cy.get('@consoleLog').should('not.be.calledWith', 'mouse leave');

  //   // mouse move over the target
  //   cy.get('three-lunchbox').trigger('mousemove', 'center');
  //   cy.get('@consoleLog').should('be.calledWith', 'mouse enter');

  //   // mouse leave the target
  //   cy.get('three-lunchbox').trigger('pointermove', 'topLeft');
  //   cy.get('@consoleLog').should('be.calledWith', 'pointer leave');
  // });

  // it('fires the Lunchbox enter and leave events correctly', () => {
  //   expect(false).to.eq(true);
  //   // TODO: write these tests
  //   // POINTER
  //   // // pointer miss the target
  //   // cy.get('three-lunchbox').trigger('pointermove', 'topLeft');
  //   // cy.get('@consoleLog').should('not.be.calledWith', 'pointer enter');
  //   // cy.get('@consoleLog').should('not.be.calledWith', 'pointer leave');

  //   // // pointer move over the target
  //   // cy.get('three-lunchbox').trigger('pointermove', 'center');
  //   // cy.get('@consoleLog').should('be.calledWith', 'pointer enter');

  //   // // pointer leave the target
  //   // cy.get('three-lunchbox').trigger('pointermove', 'topLeft');
  //   // cy.get('@consoleLog').should('be.calledWith', 'pointer leave');

  //   // // MOUSE
  //   // // mouse miss the target
  //   // cy.get('three-lunchbox').trigger('mousemove', 'topLeft');
  //   // cy.get('@consoleLog').should('not.be.calledWith', 'mouse enter');
  //   // cy.get('@consoleLog').should('not.be.calledWith', 'mouse leave');

  //   // // mouse move over the target
  //   // cy.get('three-lunchbox').trigger('mousemove', 'center');
  //   // cy.get('@consoleLog').should('be.calledWith', 'mouse enter');

  //   // // mouse leave the target
  //   // cy.get('three-lunchbox').trigger('pointermove', 'topLeft');
  //   // cy.get('@consoleLog').should('be.calledWith', 'pointer leave');
  // });

});