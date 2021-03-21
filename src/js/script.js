/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  /* eslint-disable no-alert, no-console */
  const templates = {
    // eslint-disable-next-line no-undef
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  const app = {
  
    init: function() {
      const thisApp = this;
      // eslint-disable-next-line no-undef
      console.log('*** App starting ***'); 
      // eslint-disable-next-line no-undef
      console.log('thisApp:', thisApp);
      // eslint-disable-next-line no-undef
      console.log('classNames:', classNames);
      // eslint-disable-next-line no-undef
      console.log('settings:', settings);
      // eslint-disable-next-line no-undef
      console.log('templates:', templates);

      thisApp.initMenu();
    },
  };
/* eslint-enable no-alert, no-console */

  class Product {
    constructor() {
      const thisProduct = this;

      console.log('new Product', thisProduct);
    },
  };

  app.init();
}
