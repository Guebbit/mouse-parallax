import MouseParallax from '../src';


describe('Neutral insertion', () => {
  let mpInstance: MouseParallax;
  let element: HTMLElement;

  beforeEach(() => {
    mpInstance = new MouseParallax();    // Create a mock HTMLElement with dataset
    element = document.createElement('div');
  });

  test('Should return default values when dataset is empty and no instructions were given', () => {
    // Insertion
    mpInstance.addItem(element);
    // add to MouseParallax
    const result = mpInstance.items[0];
    // check standard values
    expect(result.element).toBe(element);
    expect(result.intensityX).toBe(1);
    expect(result.intensityY).toBe(1);
    expect(result.speed).toBe(0);
  });

  test('Same element insertion is not valid', () => {
    mpInstance.addItems([element, element]);
    expect(mpInstance.items.length).toBe(1);
  });
});


describe('Insertion with rules', () => {
  let mpInstance: MouseParallax;
  let element1: HTMLElement;
  let element2: HTMLElement;
  let element3: HTMLElement;

  beforeEach(() => {
    // create instance
    mpInstance = new MouseParallax();
    // create elements
    element1 = document.createElement('div');
    element1.dataset.parallaxRuleIntensity = '1.5';
    element2 = document.createElement('div');
    element2.dataset.parallaxRuleIntensityX = '2';
    element2.dataset.parallaxRuleIntensityY = '3';
    element3 = document.createElement('div');
    element3.dataset.parallaxRuleIntensityY = '2.5';
    element3.dataset.parallaxRuleSpeed = '500';
  });

  test('Should return values from dataset when they are present', () => {
    mpInstance.addItems([element1, element2, element3]);
    let result = mpInstance.items[0];

    expect(result.intensityX).toBe(1.5);
    expect(result.intensityY).toBe(1.5);

    result = mpInstance.items[1];

    expect(result.intensityX).toBe(2);
    expect(result.intensityY).toBe(3);

    result = mpInstance.items[2];

    expect(result.intensityX).toBe(1);
    expect(result.intensityY).toBe(2.5);
    expect(result.speed).toBe(500);
    expect(element3.style.transition).toContain('top 500ms');
    expect(element3.style.transition).toContain('left 500ms');
  });

  test('Should return values from instructions when they are manually set', () => {
    mpInstance.addItems([
      element1,
      element2,
      element3
    ], [
      {
        intensityX: 2
      },
      {}, // empty because index position is important
      {
        intensityX: 10,
        intensityY: 0,
        speed: 900
      }
    ]);

    let result = mpInstance.items[0];

    expect(result.intensityX).toBe(2);
    expect(result.intensityY).toBe(1.5);

    result = mpInstance.items[1];

    expect(result.intensityX).toBe(2);
    expect(result.intensityY).toBe(3);

    result = mpInstance.items[2];

    expect(result.intensityX).toBe(10);
    expect(result.intensityY).toBe(0);
    expect(result.speed).toBe(900);
    expect(element3.style.transition).toContain('top 900ms');
    expect(element3.style.transition).toContain('left 900ms');
  });

  test('Same element insertion is not valid even with different rules', () => {
    mpInstance.addItem(element1, {
      intensityX: 2
    });
    mpInstance.addItem(element1, {
      intensityX: 10,
      intensityY: 0,
    });
    expect(mpInstance.items.length).toBe(1);
  });
});
