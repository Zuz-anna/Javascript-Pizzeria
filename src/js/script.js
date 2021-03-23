/* eslint-disable no-undef */
/* eslint-disable no-extra-semi */
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
    menuProduct: Handlebars.compile (document.querySelector (select.templateOf.menuProduct).innerHTML),
  };



  class Product {

    constructor (id, data) {

      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.initAccordion();
    };

    renderInMenu() {

      const thisProduct = this;
      const generatedHTML = templates.menuProduct (thisProduct.data);
      const menuContainer = document.querySelector (select.containerOf.menu);

      thisProduct.element = utils.createDOMFromHTML (generatedHTML);

      menuContainer.appendChild (thisProduct.element);
    };

    initAccordion() {

      const thisProduct = this;
      const clickableTrigger = thisProduct.element.querySelector (select.menuProduct.clickable); //Nie mam pojęcia dlaczego akurat na thisProduct.element

      clickableTrigger.addEventListener ( 'click', function(Event) {
        
        Event.preventDefault();

        const activeProduct = document.querySelector (select.all.menuProductsActive);

        if (activeProduct !== null && activeProduct !== thisProduct.element) {
          activeProduct.classList.remove (classNames.menuProduct.wrapperActive);
        } 
          
        thisProduct.element.classList.toggle (classNames.menuProduct.wrapperActive); 
      });
    };
  };

  const app = {

    initMenu: function() {

      const thisApp = this; 

      console.log('thisApp.data:', thisApp.data);

      for (let productData in thisApp.data.products) {
        new Product (productData, thisApp.data.products[productData]);
      }
    },

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

      thisApp.initData();
      thisApp.initMenu();
    },

    initData: function() {

      const thisApp = this;

      thisApp.data = dataSource;
    },
  };


  app.init();
}
