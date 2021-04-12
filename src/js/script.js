/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-extra-semi */
/* global Handlebars, utils */ // eslint-disable-line no-unused-vars

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
      totalNumber: `.cart__total-number`,  //dlaczego tutaj jest inny cudzysłów
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
    db: {
      url: '//localhost:3131',
      product: 'product',
      order: 'order',
    },
  };

  const templates = {
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
      // thisProduct.prepareCartProductParams(); sprawdź później czy to coś zmienia
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
      
      thisProduct.accordionTrigger.addEventListener ( 'click', function (event) {

        event.preventDefault();
        const activeProduct = document.querySelector (select.all.menuProductsActive);

        if (activeProduct !== null && activeProduct !== thisProduct.element) {
          activeProduct.classList.remove (classNames.menuProduct.wrapperActive);
        } 
          
        thisProduct.element.classList.toggle (classNames.menuProduct.wrapperActive); 
      });
    };

    initOrderForm() {
      const thisProduct = this;
      
      thisProduct.form.addEventListener ('submit', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.formInputs) {
        input.addEventListener ('change', function() {
          thisProduct.processOrder(); //usunięty event default
        });
      }

      thisProduct.cartButton.addEventListener ('click', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    };

    initAmountWidget() {
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
      thisProduct.priceSingle = price;
      thisProduct.priceElem.innerHTML = price;
    };

    addToCart() {
      const thisProduct = this;

      app.cart.add(thisProduct.prepareCartProduct());
    };

    prepareCartProduct() {
      const thisProduct = this;
      const productSummary = {
        id: thisProduct.id,
        name: thisProduct.data.name,
        amount: thisProduct.amountWidget.value,
        priceSingle: thisProduct.priceSingle,
        price: thisProduct.amountWidget.value * thisProduct.priceSingle,
        params: thisProduct.prepareCartProductParams(),
      };
      return (productSummary);
    };

    prepareCartProductParams() {
      const thisProduct = this;
      const formData = utils.serializeFormToObject (thisProduct.form);
      const params = {};

      for (let paramId in thisProduct.data.params) { 
        const param = thisProduct.data.params[paramId];

        params[paramId] = {
          label: param.label,
          options: {},
        };

        for (let optionId in param.options) {
          const option = param.options[optionId];
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          
          if (optionSelected) {
            params[paramId].options[optionId] = option.label;
          }; 
        };
      };
      return params;
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

      thisWidget.linkDecrease.addEventListener ('click', function (event) {
        event.preventDefault();
        thisWidget.setValue (thisWidget.value -1);
      });

      thisWidget.linkIncrease.addEventListener ('click', function (event) {
        event.preventDefault();
        thisWidget.setValue (thisWidget.value +1);
      });
    };

    announce () {
      const thisWidget = this;
      const event = new CustomEvent ('updated', {
        bubbles: true
      });

      thisWidget.element.dispatchEvent (event);
    };
  };

  class Cart {

    constructor (element) {
      const thisCart = this; 

      thisCart.products = [];
      thisCart.getElements (element);
      thisCart.initActions();
    };

    getElements(element) {
      const thisCart = this;

      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = element.querySelector (select.cart.toggleTrigger);
      thisCart.dom.productList = element.querySelector (select.cart.productList);
      thisCart.dom.deliveryFee = element.querySelector (select.cart.deliveryFee);
      thisCart.dom.subtotalPrice = element.querySelector (select.cart.subtotalPrice);
      thisCart.dom.totalPrice = element.querySelectorAll (select.cart.totalPrice);
      thisCart.dom.totalNumber = element.querySelector (select.cart.totalNumber);
      thisCart.dom.form = element.querySelector (select.cart.form);
    };

    initActions() {
      const thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener ('click', function (event) {
        event.preventDefault(); //dodany prevent default
        thisCart.dom.wrapper.classList.toggle (classNames.cart.wrapperActive);
      });

      thisCart.dom.productList.addEventListener ('updated', function() {
        thisCart.update();
      });
      
      thisCart.dom.productList.addEventListener ('remove', function(event) { //Changed click to remove
        thisCart.remove(event.detail.cartProduct); 
      });

      thisCart.dom.form.addEventListener ('submit', function(event) {
        event.preventDefault();
        thisCart.sendOrder();
      });
    };

    update() {
      const thisCart = this;
      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;

      for (let product of thisCart.products) {
        thisCart.totalNumber += product.amount;
        thisCart.subtotalPrice += product.price;
      };

      if (0 !== thisCart.totalNumber) {
        thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      } else {
        thisCart.totalPrice = 0;
        thisCart.deliveryFee = 0;
      }; 

      for (let price of thisCart.dom.totalPrice) {
        price.innerHTML = thisCart.totalPrice;
      };

      thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
      thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
      thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    };

    add(menuProduct) {
      const thisCart = this;
      const generatedHTML = templates.cartProduct (menuProduct);
      const generatedDOM = utils.createDOMFromHTML (generatedHTML);

      thisCart.dom.productList.appendChild (generatedDOM);
      thisCart.products.push (new CartProduct(menuProduct, generatedDOM));
      thisCart.update();
    };

    remove(cartProduct) { 
      const thisCart = this; 
      const indexOfProduct = thisCart.products.indexOf(cartProduct);
      thisCart.products.splice(indexOfProduct, 1);
      cartProduct.dom.wrapper.remove();  
      thisCart.update();
    };

    sendOrder() {
      const thisCart = this; 
      const url = settings.db.url + '/' + settings.db.order;
    };
  };

  class CartProduct {
    constructor (menuProduct, element) {
      const thisCartProduct = this;

      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.params = menuProduct.params;

      thisCartProduct.getElements (element); 
      thisCartProduct.initAmountWidget();// usunęłaś argument z wywołania
      thisCartProduct.initActions();
    };

    getElements(element) {
      const thisCartProduct = this;

      thisCartProduct.dom = {};
      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = element.querySelector (select.cartProduct.amountWidget);
      thisCartProduct.dom.price = element.querySelector (select.cartProduct.price);
      thisCartProduct.dom.edit = element.querySelector (select.cartProduct.edit);
      thisCartProduct.dom.remove = element.querySelector (select.cartProduct.remove);
    }; 

    initAmountWidget() {
      const thisCartProduct = this;

      thisCartProduct.amountWidget = new AmountWidget (thisCartProduct.dom.amountWidget);
      thisCartProduct.dom.amountWidget.addEventListener ('updated', function () {
        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.price = thisCartProduct.amount * thisCartProduct.priceSingle;
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
      });
    };

    initActions() {
      const thisCartProduct = this;

      thisCartProduct.dom.edit.addEventListener ('click', function (event) { //changed edit to click
        event.preventDefault();
      });

      thisCartProduct.dom.remove.addEventListener ('click', function (event) { //changed remove to click
        event.preventDefault();
        thisCartProduct.remove();
      });
    };

    remove() {
      const thisCartProduct = this;
      const event = new CustomEvent ('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        },
      });
      thisCartProduct.dom.wrapper.dispatchEvent (event);
    };
  };

  const app = {

    initMenu: function() {
      const thisApp = this; 

      for (let productData in thisApp.data.products) {
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      };
    },

    init: function() {
      const thisApp = this;

      thisApp.initData();
      thisApp.initCart();
    },

    initData: function() {
      const thisApp = this;
      const url = settings.db.url + '/' + settings.db.product;

      fetch(url)
        .then(function(rawResponse) {
          return rawResponse.json();
        })
        .then(function(parsedResponse) {
          thisApp.data.products = parsedResponse;
          thisApp.initMenu(); //added thisApp.data.products declaration
          console.log('parsedResponse', parsedResponse);
        });
      console.log('thisApp.data', JSON.stringify(thisApp.data));
      thisApp.data = {};
    },

    initCart: function() {
      const thisApp = this;
      const cartElem = document.querySelector (select.containerOf.cart);
      
      thisApp.cart = new Cart (cartElem);
    },
  };

  app.init();
};
