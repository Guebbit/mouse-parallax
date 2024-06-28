import calculateMouseParallax from "./calculateMouseParallax";
import type { IMouseParallax } from './mouseParallax';


/**
 *
 * @param container
 * @param items
 * @param {number} x - mouse/touch position X axis, move the element on using left (50% default generally)
 * @param {number} y - mouse/touch position Y axis, move the element using top (50% default generally)
 */
export default ({ container, items = [] } :IMouseParallax, x = 0, y = 0) => {
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
    const { element, intensityX, intensityY } = items[i];
    // apply movement
    element.style.left = (cx * intensityX + 50) + '%';
    element.style.top = (cy * intensityY + 50) + '%';
  }
};
