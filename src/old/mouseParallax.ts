import { throttle } from 'lodash';
import executeMouseParallax from './executeMouseParallax';
import createMouseParallaxItem from './createMouseParallaxItem';

/**
 * Intensity of movement based on mouse movement speed
 * User decide how much mouse speed is reflected in X or Y axis
 * 0 = stopped, 100 = follow mouse (default), 200 = double
 */
export interface IMouseParallaxInstructions {
  element: HTMLElement  // target element
  intensityX: number    // X axis
  intensityY: number    // Y axis
  speed: number         // current mouse speed
}

/**
 *
 */
export interface IMouseParallax {
  container :HTMLElement
  items :IMouseParallaxInstructions[]
  css: (instructions: Record<string, string>) => void,
  move: (clientX: number, clientY: number) => this
  build :(throttleIntensity?: number, css?: boolean) => this
}


/**
 * ALL IN ONE mouse parallax movements, calculation and application through mouse and touch events
 * Get values from function or from dataset in element
 *
 * @param anchors - elements to move
 * @param container - parent, used as container \ limit
 * @param $document - needed in some cases, like cypress tests
 * @return object to control the parallax
 */
export default (anchors: HTMLElement[] = [], container: HTMLElement | null = null, $document = document): IMouseParallax | undefined => {
  // no elements no parallax
  if(anchors.length <= 0)
    return;

  // default parent = element parent
  if (!container && anchors[0])
    container = anchors[0].parentElement;

  // no container, no parallax
  if(!container)
    return;

  // create IMouseParallaxInstructions objects (all calculations done here 1 time)
  const parallaxArray :IMouseParallaxInstructions[] = [];
  for (let i = anchors.length; i--; )
    // instruction objects for every anchor
    if(anchors[i] && Object.keys(anchors[i].dataset).length > 0)
      parallaxArray.push(createMouseParallaxItem(anchors[i]));

  return {
    container,
    items: parallaxArray,

    css: function(instructions: Record<string, string>){
      for (let i = this.items.length; i--; )
        if(this.items[i] && this.items[i].element)
          Object.assign(this.items[i].element.style, instructions);
    },

    /**
     * Single movement in the chosen direction
     * @param clientX
     * @param clientY
     */
    move: function(clientX = 0, clientY = 0){
      executeMouseParallax(this, clientX, clientY);
      return this;
    },

    /**
     *
     * @param throttleIntensity - how fluid is the movement (takes up memory resources)
     * @param css
     */
    build: function(throttleIntensity = 20, css = false) {
      // apply CSS if requested
      if(css)
        this.css({
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        });
      // create event listeners
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const obj = this;
      $document.addEventListener("mousemove", throttle(function({ clientX, clientY }: MouseEvent) :void {
        executeMouseParallax(obj, clientX, clientY);
      }, throttleIntensity))
      $document.addEventListener("touchmove", throttle(function({ changedTouches }: TouchEvent) :void {
        // touch points can be more than 1, select only the first
        if(!changedTouches || changedTouches.length <= 0)
          return;
        executeMouseParallax(obj, changedTouches[0].pageX, changedTouches[0].pageY);
      }, throttleIntensity));
      return this;
    }
  };
};
