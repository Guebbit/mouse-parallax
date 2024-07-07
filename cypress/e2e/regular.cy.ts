import MouseParallax from '../../src';

describe('Every possible combination (remember to check the "Free movement" test)', () => {

  beforeEach(() => {
    cy.visit('http://localhost:8080/random.html');
    // starting point
    cy.get('#parallax-object')
      .centerMouse();
  });

  it('Check if everything work as intended at functional level', () => {
    cy.get('#parallax-object')
      .then($element => {
        // MouseParallax instance
        const mpInstance = new MouseParallax($element.children().toArray());
        // it will not work since cypress doesn't use document, need custom cypress' $document implementation
        mpInstance.build();
        // custom move function (no arrow function, context is necessary)
        mpInstance.move = function(x, y) {
          // custom part
          console.log("customized move", x, y);
          // true movement
          this.execute(x, y);
          // needed to maintain chain
          return this;
        }
        // some methods
        cy.document()
          .then($document => mpInstance.createListeners($document))
          .then(() => {
            // it will be outside the container, so it will not work correctly
            cy.get("#custom-rule-element")
              .then($element => {
                mpInstance.addItem($element[0], {
                  speed: 1000
                });
                // check in last position for the newly added element
                cy.wrap(mpInstance.items[mpInstance.items.length - 1].element).should('have.id', 'custom-rule-element');
                // change rules for the first element
                mpInstance.editItem(0, {
                  speed: 10000
                });
                // this is valid too, but reload is needed afterward
                mpInstance.items[0].speed = 5000;
                mpInstance.reload();
                // change globals
                mpInstance.globals.intensityX = 0.1;
                mpInstance.globals.intensityY = 0.1;
                mpInstance.reload();
              })
          });
        // Check that instance is valid
        expect(mpInstance).to.be.instanceOf(MouseParallax);
      });
  });
});
