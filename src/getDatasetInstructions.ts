import type { IMouseParallaxInstructions } from './';

/**
 * Get value from data-* attribute
 * @param element
 * @param dataset
 */
function getDatasetValue(element :HTMLElement, dataset: string){
  const value = parseInt(element.dataset[dataset] || "");
  if(Number.isInteger(value))
    return value;
}

/**
 * Create mouse Parallax Item
 * Take data from dataset (if populated)
 *
 * @param element - element where extract dataset
 * @return IMouseParallaxInstructions object
 */
export default (element :HTMLElement): Omit<IMouseParallaxInstructions, "element"> => {
  let tempValue :number | undefined;
  // default values
  const instruction: Omit<IMouseParallaxInstructions, "element"> = {
    intensityX: 100,
    intensityY: 100,
    speed: 0,
  }
  // % generic intensity
  tempValue = getDatasetValue(element, "parallaxMovementIntensity");
  if(tempValue || tempValue === 0){
    instruction.intensityX = tempValue;
    instruction.intensityY = tempValue;
  }
  // % intensity on X axis only
  tempValue = getDatasetValue(element, "parallaxMovementIntensityX");
  if(tempValue || tempValue === 0)
    instruction.intensityX = tempValue;
  // % intensity on Y axis only
  tempValue = getDatasetValue(element, "parallaxMovementIntensityY");
  if(tempValue || tempValue === 0)
    instruction.intensityY = tempValue;
  // milliseconds speed
  tempValue = getDatasetValue(element, "parallaxMovementSpeed");
  if(tempValue || tempValue === 0)
    instruction.speed = tempValue;
  // final
  return instruction
};
