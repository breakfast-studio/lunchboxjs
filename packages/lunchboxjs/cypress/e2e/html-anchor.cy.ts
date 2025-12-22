describe('html-anchor spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/cypress/pages/html-anchor.html', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });

  it('passes the correct values from `html-anchor`', () => {
    cy.get('[data-test-id="label"]').then(([c]) => {
      const style = (c as unknown as HTMLElement).style;
      expect(style.getPropertyValue('--top')).to.eq('75px');
      expect(style.getPropertyValue('--left')).to.eq('150px');
    })
  });
});