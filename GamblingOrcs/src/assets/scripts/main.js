import gsap from "./modules/gsap";
import СustomInteraction from "./modules/custom-interaction";
import breakpoints from './modules/breakpoints';
import { sDur, msDur } from './modules/animation-duration';
import testScreen from "./modules/test-screen";
import 'lazysizes';
import { disablePageScroll, enablePageScroll }  from  'scroll-lock';
import { SingleImageSlider } from './modules/single-image-slider';
import { GallerySlider } from './modules/gallery-slider';
import { TeamSlider } from './modules/team-slider';
import Collapse from './modules/collapse';

testScreen();

document.addEventListener('DOMContentLoaded', function() {
  Nav.init();
  ScrollToAnchor.init();

  new СustomInteraction({
    targets: ['a', 'button']
  })

  document.querySelectorAll('.single-image-slider').forEach(el => {
    new SingleImageSlider(el).init();
  })

  document.querySelectorAll('.gallery-slider').forEach(el => {
    new GallerySlider(el).init();
  })

  document.querySelectorAll('.our-team').forEach(el => {
    new TeamSlider(el).init();
  })

  document.querySelectorAll('.our-team').forEach(el => {
    new TeamSlider(el).init();
  })

  document.querySelectorAll('[data-collapse="list"]').forEach(el => {
    new Collapse(el).init();
  })
});

window.addEventListener('load', function() {
  enter();
})

function enter() {
  const wrapperEl = document.querySelector('.wrapper');
  const orkEl = document.querySelector('.home__bg-figure-image');
  const squareEl = document.querySelector('.home__bg-figure-square');

  gsap.timeline()
    .to(wrapperEl, { autoAlpha: 1, duration: sDur[3] })
    .fromTo(orkEl, 
      { yPercent: 10 }, 
      { yPercent: 0, duration: sDur[4], ease: 'power2.out' }, '<')
    .fromTo(squareEl, 
      { xPercent: 10 }, 
      { xPercent: 0, duration: sDur[4], ease: 'power2.out' }, '<')
}

const Nav = {
  init() {
    this.state = false;

    this.element = document.querySelector('.mobile-nav');
    this.trigger = document.querySelector('[data-action="Nav:trigger"]');

    this.animation = gsap.timeline({ paused: true })
      .fadeIn(this.element, 
        { duration: sDur[2] })
    
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

    this.animation.play();

     window.dispatchEvent(new CustomEvent("Nav:open"));
  },

  close() {
    this.state = false;
    this.trigger.classList.remove('active');

    this.animation.reverse().eventCallback('onReverseComplete', () => {
      enablePageScroll();
    });

    window.dispatchEvent(new CustomEvent("Nav:close"));
  }
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
      const hh = document.querySelector('.header').getBoundingClientRect().height;
      const scrollY = targetElement.getBoundingClientRect().top + window.pageYOffset - hh;

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