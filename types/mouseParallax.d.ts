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
export interface IMouseParallax {
    container: HTMLElement;
    items: IMouseParallaxInstructions[];
    css: (instructions: Record<string, string>) => void;
    move: (clientX: number, clientY: number) => this;
    build: (throttleIntensity?: number, css?: boolean) => this;
}
/**
 * ALL IN ONE mouse parallax movements, calculation and application through mouse and touch events
 * Get values from function or from dataset in element
 *
 * @param anchors - elements to move
 * @param container - parent, used as container \ limit
 * @param $document - needed in some cases, like cypress tests
 * @return object to control the parallax
 */
declare const _default: (anchors?: HTMLElement[], container?: HTMLElement | null, $document?: Document) => IMouseParallax | undefined;
export default _default;
//# sourceMappingURL=mouseParallax.d.ts.map