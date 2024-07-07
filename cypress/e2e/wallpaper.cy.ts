import MouseParallax from '../../src';


// elements to dynamically add
const parallaxImages = [
  // background has to stay still (better to NOT include this image into the parallax)
  {
    src: "images/rogh-parallax-0.png",
    intensity: 0,
  },
  {
    src: "images/rogh-parallax-1.png",
    intensity: 0.5,
    speed: 20000
  },
  {
    src: "images/rogh-parallax-2.png",
    intensity: 1,
    speed: 10000
  },
  {
    src: "images/rogh-parallax-3.png",
    intensityx: 1,
    intensityy: 0.5,
    speed: 20000
  },
  {
    src: "images/rogh-parallax-4.png",
    intensityx: 1,
    intensityy: 0.5,
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
   * WARNING: throttle change trigger reloadListeners without $document so the event isn't properly removed
   * So, only in this test, changing speed from fast to slow doesn't "work"
   */
  it('Free movement', () => {
    cy.addImages('#parallax-object', parallaxImages)
      .then(() => cy.get('#parallax-object'))
      .then($element => {
        const elements = $element.children().toArray();
        // NOT include the background in the parallax
        elements.shift();
        // This class adds +10% size to hide the borders during movement limited to 5% (it has to be max half)
        $element[0].classList.add('wallpaper-mode');
        // limit of 5% movement (so it doesn't show since we enlarged the items by 10%)
        const mpInstance = new MouseParallax(elements,{
          limitX: 5,
          limitY: 5,
        });
        mpInstance.build();
        cy.document()
          .then($document => mpInstance.createListeners($document));
      });
  });
});



/*
    mounted() {
    // init
    this.parallax = mouseParallax(this.$refs["parallax-items"]);
    // Fade in background
    setTimeout(() => {
      this.$refs["hero-header"].classList.add("present-rogheneach");
    }, 1000);
    // Move in single direction, ignoring the mouse
    setTimeout(() => {
      executeMouseParallax(this.parallax, 40, 1200)
    }, 2000);
    // Activate true mouse parallax after speeding up all parallax-layers
    setTimeout(() => {
      // speed up all elements
      for(let i = this.headerImages.length; i--; )
        // this.headerImages[i].speed = this.headerImages[i].speed / 10;
        this.$set(this.headerImages[i], 'speed', this.headerImages[i].speed / 20)
      // update with the new values
      // this.$forceUpdate();
      // after changes
      this.$nextTick(() => {
        // re init is needed
        this.parallax = mouseParallax(this.$refs["parallax-items"]);
        // unlock
        this.activatedParallax = true;
      })
    }, 8000);
  }
 */
