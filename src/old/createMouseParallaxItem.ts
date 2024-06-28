import { getDatasetInstructions, type IMouseParallaxInstructions } from './index';

/**
 * Create mouse Parallax Item
 * Take data from dataset (if populated)
 * TODO create from data
 *
 * @param element - element where extract dataset
 * @return IMouseParallaxInstructions object
 */
export default (element :HTMLElement) :IMouseParallaxInstructions => {
  const instructions = getDatasetInstructions(element);

  if(instructions.speed){
    // pre existing transitions
    const { transition } = getComputedStyle(element);
    // apply speed
    element.style.transition = transition + ', top ' + instructions.speed + 'ms, left ' + instructions.speed + 'ms';
  }

  // return values
  return {
    ...instructions,
    element
  }
};
