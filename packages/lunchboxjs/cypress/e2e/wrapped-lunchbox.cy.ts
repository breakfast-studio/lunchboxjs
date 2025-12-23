import { ThreeLunchbox } from "../../src";

describe('shadow-parent spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/cypress/pages/wrapped-lunchbox.html', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });

  it('renders children in shadow DOMs', () => {
    cy.wait(1000);
    cy.get('wrapped-lunchbox').then(([c]) => {
      
      const lunchbox = (c as Element).shadowRoot?.querySelector('three-lunchbox') as unknown as ThreeLunchbox 
      const scene = lunchbox?.three.scene;
      expect(scene.type).to.eq('Scene');
      expect(scene.children.length).to.eq(2);
    })
  });
});