import { throttle } from 'lodash';


/**
 * Intensity of movement based on mouse movement speed
 * User decide how much mouse speed is reflected in X or Y axis
 * 0 = stopped, 100 = follow mouse (default), 200 =
 *
 * Target item limit overwrite global limit,
 * but target and global speed both applies (global last)
 */
export interface IMouseParallaxItem {
  element: HTMLElement;   // html element
  intensityX?: number;     // % of X axis movement intensity (in 0-1 percentages)
  intensityY?: number;     // % of Y axis movement intensity (in 0-1 percentages)
  limitX?: number;         // % limit for X axis (in %), -1 = no limit
  limitY?: number;         // % limit for Y axis (in %), -1 = no limit
  speed?: number;          // transition speed (in milliseconds)
  position?: number;       // z-index position
}

/**
 * Instructions only here
 */
export type IMouseParallaxInstructions = Omit<IMouseParallaxItem, 'element'>;

/**
 * All public methods are chainable
 */
export default class MouseParallax {

  /**
   * 0 = stop, 1 = start
   * @private
   */
  private _status = 1;

  /**
   * container of parallax
   * @private
   */
  private _container: HTMLElement | undefined;

  /**
   * Rules + HTML elements that will be moved for the parallax effect
   * @private
   */
  private _items: IMouseParallaxItem[] = [];

  /**
   * defaults (for non existent instructions)
   * @private
   */
  private _defaults: Omit<Required<IMouseParallaxInstructions>, 'position'> = {
    intensityX: 1,
    intensityY: 1,
    limitX: -1,
    limitY: -1,
    speed: 0
  };

  /**
   * Global modifiers
   * ALL parameters are treated like percentages
   * (thats why "speed" is 1, as 100%, instead of milliseconds)
   */
  private _globals: IMouseParallaxInstructions = {};

