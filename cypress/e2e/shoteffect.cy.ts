import MouseParallax from '../../src';

// elements of the parallax
let children: HTMLElement[];
// MouseParallax instance
let mpInstance: MouseParallax;

/**
 * Built-in delay after each call
 * @param x
 * @param y
 */
function moveHelper(x = 0, y = 0) {
  mpInstance.execute(x, y);
  return cy.wait(200);
}


describe('Fake broken glass from shot (remember to check the "Free movement" test)', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/shoteffect.html');

    cy.get('#parallax-object')
      .then($element => {
        // Parallax elements
        children = $element.children().toArray();
        // MouseParallax instance
        mpInstance = new MouseParallax(children, $element[0]);
        mpInstance.build();
      });
    // starting point
    cy.get('#parallax-object')
      .centerMouse();
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
            "70%",  // because it's capped with limit = 20
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
            "70%",  // because it's capped with limit = 20
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
            "70%", // capped
            "70%", // capped
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
            "30%",
            "30%",
          ],
          [
            "center-point",
            "50%",
            "50%",
          ]
        ])
      )
      // stop and try to move
      .then(() => {
        mpInstance.stop();
        return moveHelper(5000, 5000);
      })
      .then(() =>
        // same position as before
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
            "30%",
            "30%",
          ],
          [
            "center-point",
            "50%",
            "50%",
          ]
        ])
      )
  });

  it('Change single item rules', () => {
    // change rules for depth-1
    mpInstance.items[0].intensityX = 10;
    mpInstance.items[0].intensityY = 10;
    mpInstance.reload();
    moveHelper(500, 500)
      .then(() =>
        cy.checkParallaxPosition(children, [
          // position way farther than normal (10x times intensity)
          [
            "depth-1",
            "50%",
            "262.5%",
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
            "70%", // capped
          ],
          [
            "center-point",
            "50%",
            "50%",
          ]
        ])
      )
  });

  it('Change global rules', () => {
    mpInstance.globals.intensityX = 0.1;
    mpInstance.globals.intensityY = 0.1;
    mpInstance.reload();
    // position of all items barely moved (10% of intensity)
    moveHelper(500, 500)
      .then(() =>
        cy.checkParallaxPosition(children, [
          [
            "depth-1",
            "50%",
            "49.7875%",
          ],
          [
            "depth-2",
            "50%",
            "48.9375%",
          ],
          [
            "depth-3",
            "50%",
            "47.875%",
          ],
          [
            "follow-text",
            "50%",
            "52.125%",
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
   * WARNING: throttle change trigger reloadListeners without $document so the event isn't properly removed
   * So, only in this test, changing speed from fast to slow doesn't "work"
   */
  it('Free movement', () => {
    cy.document()
      .then($document => {
        mpInstance.throttle = 500;
        mpInstance.createListeners($document);

        setTimeout(() => {
          console.log("Throttle change")
          mpInstance.throttle = 50;
          mpInstance.reloadListeners($document);
        }, 2000)
      });
  });
});
