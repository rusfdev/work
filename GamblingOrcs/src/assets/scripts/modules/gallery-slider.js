import { msDur } from './animation-duration';

import Swiper, { Scrollbar } from 'swiper';
import 'swiper/css';

export class GallerySlider {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }

  init() {
    const swiperEl = this.parentEl.querySelector('.swiper');
    const scrollbarEl = this.parentEl.querySelector('.swiper-scrollbar');

    this.swiper = new Swiper(swiperEl, {
      modules: [Scrollbar],
      slidesPerView: 'auto',
      touchStartPreventDefault: false,
      centeredSlides: true,
      speed: msDur[3],
      scrollbar: {
        el: scrollbarEl,
        draggable: true,
        dragSize: 100
      }
    });
  }
}