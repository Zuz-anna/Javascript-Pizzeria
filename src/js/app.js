import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';

const app = {
  initPages: function() {
    const thisApp = this;

    thisApp.pages = document.querySelector (select.containerOf.pages).children; // dzięki childres wszystkie elementy wewnątrz containera będę zawarte w stałej
    thisApp.homeLinks = document.querySelectorAll(select.nav.homeLinks);
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    
    const idFromHash = window.location.hash.replace('#/', '');
    let pageMatchingHash = thisApp.pages[0].id;

    for ( let page of thisApp.pages ) {
      if ( page.id == idFromHash ) {
        pageMatchingHash = page.id;
        break;
      } 
    }
    thisApp.activatePage(pageMatchingHash);  

    const navs = [...thisApp.homeLinks, ...thisApp.navLinks ];
    
    for ( let nav of navs) {
      nav.addEventListener('click', function(event) {
        const clickedElement = this;
        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');
        thisApp.activatePage(id);

        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId) {
    const thisApp = this;

    for ( let page of thisApp.pages ) {
      page.classList.toggle(
        classNames.pages.active, 
        page.id == pageId
      );
    }

    for ( let link of thisApp.navLinks ) {
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initHome: function() {
    const thisApp = this;

    thisApp.homeWrapper = document.querySelector(select.containerOf.home);
    thisApp.home = new Home(thisApp.homeWrapper);
  }, 

  initBooking: function() {
    const thisApp = this;

    thisApp.bookingElement = document.querySelector (select.containerOf.booking);
    thisApp.booking = new Booking (thisApp.bookingElement);
  },

  initMenu: function() {
    const thisApp = this; 

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  init: function() {
    const thisApp = this;
    thisApp.initHome();
    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
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
        thisApp.initMenu(); 
      });
    thisApp.data = {};
  },

  initCart: function() {
    const thisApp = this;
    const cartElement = document.querySelector (select.containerOf.cart);
      
    thisApp.cart = new Cart (cartElement); 

    thisApp.productList = document.querySelector (select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event) {
      app.cart.add (event.detail.product);
    });
  },
};

app.init();
