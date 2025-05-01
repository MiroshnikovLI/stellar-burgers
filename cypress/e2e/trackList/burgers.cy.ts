// <reference types="cypress" />
// cypress/plugins/index.js

describe('Burger Bar Tests', () => {
  const userName = 'Miroshnikov-li@yandex.ru';
  const userPassword = 'miron147963den';

  const constructor = '[data-cy="constructor-element-test"]';

  const bun = '[data-cy="643d69a5c3f7b9001cfa093d"]';
  const ingredients1 = `[data-cy="643d69a5c3f7b9001cfa0941"]`;
  const ingredients2 = `[data-cy="643d69a5c3f7b9001cfa093e"]`;
  const ingredients3 = `[data-cy="643d69a5c3f7b9001cfa0946"]`;

  const deleteElement = '[data-cy="delete-element-test"]';

  const modalTest = `[data-cy='modal-test']`;

  it('Making an order', () => {
    cy.intercept('POST', '/', { fixture: 'ingredients.json' });
    cy.intercept('GET', '/api/auth/user', { fixture: 'login' });
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as('order');

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');

    cy.visit('/');

    /** Бургер конструктор */
    cy.get(constructor).as('burger');

    /** Добавляем ингредиенты */
    cy.get(bun).find('button').click();
    cy.get(ingredients1).find('button').click();
    cy.get(ingredients2).find('button').click();

    /** Кнопка оформить заказ, оформление заказа  */
    cy.get(`button`).contains('Оформить заказ').click();

    // Проверяем, что запрос был отправлен
    cy.wait('@order').then((interception) => {
      // Проверяем тело запроса
      expect(interception.request.body).to.deep.equal({
        ingredients: [ingredients1, ingredients2, bun, bun]
      });
    });

    /** Модальное окно */
    cy.get(modalTest).as('modal');

    /** Проверка окна оформление заказа */
    cy.get('@modal').contains('Оформляем заказ');

    /** Проверка окна заказ оформлен */
    cy.get('@modal').contains('Заказ оформлен', { timeout: 20000 });

    /** Кнопка закрытия модального окна заказа */
    cy.get('[data-cy="modal-close-test"]', { timeout: 2000 }).click();

    /** Проверка конструктора бургера что он пуст */
    cy.get('@burger').within(() => {
      cy.contains('Выберите начинку');
      cy.contains('Выберите булки');
    });
  });

  it('Mixing goods in the burger constructor', () => {
    let initialPosition: JQuery.Coordinates;

    cy.visit('/');

    /** Бургер конструктор */
    cy.get(constructor).as('burger');

    /** Добавления ингредиента  */
    cy.get(ingredients1).find('button').click();

    /** КДобавления ингредиента  */
    cy.get(ingredients2).find('button').click();

    /** Добавления ингредиента  */
    cy.get(ingredients3).find('button').click();

    /** Елемент внутри бургера */
    cy.get('@burger')
      .find(ingredients1)
      .then(($burger) => {
        initialPosition = $burger.position();
      })
      .find('button')
      .last()
      .click()
      .click();

    cy.get('@burger').should(($burger) => {
      expect($burger.position()).deep.equal({ top: 187.59375, left: 620 });
    });
  });

  it('Removing an item from the constructor', () => {
    cy.visit('/');
    /** Бургер конструктор */
    cy.get(constructor).as('burger');

    /** Кнопка ингредиента, добавления ингредиента  */
    cy.get(ingredients1).find('button').click();
    cy.get('@burger').get(ingredients1).should('exist');

    /** Кнопка ингредиента, добавления ингредиента  */
    cy.get(ingredients2).find('button').click();
    cy.get('@burger').get(ingredients2).should('exist');

    /** Кнопка ингредиента, добавления ингредиента  */
    cy.get(ingredients3).find('button').click();
    cy.get('@burger').get(ingredients3).should('exist');

    /** Елемент внутри бургера */
    cy.get('@burger')
      .get(ingredients1)
      .find(deleteElement)
      .find('svg')
      .last()
      .click()
      .should('not.exist');

    cy.get('@burger')
      .get(ingredients2)
      .find(deleteElement)
      .find('svg')
      .last()
      .click()
      .should('not.exist');
    cy.get('@burger')
      .get(ingredients3)
      .find(deleteElement)
      .find('svg')
      .last()
      .click()
      .should('not.exist');
  });

  it('The button for clearing the constructor', () => {
    cy.visit('/');
    /** Бургер конструктор */
    cy.get(constructor).as('burger');

    /** Кнопка булки, добавления булки */
    cy.get(bun).find('button').click();
    cy.get('@burger').get(bun).should('exist');

    /** Кнопка ингредиента, добавления ингредиента  */
    cy.get(ingredients1).find('button').click();
    cy.get('@burger').get(ingredients1).should('exist');

    /** Кнопка ингредиента, добавления ингредиента  */
    cy.get(ingredients2).find('button').click();
    cy.get('@burger').get(ingredients2).should('exist');

    /** Кнопка ингредиента, добавления ингредиента  */
    cy.get(ingredients3).find('button').click();
    cy.get('@burger').get(ingredients3).should('exist');

    /** Очистка бургера */
    cy.get('@burger').get(`[data-cy='constructor-clear-test']`).click();

    cy.get(modalTest).find('button').contains('Да').click();

    cy.get('@burger').contains('Выберите начинку');
  });

  it('Opening the modal window of the product', () => {
    cy.visit('/');
    /** Клик на ингредиент */
    cy.get(bun).click();
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093d');
  });

  it('Closing the modal window of the product', () => {
    cy.visit('/');
    /** Клик на ингредиент */
    cy.get(bun).click();
    cy.get(modalTest)
      .as('modal')
      .within(() => {
        cy.contains('Детали ингредиента');
        cy.contains('Флюоресцентная булка R2-D3');
      })
      .find('button')
      .click();

    /** Клик на ингредиент */
    cy.get('[data-cy="643d69a5c3f7b9001cfa0947"]').click();
    cy.get('@modal')
      .within(() => {
        cy.contains('Детали ингредиента');
        cy.contains('Плоды Фалленианского дерева');
      })
      .find('button')
      .click();
  });
});
