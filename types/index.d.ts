/**
 * Intensity of movement based on mouse movement speed
 * User decide how much mouse speed is reflected in X or Y axis
 * 0 = stopped, 100 = follow mouse (default), 200 = double
 */
export interface IMouseParallaxInstructions {
    intensityX: number;
    intensityY: number;
    speed: number;
}
/**
 *
 */
export default class MouseParallax {
    private _id;
    private _status;
    private _container;
    private _items;
    private _instructions;
    private _speedModifier;
    private _intensityModifier;
    throttle: number;
    constructor(anchors: HTMLElement[], container?: HTMLElement);
    /**
     * GETTER items
     */
    get items(): HTMLElement[];
    /**
     * SETTER items
     * @param items
     */
    set items(items: HTMLElement[]);
    /**
     *
     * @param items
     */
    addItem(items?: HTMLElement[]): void;
    /**
     * Check if all items are valid HTMLElements
     * @param items
     */
    checkItemsValidity(items?: HTMLElement[]): boolean;
    /**
     * Get item's instructions from dataset
     *
     * @param element
     * @private
     */
    private _getInstructionsFromDataset;
    /**
     * Change global intensity modifier (that changes all items speed)
     *
     * @param modifier - 1 means "no changes"
     */
    changeIntensity(modifier?: number): this;
    /**
     * Change global speed modifier (that changes all items speed)
     *
     * @param modifier - 1 means "no changes"
     */
    changeSpeed(modifier?: number): this;
    /**
     * Soft stop parallax
     */
    stop(): this;
    /**
     * Re start parallax (if it was stopped)
     */
    start(): this;
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
    calculateMouseParallax(x?: number, y?: number, w?: number, h?: number): [number, number];
    /**
     *
     * @param {number} x - mouse/touch position X axis, move the element on using left (50% default generally)
     * @param {number} y - mouse/touch position Y axis, move the element using top (50% default generally)
     */
    private execute;
    /**
     *
     * @param clientX
     * @param clientY
     */
    move(clientX?: number, clientY?: number): this;
    /**
     * Sometimes it could be needed to add the necessary
     * positioning rules before applying movement
     */
    initCss(): void;
    /**
     *
     * @private
     */
    private _listenerMouse;
    /**
     *
     * @private
     */
    private _listenerTouch;
    /**
     * Add
     */
    createListeners(): this;
    /**
     *
     */
    destroyListeners(): this;
    /**
     * All around function.
     * Prepare css and create listeners to start parallax
     */
    build(): this;
    /**
     * Remove listeners and hard stop parallax
     */
    destroy(): void;
}
//# sourceMappingURL=index.d.ts.map