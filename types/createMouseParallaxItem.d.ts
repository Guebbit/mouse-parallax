/**
 * Intensity of movement based on mouse movement speed
 * User decide how much mouse speed is reflected in X or Y axis
 * 0 = stopped, 100 = follow mouse, 200 = double
 */
export interface IMouseParallaxInstructions {
    element: HTMLElement;
    intensityX: number;
    intensityY: number;
    speed: number;
}
/**
 * Create mouse Parallax Item
 * Take data from dataset
 *
 * @param {HTMLElement} element - element where extract dataset
 */
declare const _default: (element: HTMLElement) => IMouseParallaxInstructions;
export default _default;
//# sourceMappingURL=createMouseParallaxItem.d.ts.map
