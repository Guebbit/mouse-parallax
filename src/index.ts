import { throttle } from 'lodash';


/**
 * Intensity of movement based on mouse movement speed
 * User decide how much mouse speed is reflected in X or Y axis
 * 0 = stopped, 100 = follow mouse (default), 200 = double
 */
export interface IMouseParallaxInstructions {
  element: HTMLElement; // html element
  intensityX: number    // X axis
  intensityY: number    // Y axis
  speed: number         // current mouse speed
}


// TODO watchers - check su speed, intensità, etc per vedere se vengono cambiati dei valori, poi ritriggerare eventuali "build" sull'elemento

/**
 *
 */
export default class MouseParallax {
  // 0 = stop, 1 = start
  private _status = 0;
  // container of parallax
  private _container: HTMLElement | undefined;
  // Rules + HTML elements that will be moved for the parallax effect
  private _items: IMouseParallaxInstructions[] = [];
  // transition
  private _speedModifier = 1;
  // movement multiplier
  private _intensityModifier = 1;

  // throttle speed
  public throttle = 20;

  constructor(anchors: HTMLElement[], container?: HTMLElement) {
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
   * (no SETTER)
   */
  public get items(){
    return this._items;
  }


  /**
   * Chainable
   * Replace current items with new items and their rules
   * @param items
   */
  public setItems(items: HTMLElement[]){
    this._items = [];
    this.addItems(items);
    return this;
  }

  /**
   * Chainable
   * Add a new item and it's rules at the end of the array
   * @param items
   */
  public addItems(items: HTMLElement[] = []){
    for(let i = 0, len = items.length; i < len; i++)
      this._items[i] = this._itemBuilder(items[i]);
    return this;
  }


  /**
   * Change global intensity modifier (that changes all items speed)
   *
   * @param modifier - 1 means "no changes"
   */
  public changeIntensity(modifier = 1){
    this._intensityModifier = modifier;
    return this;
  }

  /**
   * Chainable
   * Change global speed modifier (that changes all items speed)
   *
   * @param modifier - 1 means "no changes"
   */
  public changeSpeed(modifier = 1){
    this._speedModifier = modifier;
    return this;
  }

  /**
   * Chainable
   * Soft stop parallax
   */
  public stop(){
    this._status = 0;
    return this;
  }

  /**
   * Chainable
   * Restart parallax (if it was stopped)
   */
  public start(){
    this._status = 1;
    return this;
  }

  /**
   *
   * @param {number} x - mouse/touch position X axis, move the element on using left (50% default generally)
   * @param {number} y - mouse/touch position Y axis, move the element using top (50% default generally)
   */
  private execute(x = 0, y = 0){
    if(!this._container)
      return this;
    // width and height of parent
    const { offsetWidth, offsetHeight } = this._container;
    // parent position
    const { left: parentPositionLeft, top: parentPositionTop } = this._container.getBoundingClientRect();
    // calculate the positions of pointer related to the element position
    const [ cx, cy ] = this._calculateMouseParallax(x - parentPositionLeft, y - parentPositionTop, offsetWidth, offsetHeight);
    // execute movements on all items
    for (let i = 0; i < this._items.length; i++) {
      if(!this._items[i] || !this._items[i].element)
        continue;
      const { intensityX, intensityY } = this._items[i];
      // apply movement
      this._items[i].element.style.left = (cx * intensityX + 50) + '%';
      this._items[i].element.style.top = (cy * intensityY + 50) + '%';
    }
    return this;
  };


  /**
   *
   * @param clientX
   * @param clientY
   */
  public move(clientX = 0, clientY = 0): this {
    this.execute(clientX, clientY);
    return this;
  }

  /**
   * TODO STATIC? (execute too?)
   * Sometimes it is required that they can be accessed directly
   */
  listenerMouse = throttle(({ clientX, clientY }: MouseEvent): void => {
    this.execute(clientX, clientY);
  }, this.throttle);

  /**
   * TODO STATIC? (execute too?)
   * Sometimes it is required that they can be accessed directly
   */
  listenerTouch = throttle(({ changedTouches }: TouchEvent): void => {
    if (!changedTouches || changedTouches.length <= 0)
      return;
    this.execute(changedTouches[0].pageX, changedTouches[0].pageY);
  }, this.throttle);

  /**
   * Add events to dom
   */
  public createListeners() {
    document.addEventListener("mousemove", this.listenerMouse);
    document.addEventListener("touchmove", this.listenerTouch);
    return this;
  }

  /**
   * Cleanup
   */
  public destroyListeners() {
    document.removeEventListener("mousemove", this.listenerMouse);
    document.removeEventListener("touchmove", this.listenerTouch);
    return this;
  }

  /**
   * All around function.
   * Prepare css and create listeners to start parallax
   */
  public build() {
    this.start();
    this.createListeners();
    return this;
  }

  /**
   * Remove listeners and hard stop parallax
   */
  public destroy(){
    this.stop();
    this.destroyListeners();
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
   * TODO gestire element inesistenti?
   * Get item's instructions from dataset
   *
   * @param element
   * @private
   */
  private _itemBuilder(element: HTMLElement): IMouseParallaxInstructions {

    // initial rules
    const instruction: IMouseParallaxInstructions = {
      element,
      intensityX: 100,
      intensityY: 100,
      speed: 0,
    };

    // dataset <=> rules pairs
    const factory: Array<[string, Array<keyof Omit<IMouseParallaxInstructions, "element">>]> = [
      ["parallaxMovementIntensity", ["intensityX", "intensityY"]],
      ["parallaxMovementIntensityX", ["intensityX"]],
      ["parallaxMovementIntensityY", ["intensityY"]],
      ["parallaxMovementSpeed", ["speed"]],
    ];

    // Build rules
    factory.forEach(([dataset, properties]) => {
      const value = parseInt(element.dataset[dataset] || "");
      if(value || value === 0)
        properties.forEach(prop => instruction[prop] = value);
    });

    return instruction;
  }

  // TODO single? Multiple?
  private _elementTransform(){
    for (let i = this._items.length; i--; ){
      const { element, speed } = this._items[i];

      // TODO SEPARATE?
      // Starting (and necessary) standard rules
      Object.assign(this._items[i].element.style, {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      });

      // TODO SEPARATE??
      // speed modifier
      if(speed > 0){
        // pre existing transitions
        const { transition } = getComputedStyle(element);
        // apply speed
        element.style.transition = transition + ', top ' + speed + 'ms, left ' + speed + 'ms';
      }
    }
  }
}
