import { throttle } from 'lodash';


/**
 * Intensity of movement based on mouse movement speed
 * User decide how much mouse speed is reflected in X or Y axis
 * 0 = stopped, 100 = follow mouse (default), 200 = double
 */
export interface IMouseParallaxInstructions {
  element: HTMLElement;   // html element
  intensityX?: number     // % of X axis movement intensity
  intensityY?: number     // % of Y axis movement intensity
  speed?: number          // transition speed (in milliseconds)
  position?: number       // z-index position
}

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
  private _items: IMouseParallaxInstructions[] = [];

  /**
   * defaults (for non existent instructions)
   * @private
   */
  private _defaults: Omit<IMouseParallaxInstructions, "element"> = {
    intensityX: 1,
    intensityY: 1,
    speed: 0,
  };

  /**
   * Global modifiers
   * ALL parameters are treated like percentages
   * (thats why "speed" is 1, as 100%, instead of milliseconds)
   */
  private _globals: Omit<IMouseParallaxInstructions, "element"> = {
    intensityX: 1,
    intensityY: 1,
    speed: 1,
  };

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _functionPointer: any = () => {};

  /**
   * prefix for dataset rules on html elements
   */
  public datasetPrefix = "parallaxRule";

  /**
   * Move function can be customized, otherwise its just "execute" the movement
   * @param x
   * @param y
   */
  public move = (x: number, y: number) => { this.execute(x, y); return this; };

  constructor(anchors: HTMLElement[] = [], container?: HTMLElement) {
    // No elements, they will be defined later
    if(anchors.length <= 0)
      return;
    // default parent = element parent
    if (!container && anchors[0] && anchors[0].parentElement)
      this._container = anchors[0].parentElement;
    else
      // chosen container
      this._container = container;
    // set the initial items
    this.setItems(anchors);
  }

  /**
   * GETTER items
   * No SETTER, but parameters can be accessed and changed
   * WARNING: Always use reload() after changes
   */
  public get items(){
    return this._items;
  }

  /**
   * Replace current items with new items and their rules
   *
   * @param items
   * @param instructions
   */
  public setItems(items: HTMLElement[], instructions: Omit<IMouseParallaxInstructions, "element">[] = []): MouseParallax {
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
  public addItems(items: HTMLElement[] = [], instructions: Omit<IMouseParallaxInstructions, "element">[] = []): MouseParallax {
    if(instructions && instructions.length > 0 && instructions.length !== items.length){
      const error = new Error("MouseParallax addItems - items and instructions array length doesn't match");
      console.error(error);
      return this;
    }
    for (let i = 0, len = items.length; i < len; i++)
      this.addItem(items[i], instructions[i])
    return this;
  }

  /**
   * Add a new item and it's rules at the end of the array
   * @param item
   * @param instructions
   */
  public addItem(item: HTMLElement, instructions?: Omit<IMouseParallaxInstructions, "element">): MouseParallax {
    if(!item)
      return this;
    this._items.push({
      ...this._itemBuilder(item),
      ...instructions || {},
    });
    // apply rules to last item inserted
    this.applyRules(this._items[this._items.length - 1]);
    return this;
  }

  /**
   * Edit item and apply new rules
   * @param index
   * @param instructions
   */
  public editItem(index: number, instructions: Partial<Omit<IMouseParallaxInstructions, "element">>): MouseParallax {
    if (index < 0 || index >= this._items.length || instructions.hasOwnProperty("element")) {
      const error = new Error("MouseParallax editItem - invalid item or rules");
      console.error(error);
      return this;
    }
    // edit item instructions
    this._items[index] = {
      ...this._items[index],
      ...instructions,
    };
    // apply rules to changed item
    this.applyRules(this._items[index]);
    return this;
  }

  /**
   * GETTER globals
   * WARNING: Always use reload() after changes
   */
  public get globals(){
    return this._globals;
  }

  /**
   * SETTER globals
   */
  public set globals(instructions){
    this._globals = {
      ...this._globals,
      ...instructions,
    };
    this.reload();
  }

  /**
   * Soft stop parallax
   */
  public stop(): MouseParallax {
    this._status = 0;
    return this;
  }

  /**
   * Restart parallax (if it was stopped)
   */
  public start(): MouseParallax {
    this._status = 1;
    return this;
  }

  /**
   *
   * @param {number} x - mouse/touch position X axis, move the element on using left (50% default generally)
   * @param {number} y - mouse/touch position Y axis, move the element using top (50% default generally)
   */
  public execute(x = 0, y = 0): MouseParallax {
    if(!this._container || this._status === 0)
      return this;
    // width and height of parent
    const { offsetWidth, offsetHeight } = this._container;
    // parent position
    const { left: parentPositionLeft, top: parentPositionTop } = this._container.getBoundingClientRect();
    // calculate the positions of pointer related to the element position
    const [ cx, cy ] = this._calculateMouseParallax(x - parentPositionLeft, y - parentPositionTop, offsetWidth, offsetHeight);
    // execute movements on all items
    for (let i = 0; i < this._items.length; i++) {
      // element could have been removed?
      if(!this._items[i] || !this._items[i].element)
        continue;
      // default value
      const { intensityX = this._defaults.intensityX || 0, intensityY = this._defaults.intensityY || 0 } = this._items[i];
      // apply movement
      this._items[i].element.style.left = ((cx * intensityX * (this.globals.intensityX || 1) * 100) + 50) + '%';
      this._items[i].element.style.top = ((cy * intensityY * (this.globals.intensityY || 1) * 100) + 50) + '%';
    }
    return this;
  };

  /**
   * GETTER throttle
   */
  public get throttle(){
    return this._throttle;
  }

  /**
   * SETTER throttle
   * When it's changed,
   */
  public set throttle(value: number){
    this._throttle = value;
    this.reloadListeners();
  }

  /**
   * Translate events to X and Y coordinates only
   */
  private _eventHandler = (e: MouseEvent | TouchEvent): void => {
    const x = (e as MouseEvent).clientX !== undefined ? (e as MouseEvent).clientX : (e as TouchEvent).touches?.[0]?.clientX;
    const y = (e as MouseEvent).clientY !== undefined ? (e as MouseEvent).clientY : (e as TouchEvent).touches?.[0]?.clientY;
    this.move(x, y);
  };

  /**
   * Add events to dom
   * @param $document - needed in some cases, like cypress tests
   */
  public createListeners($document = document): MouseParallax {
    // save pointer for later remove event listeners
    this._functionPointer = throttle(this._eventHandler.bind(this), this._throttle);
    $document.addEventListener("mousemove", this._functionPointer);
    $document.addEventListener("touchmove", this._functionPointer);
    return this;
  }

  /**
   * Cleanup of unused eventListeners
   * @param $document - needed in some cases, like cypress tests
   */
  public destroyListeners($document = document): MouseParallax {
    $document.removeEventListener("mousemove", this._functionPointer);
    $document.removeEventListener("touchmove", this._functionPointer);
    return this;
  }

  /**
   * Reload eventListeners
   * @param $document - needed in some cases, like cypress tests
   */
  public reloadListeners($document = document): MouseParallax {
    this.destroyListeners($document);
    this.createListeners($document);
    return this;
  }

  /**
   * Apply the custom rules
   *
   * @param item
   */
  public applyRules(item: IMouseParallaxInstructions){
    const { element, speed = this._defaults.speed || 0, position } = item;

    // necessary rules for parallax movement
    Object.assign(element.style, this._requiredCss);

    // speed modifier
    if(speed > 0){
      // pre existing transitions
      const { transition } = getComputedStyle(element);
      // apply speed
      element.style.transition = transition + ', top ' + speed * (this.globals.speed || 1) + 'ms, left ' + speed * (this.globals.speed || 1) + 'ms';
    }

    // position only if specified
    if(position)
      element.style.zIndex = position.toString();

    return this;
  }

  /**
   * Build html parallax
   * @private
   */
  public createParallax(){
    for (let i = this._items.length; i--; )
      // element could have been removed?
      if(this._items[i]?.element)
        this.applyRules(this._items[i]);
  }

  /**
   * All around function.
   * Prepare css and create listeners to start parallax
   */
  public build(): MouseParallax {
    this.start();
    this.createParallax();
    this.createListeners();
    return this;
  }

  /**
   * Reload if changes where made (to items or particular rules)
   */
  public reload(): MouseParallax {
    this.createParallax();
    this.reloadListeners();
    return this;
  }

  /**
   * Remove listeners and hard stop parallax
   * No need to remove custom CSS inserted with createParallax
   */
  public destroy(): MouseParallax {
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
  private _calculateMouseParallax(x = 0, y = 0, w = 0, h = 0) :[number, number] {
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
  private _itemBuilder(element: HTMLElement): IMouseParallaxInstructions {

    // initial rules, if not specified in another way they will be the standard
    const instruction: IMouseParallaxInstructions = {
      element,
      ...this._defaults
    };

    // dataset <=> rules pairs
    const factory: Array<[string, Array<keyof Omit<IMouseParallaxInstructions, "element">>]> = [
      [this.datasetPrefix + "Intensity", ["intensityX", "intensityY"]],
      [this.datasetPrefix + "IntensityX", ["intensityX"]],
      [this.datasetPrefix + "IntensityY", ["intensityY"]],
      [this.datasetPrefix + "Speed", ["speed"]],
    ];

    // Build rules
    factory.forEach(([dataset, properties]) => {
      const value = parseFloat(element.dataset[dataset] || "");
      if(value || value === 0)
        properties.forEach(prop => instruction[prop] = value);
    });

    return instruction;
  }
}
