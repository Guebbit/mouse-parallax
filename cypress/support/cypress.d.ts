declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Chainable<Subject = any> {
    addImages(containerSelector: string, parallaxImages?: Array<{ src: string, [key: string]: string | number }>): Chainable<HTMLElement[]>;
    centerMouse(): Chainable<Subject>;
    checkParallaxPosition(elements: HTMLElement[], rules?: Array<[string, string, string]>)
  }
}
