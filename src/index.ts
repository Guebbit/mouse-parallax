import { throttle } from 'lodash';
import { getUuid } from "@guebbit/js-toolkit"


/**
 * Intensity of movement based on mouse movement speed
 * User decide how much mouse speed is reflected in X or Y axis
 * 0 = stopped, 100 = follow mouse (default), 200 = double
 */
export interface IMouseParallaxInstructions {
  intensityX: number    // X axis
  intensityY: number    // Y axis
  speed: number         // current mouse speed
}


// TODO watchers - check su speed, intensità, etc per vedere se vengono cambiati dei valori, poi ritriggerare eventuali "build" sull'elemento

/**
 *
 */
export default class MouseParallax {
  // unique id TODO ?
  private _id = "";
  // 0 = stop, 1 = start
  private _status = 0;
  // container of parallax
  private _container: HTMLElement | undefined;
  // HTML elements that will be moved for the parallax effect
  private _items: HTMLElement[] = [];
  // single target rules
  private _instructions: IMouseParallaxInstructions[] = [];
  // transition
  private _speedModifier = 1;
  // movement multiplier
  private _intensityModifier = 1;

  // throttle speed
  public throttle = 20;

  constructor(anchors: HTMLElement[], container?: HTMLElement) {
    //unique id
    this._id = getUuid();
    console.log("AAAAAAAAAAAAA uniqueId", this._id);
    // No elements, they will be defined later
    if(anchors.length <= 0)
      return;
    // default parent = element parent
    if (!container && anchors[0] && anchors[0].parentElement)
      this._container = anchors[0].parentElement;
    else
      // chosen container
      this._container = container;
    this._items = anchors;
  }

  /**
   * GETTER items
   */
  public get items(){
    // TODO with rules
    return this._items;
  }

  /**
   * SETTER items
   * @param items
   */
  public set items(items: HTMLElement[]){
    if(!this.checkItemsValidity(items))
      return;
    this._items = items;
    // TODO optimize
    for(let i = 0, len = items.length; i < len; i++)
      this._instructions[i] = this._getInstructionsFromDataset(items[i]);
  }

  /**
   *
   * @param items
   */
  public addItem(items: HTMLElement[] = []){
    if(!this.checkItemsValidity(items))
      return;
    this._items.push(...items);
    // TODO optimize
    const itemsLength = this._items.length;
    for(let i = 0, len = items.length; i < len; i++)
      this._instructions[itemsLength + i] = this._getInstructionsFromDataset(items[i]);
  }

  /**
   * Check if all items are valid HTMLElements
   * @param items
   */
  public checkItemsValidity(items: HTMLElement[] = []){
    return items.every(item => item instanceof HTMLElement);
  }


  /**
   * Get item's instructions from dataset
   *
   * @param element
   * @private
   */
  private _getInstructionsFromDataset(element: HTMLElement){
    /**
     * Get value from data-* attribute
     * @param element
     * @param dataset
     */
    function getDatasetValue(element :HTMLElement, dataset: string){
      const value = parseInt(element.dataset[dataset] || "");
      if(Number.isInteger(value))
        return value;
    }

    /**
     * Get instructions from target element
     */
    let tempValue :number | undefined;
    // default values
    const instruction: IMouseParallaxInstructions = {
      intensityX: 100,
      intensityY: 100,
      speed: 0,
    }
    // % generic intensity
    tempValue = getDatasetValue(element, "parallaxMovementIntensity");
    if(tempValue || tempValue === 0){
      instruction.intensityX = tempValue;
      instruction.intensityY = tempValue;
    }
    // % intensity on X axis only
    tempValue = getDatasetValue(element, "parallaxMovementIntensityX");
    if(tempValue || tempValue === 0)
      instruction.intensityX = tempValue;
    // % intensity on Y axis only
    tempValue = getDatasetValue(element, "parallaxMovementIntensityY");
    if(tempValue || tempValue === 0)
      instruction.intensityY = tempValue;
    // milliseconds speed
    tempValue = getDatasetValue(element, "parallaxMovementSpeed");
    if(tempValue || tempValue === 0)
      instruction.speed = tempValue;


    // TODO TEMPORARY
    if(instruction.speed){
      // pre existing transitions
      const { transition } = getComputedStyle(element);
      // apply speed
      element.style.transition = transition + ', top ' + instruction.speed + 'ms, left ' + instruction.speed + 'ms';
    }

    // final
    return instruction
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
   * Change global speed modifier (that changes all items speed)
   *
   * @param modifier - 1 means "no changes"
   */
  public changeSpeed(modifier = 1){
    this._speedModifier = modifier;
    return this;
  }

  /**
   * Soft stop parallax
   */
  public stop(){
    this._status = 0;
    return this;
  }

  /**
   * Re start parallax (if it was stopped)
   */
  public start(){
    this._status = 1;
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
  calculateMouseParallax(x = 0, y = 0, w = 0, h = 0) :[number, number] {
    return [
      w === 0 ? 0 : ((x - w / 2) / w),
      h === 0 ? 0 : ((y - h / 2) / h)
    ];
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
    const [ cx, cy ] = this.calculateMouseParallax(x - parentPositionLeft, y - parentPositionTop, offsetWidth, offsetHeight);
    // execute movements on all items
    for (let i = 0; i < this._items.length; i++) {
      if(!this._items[i] || !this._instructions[i])
        continue;
      const { intensityX, intensityY } = this._instructions[i];
      // apply movement
      this._items[i].style.left = (cx * intensityX + 50) + '%';
      this._items[i].style.top = (cy * intensityY + 50) + '%';
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
   * Sometimes it could be needed to add the necessary
   * positioning rules before applying movement
   */
  public initCss(){
    for (let i = this.items.length; i--; )
      if (this.items[i] && this.items[i])
        Object.assign(this.items[i].style, {
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        });
  }

  /**
   *
   * @private
   */
  private _listenerMouse = throttle(({ clientX, clientY }: MouseEvent): void => {
    this.execute(clientX, clientY);
  }, this.throttle);

  /**
   *
   * @private
   */
  private _listenerTouch = throttle(({ changedTouches }: TouchEvent): void => {
    if (!changedTouches || changedTouches.length <= 0)
      return;
    this.execute(changedTouches[0].pageX, changedTouches[0].pageY);
  }, this.throttle);

  /**
   * Add
   */
  public createListeners() {
    document.addEventListener("mousemove", this._listenerMouse);
    document.addEventListener("touchmove", this._listenerTouch);
    return this;
  }

  /**
   *
   */
  public destroyListeners() {
    document.removeEventListener("mousemove", this._listenerMouse);
    document.removeEventListener("touchmove", this._listenerTouch);
    return this;
  }


  /**
   * All around function.
   * Prepare css and create listeners to start parallax
   */
  public build() {
    this.initCss();
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
}
