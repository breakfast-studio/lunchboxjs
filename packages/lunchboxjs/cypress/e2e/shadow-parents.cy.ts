import { ThreeLunchbox } from "../../src";

describe('shadow-parent spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/cypress/pages/shadow-parent.html', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });

  it('renders children in shadow DOMs', () => {
    cy.get('three-lunchbox').then(([c]) => {
      const scene = (c as unknown as ThreeLunchbox)?.three.scene;
      expect(scene.type).to.eq('Scene');
      expect(scene.children.length).to.eq(2);
    })
  });
});