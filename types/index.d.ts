/**
 * Intensity of movement based on mouse movement speed
 * User decide how much mouse speed is reflected in X or Y axis
 * 0 = stopped, 100 = follow mouse (default), 200 =
 *
 * Target item limit overwrite global limit,
 * but target and global speed both applies (global last)
 */
export interface IMouseParallaxItem {
    element: HTMLElement;
    intensityX?: number;
    intensityY?: number;
    limitX?: number;
    limitY?: number;
    speed?: number;
    position?: number;
}
/**
 * Instructions only here
 */
export type IMouseParallaxInstructions = Omit<IMouseParallaxItem, "element">;
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
    constructor(anchors?: HTMLElement[], instructions?: IMouseParallaxInstructions, container?: HTMLElement);
    /**
     * GETTER items
     * No SETTER, but parameters can be accessed and changed
     * WARNING: Always use reload() after changes
     */
    get items(): IMouseParallaxItem[];
    /**
     * Replace current items with new items and their rules
     *
     * @param items
     * @param instructions
     */
    setItems(items: HTMLElement[], instructions?: IMouseParallaxInstructions[]): MouseParallax;
    /**
     * Add an array of items
     * WARNING: if "instructions" are set, they must be the same number as "items" array
     *
     * @param items
     * @param instructions
     */
    addItems(items?: HTMLElement[], instructions?: IMouseParallaxInstructions[]): MouseParallax;
    /**
     * Add a new item and it's rules at the end of the array
     * @param item
     * @param instructions
     */
    addItem(item: HTMLElement, instructions?: IMouseParallaxInstructions): MouseParallax;
    /**
     * Edit item and apply new rules
     * @param index
     * @param instructions
     */
    editItem(index: number, instructions: Partial<IMouseParallaxInstructions>): MouseParallax;
    /**
     * Check if HTMLElement is already present in the Parallax.
     * Duplicates need to be avoided because they would overwrite themselves
     * and be generally chaotic
     *
     * @param check
     * @private
     */
    private _checkElementDuplicate;
    /**
     * GETTER globals
     * WARNING: Always use reload() after changes
     */
    get globals(): IMouseParallaxInstructions;
    /**
     * SETTER globals
     */
    set globals(instructions: IMouseParallaxInstructions);
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
     * Get size and position (in the document) of the parent
     * @private
     */
    private _calculateContainer;
    /**
     * Apply rules to element
     *
     * @param item
     * @param cx
     * @param cy
     * @private
     */
    private _calculateTargetMovement;
    /**
     * Edit left and top of absolutely positioned HTML element to apply movement
     *
     * @param element
     * @param x
     * @param y
     * @private
     */
    private _applyMovement;
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
     * Build html parallax
     * @private
     */
    createParallax(): void;
    /**
     * Apply the parallax rules to the HTML items
     *
     * @param item
     */
    applyParallax(item: IMouseParallaxItem): this;
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