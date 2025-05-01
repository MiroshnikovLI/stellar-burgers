// <reference types="cypress" />

describe('Burger Bar Tests', () => {
  const userName = 'Miroshnikov-li@yandex.ru';
  const userPassword = 'miron147963den';

  it('Making an order', () => {
    cy.intercept('POST', '/', { fixture: 'ingredients.json' });
    cy.intercept('GET', '/api/auth/user', { fixture: 'login' });
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as('order');

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');

    cy.visit('http://localhost:4000');

    /** Бургер конструктор */
    cy.get(`[data-cy="constructor-element-test"]`).as('burger');

    /** Добавляем ингредиенты */
    cy.get('[data-cy="643d69a5c3f7b9001cfa093d"]').find('button').click();
    cy.get(`[data-cy="643d69a5c3f7b9001cfa0941"]`).find('button').click();
    cy.get(`[data-cy="643d69a5c3f7b9001cfa093e"]`).find('button').click();

    /** Кнопка оформить заказ, оформление заказа  */
    cy.get(`button`).contains('Оформить заказ').click();

    // Проверяем, что запрос был отправлен
    cy.wait('@order').then((interception) => {
      // Проверяем тело запроса
      expect(interception.request.body).to.deep.equal({
        ingredients: [
          '643d69a5c3f7b9001cfa0941',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa093d'
        ]
      });
    });

    /** Модальное окно */
    cy.get(`[data-cy='modal-test']`).as('modal');

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
    cy.visit('http://localhost:4000');

    let initialPosition: JQuery.Coordinates;

    /** Бургер конструктор */
    cy.get('[data-cy="constructor-element-test"]').as('burger');

    /** Добавления ингредиента  */
    cy.get(`[data-cy="643d69a5c3f7b9001cfa0941"]`).find('button').click();

    /** КДобавления ингредиента  */
    cy.get(`[data-cy="643d69a5c3f7b9001cfa093e"]`).find('button').click();

    /** Добавления ингредиента  */
    cy.get(`[data-cy="643d69a5c3f7b9001cfa0946"]`).find('button').click();

    /** Елемент внутри бургера */
    cy.get('@burger')
      .find('[data-cy="643d69a5c3f7b9001cfa0941"]')
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
    cy.visit('http://localhost:4000');

    /** Бургер конструктор */
    cy.get('[data-cy="constructor-element-test"]').as('burger');

    /** Кнопка ингредиента, добавления ингредиента  */
    cy.get(`[data-cy="643d69a5c3f7b9001cfa0941"]`).find('button').click();
    cy.get('@burger')
      .get(`[data-cy="643d69a5c3f7b9001cfa0941"]`)
      .should('exist');

    /** Кнопка ингредиента, добавления ингредиента  */
    cy.get(`[data-cy="643d69a5c3f7b9001cfa093e"]`).find('button').click();
    cy.get('@burger')
      .get(`[data-cy="643d69a5c3f7b9001cfa093e"]`)
      .should('exist');

    /** Кнопка ингредиента, добавления ингредиента  */
    cy.get(`[data-cy="643d69a5c3f7b9001cfa0946"]`).find('button').click();
    cy.get('@burger')
      .get(`[data-cy="643d69a5c3f7b9001cfa0946"]`)
      .should('exist');

    /** Елемент внутри бургера */
    cy.get('@burger')
      .get(`[data-cy="643d69a5c3f7b9001cfa0941"]`)
      .find('[data-cy="delete-element-test"]')
      .find('svg')
      .last()
      .click()
      .should('not.exist');

    cy.get('@burger')
      .get(`[data-cy="643d69a5c3f7b9001cfa093e"]`)
      .find('[data-cy="delete-element-test"]')
      .find('svg')
      .last()
      .click()
      .should('not.exist');
    cy.get('@burger')
      .get(`[data-cy="643d69a5c3f7b9001cfa0946"]`)
      .find('[data-cy="delete-element-test"]')
      .find('svg')
      .last()
      .click()
      .should('not.exist');
  });

  it('The button for clearing the constructor', () => {
    cy.visit('http://localhost:4000');

    /** Бургер конструктор */
    cy.get('[data-cy="constructor-element-test"]').as('burger');

    /** Кнопка булки, добавления булки */
    cy.get('[data-cy="643d69a5c3f7b9001cfa093d"]').find('button').click();
    cy.get('@burger')
      .get(`[data-cy="643d69a5c3f7b9001cfa093d"]`)
      .should('exist');

    /** Кнопка ингредиента, добавления ингредиента  */
    cy.get(`[data-cy="643d69a5c3f7b9001cfa0941"]`).find('button').click();
    cy.get('@burger')
      .get(`[data-cy="643d69a5c3f7b9001cfa0941"]`)
      .should('exist');

    /** Кнопка ингредиента, добавления ингредиента  */
    cy.get(`[data-cy="643d69a5c3f7b9001cfa093e"]`).find('button').click();
    cy.get('@burger')
      .get(`[data-cy="643d69a5c3f7b9001cfa093e"]`)
      .should('exist');

    /** Кнопка ингредиента, добавления ингредиента  */
    cy.get(`[data-cy="643d69a5c3f7b9001cfa0946"]`).find('button').click();
    cy.get('@burger')
      .get(`[data-cy="643d69a5c3f7b9001cfa0946"]`)
      .should('exist');

    /** Очистка бургера */
    cy.get('@burger').get(`[data-cy='constructor-clear-test']`).click();

    cy.get(`[data-cy='modal-test']`).find('button').contains('Да').click();

    cy.get('@burger').contains('Выберите начинку');
  });

  it('Opening the modal window of the product', () => {
    cy.visit('http://localhost:4000');

    /** Клик на ингредиент */
    cy.get('[data-cy="643d69a5c3f7b9001cfa093d"]').click();
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093d');
  });

  it('Закрытие модального окна изделия', () => {
    cy.visit('http://localhost:4000');

    /** Клик на ингредиент */
    cy.get('[data-cy="643d69a5c3f7b9001cfa093d"]').click();
    cy.get(`[data-cy='modal-test']`)
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
