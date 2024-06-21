import mouseParallax from '../../src/index';

describe('Fake broken glass from shot (remember to check the "Free movement" test)', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/shoteffect.html');
    // starting point
    cy.get('#parallax-object')
      .centerMouse();
  });

  // TODO CHECK OTHERS
  it('Shot effects', () => {
    cy.document()
      .then($document => {
        // first movement
        cy.get('#parallax-object')
          .then($element => {
            const children = $element.children().toArray();
            mouseParallax(children, $element[0], $document)?.move(500, 500);

            cy.checkElementPosition(children, "depth-1")
              .then(([top, left]) => {
                expect(top).to.equal('47.875%');
                expect(left).to.equal('50%');
            })
          });
        // second movement
        // cy.wait(1000)
        cy.get('#parallax-object')
          .then($element => {
            const children = $element.children().toArray();
            mouseParallax(children, $element[0], $document)?.move(500, 1000);

            cy.checkElementPosition(children, "depth-1")
              .then(([top, left]) => {
                expect(top).to.equal('41.625%');
                expect(left).to.equal('50%');
              })
          });
        // third movement
        // cy.wait(1000)
        cy.get('#parallax-object')
          .then($element => {
            const children = $element.children().toArray();
            mouseParallax(children, $element[0], $document)?.move(500, -500);

            cy.checkElementPosition(children, "depth-1")
              .then(([top, left]) => {
                expect(top).to.equal('60.375%');
                expect(left).to.equal('50%');
              })
          });
      });
  });

  /**
   * Manual test
   */
  it('Free movement', () => {
    cy.document()
      .then($document =>
        cy.get('#parallax-object')
          .then($element => {
            mouseParallax($element.children().toArray(), $element[0], $document)?.build(200);
          })
      );
  });
})
