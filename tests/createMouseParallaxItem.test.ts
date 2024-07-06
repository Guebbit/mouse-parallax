import { createMouseParallaxItem, type IMouseParallaxInstructions } from '../src/old';

describe('createMouseParallaxItem tests are just for safety, only cypress can test this piece correctly', () => {
  let element: HTMLElement;

  beforeEach(() => {
    // Create a mock HTMLElement with dataset
    element = document.createElement('div');
  });

  test('Should return default values when dataset is empty', () => {
    const result: IMouseParallaxInstructions = createMouseParallaxItem(element);

    expect(result.element).toBe(element);
    expect(result.intensityX).toBe(100);
    expect(result.intensityY).toBe(100);
    expect(result.speed).toBe(0);
  });

  test('Should return values from dataset when they are manually set', () => {
    element.dataset.parallaxRuleIntensity = '150';

    let result: IMouseParallaxInstructions = createMouseParallaxItem(element);

    expect(result.intensityX).toBe(150);
    expect(result.intensityY).toBe(150);

    //

    element.dataset.parallaxRuleIntensityX = '200';

    result = createMouseParallaxItem(element);

    expect(result.intensityX).toBe(200);
    expect(result.intensityY).toBe(150);

    //

    element.dataset.parallaxRuleIntensityY = '250';

    result = createMouseParallaxItem(element);

    expect(result.intensityX).toBe(200);
    expect(result.intensityY).toBe(250);
  });

  test('Should change the style of the element based on the parallax movement', () => {
    element.dataset.parallaxRuleSpeed = '500';

    const result: IMouseParallaxInstructions = createMouseParallaxItem(element);

    expect(result.speed).toBe(500);
    expect(element.style.transition).toContain('top 500ms');
    expect(element.style.transition).toContain('left 500ms');

  });

  test('Should change the style of the element based on the parallax movement (bis)', () => {
    element.dataset.parallaxRuleIntensity = '150';
    element.dataset.parallaxRuleIntensityX = '200';
    element.dataset.parallaxRuleSpeed = '300';

    const result: IMouseParallaxInstructions = createMouseParallaxItem(element);

    expect(result.intensityX).toBe(200); // parallaxRuleIntensityX overrides parallaxRuleIntensity
    expect(result.intensityY).toBe(150);
    expect(result.speed).toBe(300);
    expect(element.style.transition).toContain('top 300ms');
    expect(element.style.transition).toContain('left 300ms');

  });
});
