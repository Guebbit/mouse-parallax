import mouseParallax from '../../src/index';


// elements to dynamically add
const parallaxImages = [
  {
    src: "images/rogh-parallax-0.png",
    intensity: 0
  },
  {
    src: "images/rogh-parallax-1.png",
    intensity: 5,
    speed: 20000
  },
  {
    src: "images/rogh-parallax-2.png",
    intensity: 10,
    speed: 10000
  },
  {
    src: "images/rogh-parallax-3.png",
    intensityx: 10,
    intensityy: 5,
    speed: 20000
  },
  {
    src: "images/rogh-parallax-4.png",
    intensityx: 10,
    intensityy: 5,
    speed: 20000
  }
];

describe('Animated wallpaper ("Free movement" only)', () => {

  beforeEach(() => {
    cy.visit('http://localhost:8080/empty.html');
    cy.get('#parallax-object')
      .centerMouse();
  });

  /**
   * Manual test
   */
  it('Free movement', () => {
    cy.document()
      .then($document => {
        cy.addImages('#parallax-object', parallaxImages)
          .then((elements = []) => {
            const parallaxObject = mouseParallax(elements, null, $document);
            if(!parallaxObject)
              return;
            parallaxObject.build();
          });
        cy.get('#parallax-object')
          .then($element => {
            mouseParallax($element.children().toArray(), $element[0], $document)?.build(200);
          })
        }
      );
  });
});
