import { select } from '../settings.js';

class Carousel {
  constructor(element) {
    const thisCarousel = this;
    thisCarousel.render(element);
    thisCarousel.initPlugin();
  }

  render(element) {
    const thisCarousel = this;

    thisCarousel.dom = {};
    thisCarousel.dom.wrapper = element; 
    thisCarousel.dom.carousel = thisCarousel.dom.wrapper.querySelector(select.widgets.home.carousel);
  }

  initPlugin() {
    const thisCarousel = this;

    // eslint-disable-next-line no-undef
    new Flickity(thisCarousel.dom.carousel, {
      cellAlign: 'left',
      contain: true,
      draggable: '>1',
      autoplay: true,
      prevNextButtons: false,
    });
  }
}

export default Carousel;