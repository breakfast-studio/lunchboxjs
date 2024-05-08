describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('passes', () => {
    expect(2 + 1).to.equal(3);
  });
});