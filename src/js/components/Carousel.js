class Carousel {
  constructor(element) {
    const thisCarousel = this;
    thisCarousel.render(element);
    thisCarousel.initPlugin();
  }

  render(element) {
    const thisCarousel = this;

    thisCarousel.wrapper = element;
  }

  initPlugin() {
    const thisCarousel = this;

    // eslint-disable-next-line no-undef
    new Flickity(thisCarousel.wrapper, {
      cellAlign: 'left',
      contain: true,
      autoPlay: true,
      prevNextButtons: false,
      pauseAutoPlayOnHover: false,
    });
  }
}

export default Carousel;