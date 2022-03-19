import gsap from "./modules/gsap";
import СustomInteraction from "./modules/custom-interaction";
import breakpoints from './modules/breakpoints';
import { sDur, msDur } from './modules/animation-duration';
import testScreen from "./modules/test-screen";
import 'lazysizes';
import { disablePageScroll, enablePageScroll }  from  'scroll-lock';

const Dev = window.location.host === 'localhost:3000';

document.addEventListener('DOMContentLoaded', function() {
  new СustomInteraction({
    targets: ['a', 'button']
  });
  ScrollToAnchor.init();
  Header.init();
});

window.addEventListener('load', function() {
  setTimeout(() => {
    if (!Dev) window.scrollTo(0, 0);
    PlayStartAnimation();
  }, 250);
})

function PlayStartAnimation() {
  const lampEl = document.querySelector('.home__lamp');
  const lightEl = document.querySelector('.home__light');
  const wrapperEl = document.querySelector('.wrapper');

  const size1 = lightEl.getBoundingClientRect().width;
  const size2 = wrapperEl.getBoundingClientRect().width;
  const scale = size2 / size1 * 2;

  gsap.timeline()
    .to(document.body, { autoAlpha: 1, duration: 0.5 })
    .fromTo(lampEl, 
      { x: -20, y: -20 }, 
      { x: 0, y: 0, duration: 0.75, ease: 'power2.out', 
        onComplete: () => {
          lampEl.classList.add('active');
        } 
      }, '<')
    .fromTo(lightEl, 
      { autoAlpha: 0 }, { autoAlpha: 1, duration: sDur[2] })
    .fromTo(lightEl, 
      { scale: 0.2 },
      { scale: scale, duration: 1.5, ease: 'power1.out', 
        onStart: () => {
          document.body.classList.add('light');
        },
        onComplete: () => {
          lightEl.remove();
        }
      }, '<')

}

const ScrollToAnchor = {
  init() {
    const triggerSelector = '[data-action="ScrollToAnchor"]';

    const clickEvent = (event) => {
      const triggerElement = event.target.closest(`${triggerSelector}`);
      if (!triggerElement) return;

      event.preventDefault();

      const attr = triggerElement.getAttribute('href'),
            targetElement = document.querySelector(`${attr}`);

      if (!targetElement) return;

      scrollEvent(targetElement);
    }

    const scrollEvent = (targetElement) => {
      const margin = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--section-margin')
        .replace(/[^\d.-]/g, ''));
      const scrollY = targetElement.getBoundingClientRect().top + window.pageYOffset - margin;

      this.inScroll = true;
        
      window.dispatchEvent(new CustomEvent("ScrollToAnchor"));

      if (this.animation && this.animation.isActive()) this.animation.pause(); 

      this.animation = gsap.to(window, { scrollTo: scrollY, duration: sDur[3], onComplete: () => {
          this.inScroll = false;
      }});
    }

    document.addEventListener('click', clickEvent);
  }
}

const Header = {
  init: function() {
    this.$element = document.querySelector('.header');

    this.checkState = () => {
      let fixed = this.$element.classList.contains('header_fixed'),
          hidden = this.$element.classList.contains('header_hidden'),
          scrollTop = window.pageYOffset < this.oldScroll,
          scrollEnough = window.pageYOffset > this.height,
          visibleEnough = window.pageYOffset > window.innerHeight;

      if (scrollEnough && !fixed) {
        this.$element.classList.add('header_fixed');
      } else if (!scrollEnough && fixed) {
        this.$element.classList.remove('header_fixed');
      }

      if (!hidden && visibleEnough && (!scrollTop || ScrollToAnchor.inScroll)) {
        this.$element.classList.add('header_hidden');
      } else if (hidden && (!visibleEnough || (scrollTop && !ScrollToAnchor.inScroll))) {
        this.$element.classList.remove('header_hidden');
      }

      this.oldScroll = window.pageYOffset;
    }

    window.addEventListener('scroll', this.checkState);
    this.checkState();
  },
  get height() {
    return this.$element.getBoundingClientRect().height;
  }
}