  /**
   * required css for parallax items to work
   * @private
   */
  private _requiredCss = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  };

  /**
   * throttle speed
   * @private
   */
  private _throttle = 20;

  /**
   * function pointer, to correctly handle throttle, events and listeners
   */
    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars,unicorn/empty-brace-spaces
  private _functionPointer = ($event: MouseEvent | TouchEvent) => {
  };

  /**
   * prefix for dataset rules on html elements
   */
  public datasetPrefix = 'parallaxRule';

  /**
   * Move function can be customized, otherwise its just "execute" the movement
   * @param x
   * @param y
   */
  public move = (x: number, y: number) => {
    this.execute(x, y);
    return this;
  };

  constructor(anchors: HTMLElement[] = [], instructions?: IMouseParallaxInstructions, container?: HTMLElement) {
    // No elements, they will be defined later
    if (anchors.length <= 0)
      return;
    // set globals (if any)
    if (instructions)
      this._globals = instructions;
    // default parent = element parent
    this._container = !container && anchors[0]?.parentElement ? anchors[0].parentElement : container;
    // set the initial items
    this.setItems(anchors);
  }

  /**
   * GETTER items
   * No SETTER, but parameters can be accessed and changed
   * WARNING: Always use reload() after changes
   */
  public get items() {
    return this._items;
  }

  /**
   * Replace current items with new items and their rules
   *
   * @param items
   * @param instructions
   */
  public setItems(items: HTMLElement[], instructions: IMouseParallaxInstructions[] = []): this {
    this._items = [];
    this.addItems(items, instructions);
    return this;
  }

  /**
   * Add an array of items
   * WARNING: if "instructions" are set, they must be the same number as "items" array
   *
   * @param items
   * @param instructions
   */
  public addItems(items: HTMLElement[] = [], instructions: IMouseParallaxInstructions[] = []): this {
    if (instructions.length > 0 && instructions.length !== items.length) {
      const error = new Error('MouseParallax addItems - items and instructions array length doesn\'t match');
      // eslint-disable-next-line no-console
      console.error(error);
      return this;
    }
    for (let i = 0, len = items.length; i < len; i++)
      this.addItem(items[i], instructions[i]);
    return this;
  }

  /**
   * Add a new item and it's rules at the end of the array
   * @param item
   * @param instructions
   */
  public addItem(item: HTMLElement | null, instructions?: IMouseParallaxInstructions): this {
    // avoid null
    if (!item)
      return this;
    // avoid duplicates
    if (this._checkElementDuplicate(item)) {
      const error = new Error('MouseParallax editItem - HTML element already present');
      // eslint-disable-next-line no-console
      console.error(error);
      return this;
    }
    // insert element and it's custom instructions
    this._items.push({
      ...this._itemBuilder(item),
      ...instructions
    });
    // apply rules to last item inserted
    this.applyParallax(this._items.at(-1));
    return this;
  }

  /**
   * Edit item and apply new rules
   * @param index
   * @param instructions
   */
  public editItem(index: number, instructions: Partial<IMouseParallaxInstructions>): this {
    if (index < 0 || index >= this._items.length || Object.prototype.hasOwnProperty.call(instructions, 'element')) {
      const error = new Error('MouseParallax editItem - invalid item or rules');
      // eslint-disable-next-line no-console
      console.error(error);
      return this;
    }
    // edit item instructions
    this._items[index] = {
      ...this._items[index],
      ...instructions
    };
    // apply rules to changed item
    this.applyParallax(this._items[index]);
    return this;
  }

  /**
   * Check if HTMLElement is already present in the Parallax.
   * Duplicates need to be avoided because they would overwrite themselves
   * and be generally chaotic
   *
   * @param check
   * @private
   */
  private _checkElementDuplicate(check?: HTMLElement) {
    return this._items.some(item => item.element === check);
  }

  /**
   * GETTER globals
   * WARNING: Always use reload() after changes
   */
  public get globals() {
    return this._globals;
  }

  /**
   * SETTER globals
   */
  public set globals(instructions) {
    this._globals = instructions;
    this.reload();
  }

  /**
   * Soft stop parallax
   */
  public stop(): this {
    this._status = 0;
    return this;
  }

  /**
   * Restart parallax (if it was stopped)
   */
  public start(): this {
    this._status = 1;
    return this;
  }

  /**
   *
   * @param {number} x - mouse/touch position X axis, move the element on using left (50% default generally)
   * @param {number} y - mouse/touch position Y axis, move the element using top (50% default generally)
   */
  public execute(x = 0, y = 0): this {
    if (!this._container || this._status === 0)
      return this;
    // get parent container info and apply them to the movement
    const [offsetWidth, offsetHeight, parentPositionLeft, parentPositionTop] = this._calculateContainer();
    // mouse movement relative to parent container
    const [cx, cy] = this._calculateMouseParallax(x - parentPositionLeft, y - parentPositionTop, offsetWidth, offsetHeight);

    for (const item of this._items)
      this._calculateTargetMovement(item, cx, cy);

    return this;
  }

  /**
   * Get size and position (in the document) of the parent
   * @private
   */
  private _calculateContainer() {
    if (!this._container)
      return [0, 0, 0, 0];
    const { offsetWidth, offsetHeight } = this._container;
    const { left: parentPositionLeft, top: parentPositionTop } = this._container.getBoundingClientRect();
    return [
      offsetWidth,
      offsetHeight,
      parentPositionLeft,
      parentPositionTop
    ];
  }

  /**
   * Apply rules to element
   *
   * @param item
   * @param cx
   * @param cy
   * @private
   */
  private _calculateTargetMovement(item?: IMouseParallaxItem, cx = 0, cy = 0) {
    // element could have been removed?
    if (!item?.element)
      return;

    // target item values + defaults
    const {
      element,
      intensityX = this._defaults.intensityX,
      intensityY = this._defaults.intensityY
    } = item;
    // global limit is override by target limit
    let {
      limitX = this._defaults.limitX,
      limitY = this._defaults.limitY
    } = item;
    // -1 means "no limit" so I check for a global limit instead
    if (limitX < 0 && this._globals.limitX && this._globals.limitX > 0)
      limitX = this._globals.limitX;
    if (limitY < 0 && this._globals.limitY && this._globals.limitY > 0)
      limitY = this._globals.limitY;

    // movement multiplied by its intensity
    let moveX = (cx * intensityX * 100);
    let moveY = (cy * intensityY * 100);

    // apply global intensity (if any)
    if (this._globals.intensityX)
      moveX *= this._globals.intensityX;
    if (this._globals.intensityY)
      moveY *= this._globals.intensityY;

    // for last: apply limit
    // + or - are regard it's position in the axis, so value and sign are treated differently
    if (limitX >= 0 && limitX < Math.abs(moveX))
      moveX = moveX > 0 ? limitX : -limitX;
    if (limitY >= 0 && limitY < Math.abs(moveY))
      moveY = moveY > 0 ? limitY : -limitY;

    // result
    this._applyMovement(element, moveX, moveY);
  }

  /**
   * Edit left and top of absolutely positioned HTML element to apply movement
   *
   * @param element
   * @param x
   * @param y
   * @private
   */
  private _applyMovement(element: HTMLElement, x = 0, y = 0) {
    element.style.left = (x + 50) + '%';
    element.style.top = (y + 50) + '%';
  }

  /**
   * GETTER throttle
   */
  public get throttle() {
    return this._throttle;
  }

  /**
   * SETTER throttle
   * When it's changed,
   */
  public set throttle(value: number) {
    this._throttle = value;
    this.reloadListeners();
  }

  /**
   * Translate events to X and Y coordinates only
   */
  private _eventHandler = ($event: MouseEvent | TouchEvent): void => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const x = ($event as MouseEvent).clientX === undefined ? ($event as TouchEvent).touches?.[0]?.clientX : ($event as MouseEvent).clientX;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const y = ($event as MouseEvent).clientY === undefined ? ($event as TouchEvent).touches?.[0]?.clientY : ($event as MouseEvent).clientY;
    this.move(x, y);
  };

  /**
   * Add events to dom
   * @param $document - needed in some cases, like cypress tests
   */
  public createListeners($document = document): this {
    // save pointer for later remove event listeners
    this._functionPointer = throttle(this._eventHandler.bind(this), this._throttle);
    $document.addEventListener('mousemove', this._functionPointer);
    $document.addEventListener('touchmove', this._functionPointer);
    return this;
  }

  /**
   * Cleanup of unused eventListeners
   * @param $document - needed in some cases, like cypress tests
   */
  public destroyListeners($document = document): this {
    $document.removeEventListener('mousemove', this._functionPointer);
    $document.removeEventListener('touchmove', this._functionPointer);
    return this;
  }

  /**
   * Reload eventListeners
   * @param $document - needed in some cases, like cypress tests
   */
  public reloadListeners($document = document): this {
    this.destroyListeners($document);
    this.createListeners($document);
    return this;
  }

  /**
   * Build html parallax
   * @private
   */
  public createParallax() {
    for (let i = this._items.length; i--;)
      // element could have been removed?
      this.applyParallax(this._items[i]);
  }

  /**
   * Apply the parallax rules to the HTML items
   *
   * @param item
   */
  public applyParallax(item?: IMouseParallaxItem) {
    if (!item)
      return;
    const { element, position } = item;
    let { speed = this._defaults.speed } = item;

    // apply global speed
    if (this._globals.speed && this._globals.speed > 0)
      speed *= this._globals.speed;

    // necessary rules for parallax movement
    Object.assign(element.style, this._requiredCss);

    // speed modifier
    if (speed > 0) {
      // pre existing transitions
      const { transition } = getComputedStyle(element);
      // apply speed
      element.style.transition = transition + ', top ' + speed + 'ms, left ' + speed + 'ms';
    }

    // position only if specified
    if (position)
      element.style.zIndex = position.toString();

    return this;
  }

  /**
   * All around function.
   * Prepare css and create listeners to start parallax
   */
  public build(): this {
    this.start();
    this.createParallax();
    this.createListeners();
    return this;
  }

  /**
   * Reload if changes where made (to items or particular rules)
   */
  public reload(): this {
    this.createParallax();
    this.reloadListeners();
    return this;
  }

  /**
   * Remove listeners and hard stop parallax
   * No need to remove custom CSS inserted with createParallax
   */
  public destroy(): this {
    // TODO remove css
    this._items = [];
    this.stop();
    this.destroyListeners();
    return this;
  }

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
  private _calculateMouseParallax(x = 0, y = 0, w = 0, h = 0): [number, number] {
    return [
      w === 0 ? 0 : ((x - w / 2) / w),
      h === 0 ? 0 : ((y - h / 2) / h)
    ];
  }

  /**
   * Get item's instructions from dataset
   *
   * @param element
   * @private
   */
  private _itemBuilder(element: HTMLElement): IMouseParallaxItem {

    // initial rules, if not specified in another way they will be the standard
    const instruction: IMouseParallaxItem = {
      element,
      ...this._defaults
    };

    // dataset <=> rules pairs
    const factory: [string, (keyof IMouseParallaxInstructions)[]][] = [
      [this.datasetPrefix + 'Intensity', ['intensityX', 'intensityY']],
      [this.datasetPrefix + 'IntensityX', ['intensityX']],
      [this.datasetPrefix + 'IntensityY', ['intensityY']],
      [this.datasetPrefix + 'Limit', ['limitX', 'limitY']],
      [this.datasetPrefix + 'LimitX', ['limitX']],
      [this.datasetPrefix + 'LimitY', ['limitY']],
      [this.datasetPrefix + 'Speed', ['speed']]
    ];

    // Build rules
    for (const [dataset, properties] of factory) {
      const value = Number.parseFloat(element.dataset[dataset] ?? '');
      if (value || value === 0)
        for (const property of properties) instruction[property] = value;
    }

    return instruction;
  }
}
