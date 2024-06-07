describe('vanilla HTML spec', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/cypress/pages/docs-examples.html');
    });

    it('ensures named color example works', () => {
        cy.window().then(win => {
            const wrapper = win.document.createElement('three-lunchbox');
            wrapper.setAttribute('background', 'blue');
            win.document.body.appendChild(wrapper as unknown as Node);


        });
        cy.get('three-lunchbox').then(lb => {
            cy.wrap(lb.get(0))
                .should('have.a.property', 'three')
                .should('have.a.property', 'scene')
                .should('have.a.property', 'background')
                .then(color => color.toArray())
                .should('deep.equal', [0, 0, 1]);
        });
    });

    it('ensures hex color example works', () => {
        cy.window().then(win => {
            const wrapper = win.document.createElement('three-lunchbox');
            wrapper.setAttribute('background', '#0f0');
            win.document.body.appendChild(wrapper as unknown as Node);
        });
        cy.get('three-lunchbox').then(lb => {
            cy.wrap(lb.get(0))
                .should('have.a.property', 'three')
                .should('have.a.property', 'scene')
                .should('have.a.property', 'background')
                .then(color => color.toArray())
                .should('deep.equal', [0, 1, 0]);
        });
    });

    it('ensures camera nested position works', () => {
        cy.window().then(win => {
            const wrapper = win.document.createElement('three-lunchbox');
            wrapper.setAttribute('camera', '{\'position-z\': 5}');
            win.document.body.appendChild(wrapper as unknown as Node);
        });
        cy.get('three-lunchbox').then(lb => {
            cy.wrap(lb.get(0))
                .should('have.a.property', 'three')
                .should('have.a.property', 'camera')
                .should('have.a.property', 'position')
                .should('have.a.property', 'z')
                .should('equal', 5);
        });
    });

    it('ensures camera explicit position works', () => {
        cy.window().then(win => {
            const wrapper = win.document.createElement('three-lunchbox');
            wrapper.setAttribute('camera', '{\'position\': [1, 2, 3]}');
            win.document.body.appendChild(wrapper as unknown as Node);
        });
        cy.get('three-lunchbox').then(lb => {
            cy.wrap(lb.get(0))
                .should('have.a.property', 'three')
                .should('have.a.property', 'camera')
                .should('have.a.property', 'position')
                .then(pos => pos.toArray())
                .should('deep.equal', [1, 2, 3]);
        });
    });
});