/* eslint-disable no-unused-vars */

import {select, templates} from './settings.js';


export class Booking {
  constructor(element) {
    const thisBooking = this; 

    thisBooking.render(element);
    thisBooking.initWidgets();
  }
  
  render(element) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
  }
}