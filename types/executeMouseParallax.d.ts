import type { IMouseParallaxItemsMap } from './createMouseParallaxItem';
export interface IMouseParallaxMap {
    container: HTMLElement;
    items: IMouseParallaxItemsMap[];
    build: (css?: boolean, throttleIntensity?: number) => void;
}
/**
 *
 * @param container
 * @param items
 * @param {number} x - mouse/touch position X axis
 * @param {number} y - mouse/touch position Y axis
 */
declare const _default: ({ container, items }: IMouseParallaxMap, x?: number, y?: number) => void;
export default _default;
//# sourceMappingURL=executeMouseParallax.d.ts.map