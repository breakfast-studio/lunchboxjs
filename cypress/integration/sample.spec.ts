describe('sample', () => {
    it('visits the page', () => {
        cy.visit('/demo/events/')
        cy.get('canvas').trigger('mousemove', 250, 330)
        cy.wait(16.666)
        cy.matchImageSnapshot()
    })
})
