/**
 * Intensity of movement based on mouse movement speed
 * User decide how much mouse speed is reflected in X or Y axis
 * 0 = stopped, 100 = follow mouse (default), 200 = double
 */
export interface IMouseParallaxInstructions {
    element: HTMLElement;
    intensityX: number;
    intensityY: number;
    speed: number;
}
/**
 *
 */
export default class MouseParallax {
    private _status;
    private _container;
    private _items;
    private _speedModifier;
    private _intensityModifier;
    throttle: number;
    constructor(anchors: HTMLElement[], container?: HTMLElement);
    /**
     * GETTER items
     * (no SETTER)
     */
    get items(): IMouseParallaxInstructions[];
    /**
     * Chainable
     * Replace current items with new items and their rules
     * @param items
     */
    setItems(items: HTMLElement[]): this;
    /**
     * Chainable
     * Add a new item and it's rules at the end of the array
     * @param items
     */
    addItems(items?: HTMLElement[]): this;
    /**
     * Change global intensity modifier (that changes all items speed)
     *
     * @param modifier - 1 means "no changes"
     */
    changeIntensity(modifier?: number): this;
    /**
     * Chainable
     * Change global speed modifier (that changes all items speed)
     *
     * @param modifier - 1 means "no changes"
     */
    changeSpeed(modifier?: number): this;
    /**
     * Chainable
     * Soft stop parallax
     */
    stop(): this;
    /**
     * Chainable
     * Restart parallax (if it was stopped)
     */
    start(): this;
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
     * TODO STATIC? (execute too?)
     * Sometimes it is required that they can be accessed directly
     */
    listenerMouse: import("lodash").DebouncedFuncLeading<({ clientX, clientY }: MouseEvent) => void>;
    /**
     * TODO STATIC? (execute too?)
     * Sometimes it is required that they can be accessed directly
     */
    listenerTouch: import("lodash").DebouncedFuncLeading<({ changedTouches }: TouchEvent) => void>;
    /**
     * Add events to dom
     */
    createListeners(): this;
    /**
     * Cleanup
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
    private _calculateMouseParallax;
    /**
     * TODO gestire element inesistenti?
     * Get item's instructions from dataset
     *
     * @param element
     * @private
     */
    private _itemBuilder;
    private _elementTransform;
}
//# sourceMappingURL=index.d.ts.map