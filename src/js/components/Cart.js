import {settings, select, templates, classNames} from '../settings.js';
import utils from '../utils.js';
import CartProduct from '../components/CartProduct.js';


class Cart {

  constructor(element) {
    const thisCart = this; 

    thisCart.products = [];
    thisCart.getElements (element);
    thisCart.initActions();
  }

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
    thisCart.dom.address = thisCart.dom.form.querySelector (select.cart.address);
    thisCart.dom.phone = thisCart.dom.form.querySelector (select.cart.phone);
  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener ('click', function (event) {
      event.preventDefault(); 
      thisCart.dom.wrapper.classList.toggle (classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener ('updated', function() {
      thisCart.update();
    });
    
    thisCart.dom.productList.addEventListener ('remove', function(event) { 
      thisCart.remove(event.detail.cartProduct); 
    });

    thisCart.dom.form.addEventListener ('submit', function(event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  update() {
    const thisCart = this;
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for (thisCart.product of thisCart.products) {
      thisCart.totalNumber += thisCart.product.amount;
      thisCart.subtotalPrice += thisCart.product.price;
    }

    if (thisCart.totalNumber !== 0) {
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    } else {
      thisCart.totalPrice = 0;
      thisCart.deliveryFee = 0;
    } 

    for (let price of thisCart.dom.totalPrice) {
      price.innerHTML = thisCart.totalPrice;
    }

    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
  }

  add(menuProduct) {
    const thisCart = this;
    const generatedHTML = templates.cartProduct (menuProduct);
    const generatedDOM = utils.createDOMFromHTML (generatedHTML);

    thisCart.dom.productList.appendChild (generatedDOM);
    thisCart.products.push (new CartProduct(menuProduct, generatedDOM));
    thisCart.update();
  }

  remove(cartProduct) { 
    const thisCart = this; 
    const indexOfProduct = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(indexOfProduct, 1);
    cartProduct.dom.wrapper.remove();  
    thisCart.update();
  }

  sendOrder() {
    const thisCart = this; 
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.data.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: []
    };

    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());  
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    
    fetch (url, options);
  }
}

export default Cart;