/**
 * Intensity of movement based on mouse movement speed
 * User decide how much mouse speed is reflected in X or Y axis
 * 0 = stopped, 100 = follow mouse, 200 = double
 */
export interface IMouseParallaxItemsMap {
  element: HTMLElement  // target element
  intensityX: number    // X axis
  intensityY: number    // Y axis
  speed: number         // current mouse speed
}


/**
 * Create mouse Parallax Item
 * Take data from dataset
 *
 * @param {HTMLElement} element - element where extract dataset
 */
export default (element :HTMLElement) :IMouseParallaxItemsMap => {
  // intensity of movement, default = 100
  // 0 = stopped, 100 = follow mouse, 200 = double, etc
  let intensityX = 100;
  let intensityY = 100;
  let speed = 0;
  let tempValue :number;
  const { transition } = getComputedStyle(element);
  // if dataset is populated, I take the specific element instructions
  // % generic intensity
  if (element?.dataset['parallaxMovementIntensity']){
    tempValue = parseInt(element.dataset['parallaxMovementIntensity']);
    if(Number.isInteger(tempValue)){
      intensityX = tempValue;
      intensityY = tempValue;
    }
  }
  // % intensity on X axis only
  if (element?.dataset['parallaxMovementIntensityX']){
    tempValue = parseInt(element.dataset['parallaxMovementIntensityX']);
    if(Number.isInteger(tempValue))
      intensityX = tempValue;
  }
  // % intensity on Y axis only
  if (element?.dataset['parallaxMovementIntensityY']){
    tempValue = parseInt(element.dataset['parallaxMovementIntensityY']);
    if(Number.isInteger(tempValue))
      intensityY = tempValue;
  }
  // milliseconds speed
  if (element?.dataset['parallaxMovementSpeed']){
    tempValue = parseInt(element.dataset['parallaxMovementSpeed']);
    if(Number.isInteger(tempValue)){
      speed = tempValue;
      // TODO PORTARE FUORI?
      element.style.transition = transition + ', top ' + speed + 'ms, left ' + speed + 'ms';
    }
  }
  // return values
  return {
    element,
    intensityX,
    intensityY,
    speed
  }
};
