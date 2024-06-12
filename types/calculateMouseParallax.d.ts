/**
 * Calculate the relative position of a point (x,y) within a container.
 * Needed to calculate the parallax effect based on the movement of the mouse (or touch or custom).
 *
 * @param {number} x - axis X (mouse, touch, custom)
 * @param {number} y - axis Y (mouse, touch, custom)
 * @param {number} w - width of parent container
 * @param {number} h - height of parent container
 *
 * @return {number, number} - new X and Y positions calculated on the parent container
 */
declare const _default: (x?: number, y?: number, w?: number, h?: number) => [number, number];
export default _default;
//# sourceMappingURL=calculateMouseParallax.d.ts.map