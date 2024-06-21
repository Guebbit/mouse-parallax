import { type IMouseParallax } from './executeMouseParallax';
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
declare const _default: (anchors?: HTMLElement[], parent?: HTMLElement | null, $document?: Document) => IMouseParallax | undefined;
export default _default;
//# sourceMappingURL=mouseParallax.d.ts.map
