/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-extra-semi */
/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product',
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
        input: 'input.amount', 
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },

    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    cart: {
      wrapperActive: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
    cart: {
      defaultDeliveryFee: 20,
    },
  };

  const templates = {
    // eslint-disable-next-line no-undef
    menuProduct: Handlebars.compile (document.querySelector (select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  };

  class Product {

    constructor (id, data) {

      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
    };

    renderInMenu() {

      const thisProduct = this;
      const generatedHTML = templates.menuProduct (thisProduct.data);
      const menuContainer = document.querySelector (select.containerOf.menu);

      thisProduct.element = utils.createDOMFromHTML (generatedHTML);

      menuContainer.appendChild (thisProduct.element);
    };

    getElements() {

      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector (select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector (select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll (select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector (select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector (select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector (select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector (select.menuProduct.amountWidget);
    };

    initAccordion() {

      const thisProduct = this;
      
      thisProduct.accordionTrigger.addEventListener ( 'click', function (Event) {

        Event.preventDefault();

        const activeProduct = document.querySelector (select.all.menuProductsActive);

        if (activeProduct !== null && activeProduct !== thisProduct.element) {
          activeProduct.classList.remove (classNames.menuProduct.wrapperActive);
        } 
          
        thisProduct.element.classList.toggle (classNames.menuProduct.wrapperActive); 
      });
    };

    initOrderForm() {
      
      const thisProduct = this;
      
      thisProduct.form.addEventListener ('submit', function (Event) {
        
        Event.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.formInputs) {
        input.addEventListener ('change', function (Event) {

          Event.preventDefault();
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener ('click', function (Event) {

        Event.preventDefault();
        thisProduct.addToCart();
        thisProduct.processOrder();
      });
    };

    initAmountWidget () {

      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget (thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener ('updated', function () {
        thisProduct.processOrder();
      });
    };

    processOrder() {
      const thisProduct = this;
      const formData = utils.serializeFormToObject (thisProduct.form);
      let price = thisProduct.data.price; 

      for (let paramId in thisProduct.data.params) { 
        const param = thisProduct.data.params [paramId];

        for (let optionId in param.options) {
          const option = param.options[optionId];
          const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          
          if (optionSelected) {
            if (!option.default) { 
              price += option.price;
            }; 
          } else if (option.default) { 
            price -= option.price;
          }; 
          
          if (optionImage) {
            if (optionSelected) {
              optionImage.classList.add(classNames.menuProduct.imageVisible);
            } else if (!optionSelected) {
              optionImage.classList.remove (classNames.menuProduct.imageVisible);
            };
          };
        };
      };
      price *= thisProduct.amountWidget.value; 
      thisProduct.priceElem.innerHTML = price;  
    };

    addToCart() {
      const thisProduct = this;

      app.cart.add (thisProduct);
    };

  };

  class AmountWidget { 

    constructor (element) {

      const thisWidget = this;

      thisWidget.getElements (element);
      thisWidget.setValue (thisWidget.input.value);
      thisWidget.initActions();
    };

    getElements (element) {

      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector (select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector (select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector (select.widgets.amount.linkIncrease);
    };

    setValue (value) {

      const thisWidget = this;
      const newValue = parseInt (value);
      const valueMin = settings.amountWidget.defaultMin;
      const valueMax = settings.amountWidget.defaultMax;

      thisWidget.value = settings.amountWidget.defaultValue;

      if (thisWidget.value !== (newValue === 1) && !isNaN (newValue) && newValue >= valueMin && newValue <= valueMax) {
        thisWidget.value = newValue;
        thisWidget.announce();
      };

      thisWidget.input.value = thisWidget.value;
    };

    initActions(){

      const thisWidget = this;

      thisWidget.input.addEventListener ('change', function () {
        thisWidget.setValue (thisWidget.input.value);
      });

      thisWidget.linkDecrease.addEventListener ('click', function (Event) {
        Event.preventDefault();
        thisWidget.setValue (thisWidget.value -1);
      });

      thisWidget.linkIncrease.addEventListener ('click', function (Event) {
        Event.preventDefault();
        thisWidget.setValue (thisWidget.value +1);
      });
    };

    announce () {
      const thisWidget = this;
      const event = new Event ('updated');

      thisWidget.element.dispatchEvent (event);
    };
  };

  class Cart {

    constructor (element) {

      const thisCart = this; 

      thisCart.products = [];
      thisCart.getElements (element);
      thisCart.initActions();
      console.log ('new cart', thisCart);
    };

    getElements (element) {

      const thisCart = this;

      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector (select.cart.toggleTrigger);
    };

    initActions () {

      const thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener ('click', function (Event) {

        Event.preventDefault();
        thisCart.dom.wrapper.classList.toggle (classNames.cart.wrapperActive);
      });
    };

    add (menuProduct) {
      const thisCart = this;
      console.log('adding procudct', menuProduct);
    };

  };

  const app = {

    initMenu: function() {

      const thisApp = this; 

      for (let productData in thisApp.data.products) {
        new Product (productData, thisApp.data.products[productData]);
      }
    },

    init: function() {

      const thisApp = this;

      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },

    initData: function() {

      const thisApp = this;

      thisApp.data = dataSource;
    },

    initCart: function() {

      const thisApp = this;
      const cartElem = document.querySelector (select.containerOf.cart);
      
      thisApp.cart = new Cart (cartElem);
    }
  };

  app.init();
}
