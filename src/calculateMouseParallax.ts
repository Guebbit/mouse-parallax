
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
export default (x = 0, y = 0, w = 0, h = 0) :[number, number] => {
  return [
    w === 0 ? 0 : ((x - w / 2) / w),
    h === 0 ? 0 : ((y - h / 2) / h)
  ];
};
