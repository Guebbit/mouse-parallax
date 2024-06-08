export interface mouseParallaxItemsMap {
    element: HTMLElement;
    intensityX: number;
    intensityY: number;
    speed: number;
}
export interface mouseParallaxMap {
    container: HTMLElement;
    items: mouseParallaxItemsMap[];
    build: (css: boolean, throttleIntensity: number) => void;
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
export declare const calculateMouseParallax: (x?: number, y?: number, w?: number, h?: number) => [number, number];
/**
 *
 * @param container
 * @param items
 * @param {number} x - mouse/touch position X axis
 * @param {number} y - mouse/touch position Y axis
 */
export declare const executeMouseParallax: ({ container, items }: mouseParallaxMap, x?: number, y?: number) => void;
/**
 * Create mouse Parallax Item
 * Take data from dataset
 *
 * @param {HTMLElement} element - element where extract dataset
 */
export declare const createMouseParallaxItem: (element: HTMLElement) => mouseParallaxItemsMap;
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
declare const _default: (anchors?: HTMLElement[], parent?: HTMLElement | null, $document?: Document) => mouseParallaxMap | undefined;
export default _default;
//# sourceMappingURL=index.d.ts.map