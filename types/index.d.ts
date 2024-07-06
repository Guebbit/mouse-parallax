/**
 * Intensity of movement based on mouse movement speed
 * User decide how much mouse speed is reflected in X or Y axis
 * 0 = stopped, 100 = follow mouse (default), 200 = double
 */
export interface IMouseParallaxInstructions {
    element: HTMLElement;
    intensityX?: number;
    intensityY?: number;
    speed?: number;
    position?: number;
}
/**
 * All public methods are chainable
 */
export default class MouseParallax {
    /**
     * 0 = stop, 1 = start
     * @private
     */
    private _status;
    /**
     * container of parallax
     * @private
     */
    private _container;
    /**
     * Rules + HTML elements that will be moved for the parallax effect
     * @private
     */
    private _items;
    /**
     * defaults (for non existent instructions)
     * @private
     */
    private _defaults;
    /**
     * Global modifiers
     * ALL parameters are treated like percentages
     * (thats why "speed" is 1, as 100%, instead of milliseconds)
     */
    private _globals;
    /**
     * required css for parallax items to work
     * @private
     */
    private _requiredCss;
    /**
     * throttle speed
     * @private
     */
    private _throttle;
    /**
     * function pointer, to correctly handle throttle, events and listeners
     */
    private _functionPointer;
    /**
     * prefix for dataset rules on html elements
     */
    datasetPrefix: string;
    /**
     * Move function can be customized, otherwise its just "execute" the movement
     * @param x
     * @param y
     */
    move: (x: number, y: number) => this;
    constructor(anchors?: HTMLElement[], container?: HTMLElement);
    /**
     * GETTER items
     * No SETTER, but parameters can be accessed and changed
     * WARNING: Always use reload() after changes
     */
    get items(): IMouseParallaxInstructions[];
    /**
     * Replace current items with new items and their rules
     *
     * @param items
     * @param instructions
     */
    setItems(items: HTMLElement[], instructions?: Omit<IMouseParallaxInstructions, "element">[]): MouseParallax;
    /**
     * Add an array of items
     * WARNING: if "instructions" are set, they must be the same number as "items" array
     *
     * @param items
     * @param instructions
     */
    addItems(items?: HTMLElement[], instructions?: Omit<IMouseParallaxInstructions, "element">[]): MouseParallax;
    /**
     * Add a new item and it's rules at the end of the array
     * @param item
     * @param instructions
     */
    addItem(item: HTMLElement, instructions?: Omit<IMouseParallaxInstructions, "element">): MouseParallax;
    /**
     * Edit item and apply new rules
     * @param index
     * @param instructions
     */
    editItem(index: number, instructions: Partial<Omit<IMouseParallaxInstructions, "element">>): MouseParallax;
    /**
     * GETTER globals
     * WARNING: Always use reload() after changes
     */
    get globals(): Omit<IMouseParallaxInstructions, "element">;
    /**
     * SETTER globals
     */
    set globals(instructions: Omit<IMouseParallaxInstructions, "element">);
    /**
     * Soft stop parallax
     */
    stop(): MouseParallax;
    /**
     * Restart parallax (if it was stopped)
     */
    start(): MouseParallax;
    /**
     *
     * @param {number} x - mouse/touch position X axis, move the element on using left (50% default generally)
     * @param {number} y - mouse/touch position Y axis, move the element using top (50% default generally)
     */
    execute(x?: number, y?: number): MouseParallax;
    /**
     * GETTER throttle
     */
    get throttle(): number;
    /**
     * SETTER throttle
     * When it's changed,
     */
    set throttle(value: number);
    /**
     * Translate events to X and Y coordinates only
     */
    private _eventHandler;
    /**
     * Add events to dom
     * @param $document - needed in some cases, like cypress tests
     */
    createListeners($document?: Document): MouseParallax;
    /**
     * Cleanup of unused eventListeners
     * @param $document - needed in some cases, like cypress tests
     */
    destroyListeners($document?: Document): MouseParallax;
    /**
     * Reload eventListeners
     * @param $document - needed in some cases, like cypress tests
     */
    reloadListeners($document?: Document): MouseParallax;
    /**
     * Apply the custom rules
     *
     * @param item
     */
    applyRules(item: IMouseParallaxInstructions): this;
    /**
     * Build html parallax
     * @private
     */
    createParallax(): void;
    /**
     * All around function.
     * Prepare css and create listeners to start parallax
     */
    build(): MouseParallax;
    /**
     * Reload if changes where made (to items or particular rules)
     */
    reload(): MouseParallax;
    /**
     * Remove listeners and hard stop parallax
     * No need to remove custom CSS inserted with createParallax
     */
    destroy(): MouseParallax;
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
     * Get item's instructions from dataset
     *
     * @param element
     * @private
     */
    private _itemBuilder;
}
//# sourceMappingURL=index.d.ts.map