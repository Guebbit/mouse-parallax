/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

/**
 * Insert images in container and return the created elements
 * Easy test for parallaxes on empty.html page
 *
 * @param containerSelector
 * @param parallaxImages
 */
Cypress.Commands.add('addImages',(containerSelector: string, parallaxImages: Array<{ src: string, [key: string]: string | number }> = []) => {
  return cy.get(containerSelector).then($container => {
    const createdElements: HTMLElement[] = [];
    parallaxImages.forEach(image => {
      const img = document.createElement('img');
      img.src = image.src;
      Object.keys(image).forEach(key => {
        if (key !== 'src' && key !== 'thumbnail') {
          img.setAttribute(`data-parallax-movement-${key}`, image[key] as string);
        }
      });
      $container[0].appendChild(img);
      createdElements.push(img); // Cypress.$(img) to wrap img element in jQuery
    });
    return cy.wrap(createdElements);
  });
});

/**
 * Set mouse position to center of chained element
 */
Cypress.Commands.add('centerMouse', { prevSubject: 'element' }, (subject: JQuery<HTMLElement>) => {
  const rect = subject[0].getBoundingClientRect();

  cy.wrap(subject[0]).trigger('mousemove', {
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2,
    force: true
  });

  return cy.wrap(subject);
});

/**
 * Set mouse position to center of chained element
 * @param elements
 * @param rules - [id, top, left]
 */
Cypress.Commands.add('checkParallaxPosition', (elements: HTMLElement[], rules: Array<[string, string, string]> = []) => {
  for(let i = 0, len = rules.length; len > i; i++){
    const target = elements.find(el => el.id === rules[i][0]);
    expect(target.style.left).to.equal(rules[i][1]); // X
    expect(target.style.top).to.equal(rules[i][2]); // Y
  }
});
