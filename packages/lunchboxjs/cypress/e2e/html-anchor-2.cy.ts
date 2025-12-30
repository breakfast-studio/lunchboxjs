describe('html-anchor spec 2', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/cypress/pages/html-anchor-2.html', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });

  it('passes the correct values from `html-anchor`', () => {
    cy.get('[data-test-id="label"]').then(([c]) => {
      const style = (c as unknown as HTMLElement).style;
      expect(style.getPropertyValue('--top')).to.eq('55.45161940738191px');
      expect(style.getPropertyValue('--left')).to.eq('189.09676118523618px');
    })
  });
});