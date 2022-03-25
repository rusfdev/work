import gsap from "./modules/gsap";
import СustomInteraction from "./modules/custom-interaction";
import breakpoints from './modules/breakpoints';
import { sDur, msDur } from './modules/animation-duration';
import testScreen from "./modules/test-screen";
import 'lazysizes';
import { disablePageScroll, enablePageScroll }  from  'scroll-lock';

const Dev = window.location.host === 'localhost:3000';

testScreen();

document.addEventListener('DOMContentLoaded', function() {
  new СustomInteraction({
    targets: ['a', 'button']
  });
  ScrollToAnchor.init();
  Header.init();
  Nav.init();

  InteractionGroup();
});

window.addEventListener('load', function() {
  setTimeout(() => {
    if (!Dev) window.scrollTo(0, 0);
    PlayStartAnimation();
  }, 250);
})


function PlayStartAnimation() {
  const lampWrapperEl = document.querySelector('.home__lamp');

  const lightEl = document.querySelector('.home__light');
  const wrapperEl = document.querySelector('.wrapper');
  const animatedItems = document.querySelectorAll('.home__animated-item');

  const size1 = lightEl.getBoundingClientRect().width;
  const size2 = wrapperEl.getBoundingClientRect().width;
  const scale = size2 / size1 * 2;

  const animation = gsap.timeline({ paused: true })
    .to(document.body, { autoAlpha: 1, duration: 0.5 })
    .fromTo(lampWrapperEl, 
      { x: -20, y: -20 }, 
      { x: 0, y: 0, duration: 0.75, ease: 'power2.out', 
        onComplete: () => {
          lampWrapperEl.classList.add('active');
        } 
      }, '<')
    .fromTo(lightEl, 
      { autoAlpha: 0 }, { autoAlpha: 1, duration: sDur[2] })
    .fromTo(lightEl, 
      { scale: 0.2 },
      { scale: scale, duration: 2, ease: 'sine.inOut', 
        onStart: () => {
          document.body.classList.add('light');
        },
        onComplete: () => {
          lightEl.remove();
        }
      }, '<')
    .fromTo(animatedItems, 
      { autoAlpha: 0 }, 
      { autoAlpha: 1, duration: 1, stagger: { each: 0.1 } }, '-=1.75')
    

  let finalTimeline;

  if (window.innerWidth >= breakpoints.sm) {
    finalTimeline = gsap.fromTo(animatedItems, 
      { x: -20 }, 
      { x: 0, duration: 1, ease: 'power2.out', stagger: { each: 0.1 } })
  } else {
    finalTimeline = gsap.fromTo(animatedItems, 
      { y: -20 }, 
      { y: 0, duration: 1, ease: 'power2.out', stagger: { each: 0.1 } })
  }

  animation.add(finalTimeline, '<').play();
}

function InteractionGroup() {
  const _attr = 'data-interaction-group';

  window.addEventListener('custom:mouseenter', (event) => {
    const group = event.target.closest(`[${_attr}]`);
    if (group) group.classList.add('active');
  });

  window.addEventListener('custom:mouseleave', (event) => {
    const group = event.target.closest(`[${_attr}]`);
    if (group) group.classList.remove('active');
  });
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
      const fixedHeaderHeight = document.querySelector('.header-main').getBoundingClientRect().height;
      const scrollY = targetElement.getBoundingClientRect().top + window.pageYOffset - fixedHeaderHeight;

      this.inScroll = true;
        
      window.dispatchEvent(new CustomEvent("ScrollToAnchor"));

      if (this.animation && this.animation.isActive()) this.animation.pause(); 

      this.animation = gsap.to(window, { 
        scrollTo: scrollY, 
        duration: sDur[3], 
        onComplete: () => {
          this.inScroll = false;
        }
      });
    }

    document.addEventListener('click', clickEvent);
  }
}

const Header = {
  element: document.querySelector('.header'),

  init: function() {
    this.checkState = () => {
      let fixed = this.element.classList.contains('header_fixed'),
          hidden = this.element.classList.contains('header_hidden'),
          scrollTop = window.pageYOffset < this.oldScroll,
          scrollEnough = window.pageYOffset > this.height,
          visibleEnough = window.pageYOffset > window.innerHeight;

      if (scrollEnough && !fixed) {
        this.element.classList.add('header_fixed');
        Nav.element.classList.add('header-is-fixed');
      } else if (!scrollEnough && fixed) {
        this.element.classList.remove('header_fixed');
        Nav.element.classList.remove('header-is-fixed');
      }

      if (!hidden && visibleEnough && (!scrollTop || ScrollToAnchor.inScroll)) {
        this.element.classList.add('header_hidden');
      } else if (hidden && (!visibleEnough || (scrollTop && !ScrollToAnchor.inScroll))) {
        this.element.classList.remove('header_hidden');
      }

      this.oldScroll = window.pageYOffset;
    }

    window.addEventListener('scroll', this.checkState);
    this.checkState();
  },
  get height() {
    return this.element.getBoundingClientRect().height;
  }
}

const Nav = {
  element: document.querySelector('.mobile-nav'),
  trigger: document.querySelector('[data-action="Nav:trigger"]'),

  state: false,

  init() {
    this.trigger.addEventListener('click', () => {
      if (!this.state) this.open();
      else this.close();
    })

    window.addEventListener('ScrollToAnchor', () => {
      if (this.state) this.close();
    });
  },

  open() {
    this.state = true;
    disablePageScroll();
    this.trigger.classList.add('active');
    this.element.classList.add('active');
  },

  close() {
    this.state = false;
    enablePageScroll();
    this.trigger.classList.remove('active');
    this.element.classList.remove('active');
  }
}