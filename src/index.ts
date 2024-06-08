import { throttle } from 'lodash';
import { addEvent } from '../../../index';

export interface mouseParallaxItemsMap {
  element: HTMLElement
  intensityX: number
  intensityY: number
  speed: number
}

// TODO watchers - check su speed, intensità, etc per vedere se vengono cambiati dei valori, poi ritriggerare eventuali "build" sull'elemento
export interface mouseParallaxMap {
  container :HTMLElement
  items :mouseParallaxItemsMap[]
  build :(css: boolean, throttleIntensity: number) => void
}

/**
 * Calculate the parallax movement based on x\y axis of the movement (mouse, touch or custom)
 * and the width & height of container element (usually the direct parent of the anchors)
 *
 * @param {number} x - axis X (mouse, touch, custom)
 * @param {number} y - axis Y (mouse, touch, custom)
 * @param {number} w - width of parent container
 * @param {number} h - height of parent container
 *
 * @return {number[]} - new X and Y positions calculated on the parent container
 */
export const calculateMouseParallax = (x = 0, y = 0, w = 0, h = 0) :[number, number] => {
  return [
    ((x - w / 2) / w),
    ((y - h / 2) / h)
  ];
};

/**
 *
 * @param container
 * @param items
 * @param {number} x - mouse/touch position X axis
 * @param {number} y - mouse/touch position Y axis
 */
export const executeMouseParallax = ({ container, items = [] } :mouseParallaxMap, x = 0, y = 0) => {
  // width and height of parent
  const { offsetWidth, offsetHeight } = container;
  // parent position
  const { left: parentPositionLeft, top: parentPositionTop } = container.getBoundingClientRect();
  // calculate the positions of pointer related to the element position
  const [ cx, cy ] = calculateMouseParallax(x - parentPositionLeft, y - parentPositionTop, offsetWidth, offsetHeight);
  // execute movements on all items (anchors)
  for (let i = 0; i < items.length; i++) {
    if(!items[i])
      continue;
    const { element, intensityX, intensityY } = items[i]!;
    // apply movement
    element.style.left = (cx * intensityX + 50) + '%';
    element.style.top = (cy * intensityY + 50) + '%';
  }
};

/**
 * Create mouse Parallax Item
 * Take data from dataset
 *
 * @param {HTMLElement} element - element where extract dataset
 */
export const createMouseParallaxItem = (element :HTMLElement) :mouseParallaxItemsMap => {
  // intensity of movement, default = 100
  // 0 = stopped, 100 = follow mouse, 200 = double, etc
  let intensityX = 100;
  let intensityY = 100;
  let speed = 0;
  let tempValue :number;
  const { transition } = getComputedStyle(element);
  // if dataset is populated, I take the specific element instructions
  if (element.dataset) {
    // % generic intensity
    if (element.dataset['parallaxMovementIntensity']){
      tempValue = parseInt(element.dataset['parallaxMovementIntensity']!);
      if(Number.isInteger(tempValue)){
        intensityX = tempValue;
        intensityY = tempValue;
      }
    }
    // % intensity on X axis only
    if (element.dataset['parallaxMovementIntensityX']){
      tempValue = parseInt(element.dataset['parallaxMovementIntensityX']!);
      if(Number.isInteger(tempValue)){
        intensityX = tempValue;
      }
    }
    // % intensity on Y axis only
    if (element.dataset['parallaxMovementIntensityY']){
      tempValue = parseInt(element.dataset['parallaxMovementIntensityY']!);
      if(Number.isInteger(tempValue)){
        intensityY = tempValue;
      }
    }
    // milliseconds speed
    if (element.dataset['parallaxMovementSpeed']){
      tempValue = parseInt(element.dataset['parallaxMovementSpeed']!);
      if(Number.isInteger(tempValue)){
        speed = tempValue;
        element.style.transition = transition + ', top ' + speed + 'ms, left ' + speed + 'ms';
      }
    }
  }
  //
  return {
    element,
    intensityX,
    intensityY,
    speed
  }
};


/**
 *  ALL IN ONE mouse parallax movements, calculation and application throught mouse and touch events
 *  Get values from function or from dataset in element
 *
 *  @param {HTMLElement[]} anchors - elements to move
 *  @param {HTMLElement} parent - frame \ limits
 *  @param {document} $document
 *
 *  @return {Object} - object to control the parallax
 */
export default (anchors: HTMLElement[] = [], parent: HTMLElement | null = null, $document = document): mouseParallaxMap | undefined => {
  // no elements no parallax
  if(anchors.length <= 0) {
    return;
  }
  // default parent = element parent
  if (!parent && anchors[0])
    parent = anchors[0].parentElement;

  // create mouseParallaxItemsMap objects (all calculations done here 1 time)
  const parallaxArray :mouseParallaxItemsMap[] = [];
  for (let i = anchors.length; i--; ) {
    // instruction objects for every anchor
    parallaxArray.push(createMouseParallaxItem(anchors[i]!));
  }

  // controller
  const parallaxObject :mouseParallaxMap = {
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
      addEvent($document, 'mousemove', obj.container, throttle(function(e) :void {
        executeMouseParallax(obj, e.clientX, e.clientY);
      }, throttleIntensity));
      addEvent($document, 'touchmove', obj.container, throttle(function(e) :void {
        // touch points can be more than 1, select only the first
        if(!e.changedTouches || e.changedTouches.length <= 0){
          return;
        }
        executeMouseParallax(obj, e.changedTouches[0].pageX, e.changedTouches[0].pageY);
      }, throttleIntensity));
    }
  };

  // object
  return parallaxObject;
};
