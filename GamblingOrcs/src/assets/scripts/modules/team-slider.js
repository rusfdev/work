import { msDur } from './animation-duration';
import breakpoints from './breakpoints';

import Swiper from 'swiper';
import 'swiper/css';

export class TeamSlider {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }

  init() {
    this._checkState();

    window.addEventListener('resize', () => {
      this._checkState();
    });
  }

  _checkState() {
    if (window.innerWidth < breakpoints.sm && !this.swiper) {
      this._initSlider();
    } else if (window.innerWidth >= breakpoints.sm && this.swiper) {
      this._destroySlider();
    }
  }

  _initSlider() {
    const swiperEl = this.parentEl.querySelector('.swiper');

    this.swiper = new Swiper(swiperEl, {
      slidesPerView: 'auto',
      touchStartPreventDefault: false,
      centeredSlides: true,
      speed: msDur[3],
      loop: true
    });
  }

  _destroySlider() {
    console.log('destroy')
    this.swiper.destroy();
    delete this.swiper;
  }
}