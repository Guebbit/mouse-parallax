import calculateMouseParallax from "./calculateMouseParallax";
// TODO watchers - check su speed, intensità, etc per vedere se vengono cambiati dei valori, poi ritriggerare eventuali "build" sull'elemento
import type { IMouseParallaxItemsMap } from './createMouseParallaxItem';

export interface IMouseParallaxMap {
  container :HTMLElement
  items :IMouseParallaxItemsMap[]
  build :(css?: boolean, throttleIntensity?: number) => void
}

/**
 *
 * @param container
 * @param items
 * @param {number} x - mouse/touch position X axis
 * @param {number} y - mouse/touch position Y axis
 */
export default ({ container, items = [] } :IMouseParallaxMap, x = 0, y = 0) => {
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
