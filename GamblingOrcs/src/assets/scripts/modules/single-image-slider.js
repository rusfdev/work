import { msDur } from './animation-duration';

import Swiper, { Navigation, Lazy } from 'swiper';
import 'swiper/css';

export class SingleImageSlider {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }

  init() {
    const prevButtonEl = this.parentEl.querySelector('.swiper-button-prev');
    const nextButtonEl = this.parentEl.querySelector('.swiper-button-next');

    this.swiper = new Swiper(this.parentEl, {
      modules: [Navigation, Lazy],
      slidesPerView: 1,
      touchStartPreventDefault: false,
      loop: true,
      speed: msDur[3],
      lazy: {
        loadOnTransitionStart: true,
        loadPrevNext: true
      },
      navigation: {
        prevEl: prevButtonEl,
        nextEl: nextButtonEl
      }
    });
  }
}