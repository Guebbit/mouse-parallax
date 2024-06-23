import mouseParallax, { type IMouseParallax } from '../../src/index';

// elements of the parallax
let children: HTMLElement[];
// MouseParallax instance
let mpInstance: IMouseParallax;

/**
 * Built-in delay after each call
 * @param x
 * @param y
 */
function moveHelper(x = 0, y = 0) {
  mpInstance.move(x, y);
  return cy.wait(200);
}


describe('Fake broken glass from shot (remember to check the "Free movement" test)', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/shoteffect.html');

    cy.document()
      .then($document => {
        cy.get('#parallax-object')
          .then($element => {
            children = $element.children().toArray();
            mpInstance = mouseParallax(children, $element[0], $document);
          });

        // starting point
        cy.get('#parallax-object')
          .centerMouse();
      });
  });

  it('Shot effects', () => {
    // first movement
    moveHelper(500, 500)
      .then(() =>
        cy.checkParallaxPosition(children, [
          [
            "depth-1",
            "50%",
            "47.875%",
          ],
          [
            "depth-2",
            "50%",
            "39.375%",
          ],
          [
            "depth-3",
            "50%",
            "28.75%",
          ],
          [
            "follow-text",
            "50%",
            "71.25%",
          ],
          [
            "center-point",
            "50%",
            "50%",
          ]
        ])
      )
      // second movement
      .then(() => moveHelper(500, 1000))
      .then(() =>
        cy.checkParallaxPosition(children, [
          [
            "depth-1",
            "50%",
            "41.625%",
          ],
          [
            "depth-2",
            "50%",
            "8.125%",
          ],
          [
            "depth-3",
            "50%",
            "-33.75%",
          ],
          [
            "follow-text",
            "50%",
            "133.75%",
          ],
          [
            "center-point",
            "50%",
            "50%",
          ]
        ])
      )
      // third movement
      .then(() => moveHelper(1000, 500))
      .then(() =>
        cy.checkParallaxPosition(children, [
          [
            "depth-1",
            "43.75%",
            "47.875%",
          ],
          [
            "depth-2",
            "18.75%",
            "39.375%",
          ],
          [
            "depth-3",
            "-12.5%",
            "28.75%",
          ],
          [
            "follow-text",
            "112.5%",
            "71.25%",
          ],
          [
            "center-point",
            "50%",
            "50%",
          ]
        ])
      )
      // fourth movement
      .then(() => moveHelper(-500, -500))
      .then(() =>
        cy.checkParallaxPosition(children, [
          [
            "depth-1",
            "62.5%",
            "60.375%",
          ],
          [
            "depth-2",
            "112.5%",
            "101.875%",
          ],
          [
            "depth-3",
            "175%",
            "153.75%",
          ],
          [
            "follow-text",
            "-75%",
            "-53.75%",
          ],
          [
            "center-point",
            "50%",
            "50%",
          ]
        ])
      )
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
