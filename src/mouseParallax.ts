import { throttle } from 'lodash';
import { eventDelegate } from '@guebbit/js-toolkit';
import executeMouseParallax, { type IMouseParallaxMap } from './executeMouseParallax';
import createMouseParallaxItem, { type IMouseParallaxItemsMap } from './createMouseParallaxItem';


/**
 *
 *
 *
 *  @param {HTMLElement[]} anchors - elements to move
 *  @param {HTMLElement} parent - frame \ limits
 *  @param {document} $document
 *
 *  @return {Object} - object to control the parallax
 */

/**
 * ALL IN ONE mouse parallax movements, calculation and application through mouse and touch events
 * Get values from function or from dataset in element
 *
 * @param anchors - elements to move
 * @param parent - container \ limit
 * @param $document - needed in some cases, like tests
 */
export default (anchors: HTMLElement[] = [], parent: HTMLElement | null = null, $document = document): IMouseParallaxMap | undefined => {
  // no elements no parallax
  if(anchors.length <= 0)
    return;

  // default parent = element parent
  if (!parent && anchors[0])
    parent = anchors[0].parentElement;

  // create IMouseParallaxItemsMap objects (all calculations done here 1 time)
  const parallaxArray :IMouseParallaxItemsMap[] = [];
  for (let i = anchors.length; i--; ) {
    // instruction objects for every anchor
    parallaxArray.push(createMouseParallaxItem(anchors[i]!));
  }

  return {
    container: parent!,
    items: parallaxArray,
    /**
     *
     * @param {boolean} css
     * @param {number} throttleIntensity - how fluid is the movement (takes up memory resources)
     */
    build: function(css = false, throttleIntensity = 20) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const obj = this;
      if(css){
        // loop through items to apply CSS (if needed)
        for (let i = obj.items.length; i--; ) {
          if(!obj.items[i])
            continue;
          const { element } = obj.items[i]!;
          // apply CSS
          element.style.position = 'absolute';
          element.style.left = '50%';
          element.style.top = '50%';
          element.style.transform = 'translate(-50%, -50%)';
        }
      }
      // insert Events
      eventDelegate('mousemove', obj.container, throttle(function(e) :void {
        executeMouseParallax(obj, e.clientX, e.clientY);
      }, throttleIntensity), $document);
      eventDelegate('touchmove', obj.container, throttle(function(e) :void {
        // touch points can be more than 1, select only the first
        if(!e.changedTouches || e.changedTouches.length <= 0){
          return;
        }
        executeMouseParallax(obj, e.changedTouches[0].pageX, e.changedTouches[0].pageY);
      }, throttleIntensity), $document);
    }
  };
};
