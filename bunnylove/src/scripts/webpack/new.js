import { gsap } from "gsap";
gsap.defaults({
  ease: "power2.inOut",
  duration: 1
});
import { disablePageScroll, enablePageScroll } from 'scroll-lock';

const breakpoints = {
  xs: 576,
  sm: 768,
  md: 1024,
  lg: 1200
}

const duration = {
  1: 0.15,
  2: 0.3,
  3: 0.5,
  4: 1
}

//animations
gsap.registerEffect({
  name: "fadeIn",
  effect: ($element, config) => {
    return gsap.fromTo($element, {autoAlpha: 0}, {immediateRender: false, autoAlpha: 1, duration: config.duration || duration[1],
      onStart: () => {
        $element.forEach($this => {
          $this.classList.add('d-block');
        })
      },
      onReverseComplete: () => {
        $element.forEach($this => {
          gsap.set($this, {clearProps: "all"});
          $this.classList.remove('d-block');
        })
      }
    })
  },
  extendTimeline: true
});

document.addEventListener("DOMContentLoaded", function () {
  checkScrollbar();
  mobileSearch();
  header();
  slider.init();
  CityConfirmationModal.init();
  Modal.init();
});

function checkScrollbar() {
  const testDiv = document.createElement('div');

  testDiv.style.cssText = `
    position: fixed;
    width: 100%;`;

  document.body.insertAdjacentElement('afterbegin', testDiv);

  let testWidth = testDiv.getBoundingClientRect().width,
      windowWidth = window.innerWidth,
      value = windowWidth - testWidth;

  testDiv.remove();

  document.documentElement.style.setProperty('--scrollbar-width-property', `${value}px`);
}

function mobileSearch() {
  let $open = $('.mobile-search-open'),
      $close = $('.mobile-search__close'),
      $block = $('.mobile-search');

  $open.add($close).on('click', function(event) {
    event.preventDefault();
    if ($(this).is($open)) $block.addClass('active');
    else $block.removeClass('active');
  })

}

function header() {
  let $header = $('.new-header__center'),
      scroll;

  check();
  $(window).scroll(function() {
    check();
  });

  function check() {
    scroll = $(window).scrollTop();
    if(scroll>0){
      $header.addClass('active');
    } else {
      $header.removeClass('active');
    }
  }
}

window.slider = {
  arrowPrev: '<svg class="icon" stroke="none" fill="currentColor" viewBox="0 0 10.5 18.1"><path d="M9,0l1.4,1.4L2.8,9l7.6,7.6L9,18.1L0,9C0,9,9.1,0,9,0z"></path></svg>',
  arrowNext: '<svg class="icon" stroke="none" fill="currentColor" viewBox="0 0 10.5 18.1"><path d="M1.4,18.1L0,16.7l7.6-7.6L0,1.5L1.4,0l9,9.1C10.4,9.1,1.3,18.1,1.4,18.1z"></path></svg>',
  init: function() {
    this.el = $('.slider').not('.slick-initialized');
    slider.el.each(function () {
      let slideCount = 1,
          slideCountLg = 1,
          slideCountMd = 1,
          slideCountSm = 1,
          slideCountXs = 1,
          arrows = false,
          dots = false,
          centerMode = false,
          autoplay = false;
      
      if($(this).is('.slider_dots')) {
        dots=true;
      } 
      if($(this).is('.blog-slider')) {
        slideCount = 3;
        slideCountLg = 3;
        slideCountMd = 2;
        slideCountSm = 2;
        slideCountXs = 1;
        initSlider($(this));
      } else if($(this).is('.new-promo__slider')) {
        slideCount = 1;
        slideCountLg = 1;
        slideCountMd = 3;
        slideCountSm = 2;
        slideCountXs = 1;
        autoplay = true;
        initSlider($(this));
      } else if($(this).is('.new-recent-slider__content')) {
        slideCount = 1;
        slideCountLg = 1;
        slideCountMd = 3;
        slideCountSm = 2;
        slideCountXs = 1;
        autoplay = true;
        arrows = true;
        initSlider($(this));
      }

      function initSlider($target) {
        $target.slick({
          rows: 0,
          infinite: true,
          dots: dots,
          arrows: arrows,
          speed: 500,
          centerMode: centerMode,
          slidesToShow: slideCount,
          slidesToScroll: slideCount,
          autoplay: autoplay,
          autoplaySpeed: 3000,
          responsive: [{
              breakpoint: breakpoints.lg,
              settings: {
                slidesToShow: slideCountLg,
                slidesToScroll: slideCountLg
              }
            },
            {
              breakpoint: breakpoints.md,
              settings: {
                slidesToShow: slideCountMd,
                slidesToScroll: slideCountMd
              }
            },
            {
              breakpoint: breakpoints.sm,
              settings: {
                slidesToShow: slideCountSm,
                slidesToScroll: slideCountSm
              }
            },
            {
              breakpoint: breakpoints.xs,
              settings: {
                slidesToShow: slideCountXs,
                slidesToScroll: slideCountXs
              }
            }
          ]
        });
      }

      //product-slider

      if($(this).is('.product-slider')) {
        $(this).slick({
          slidesToShow: 1,
          lazyLoad: 'ondemand',
          slidesToScroll: 1,
          arrows: false,
          dots: false,
          rows: 0,
          asNavFor: '.product-nav-slider'
        });
      }
      if($(this).is('.product-nav-slider')) {
        if($(this).find('.product-nav-slider__slide').length<=3) {
          $(this).addClass('disabled');
        }
        $(this).slick({
          slidesToShow: 3,
          slidesToScroll: 1,
          lazyLoad: 'ondemand',
          asNavFor: '.product-slider',
          dots: false,
          rows: 0,
          centerMode: true,
          centerPadding: 0,
          focusOnSelect: true,
          prevArrow: `<button type="button" class="product-nav-slider__arrow product-nav-slider__arrow-prev">${slider.arrowPrev}</button>`,
          nextArrow: `<button type="button" class="product-nav-slider__arrow product-nav-slider__arrow-next">${slider.arrowNext}</button>`
        });
      }
    
    });
  }
}

const CityConfirmationModal = {
  init() {
    const elements = {};
    elements.parent = document.querySelector('.city-confirmation-modal');
    elements.close = document.querySelectorAll('[data-action="close"], [data-action="Modal:open"]');
    elements.successButton = document.querySelector('.city-confirmation-modal__success-button');

    this.checkPosition = () => {
      if (window.innerWidth >= 1024) {
        elements.target = document.querySelector('.new-button-icon-city');
      } else if (window.innerWidth >= 768) {
        elements.target = document.querySelector('.new-button-icon-city-type-table');
      } else {
        elements.target = false;
      }

      if (elements.target) {
        const targetTop = elements.target.getBoundingClientRect().top;
        const targetLeft = elements.target.getBoundingClientRect().left;
        const targetHeight = elements.target.getBoundingClientRect().height;

        elements.parent.style.cssText = `
          top: ${targetTop + targetHeight + 15}px;
          left: ${targetLeft}px;
        `;
      } else {
        elements.parent.removeAttribute('style');
      }
    }

    setTimeout(() => {
      elements.parent.classList.add('active');
    }, 500);

    elements.close.forEach(element => {
      element.addEventListener('click', () => {
        elements.parent.classList.remove('active');
      })
    })

    this.checkPosition();
    window.addEventListener('resize', this.checkPosition);
  }
}

const Modal = {
  init: function () {
    document.addEventListener('click', (event) => {
      const _modalContent_ = '[data-modal-block]';
      const _openButton_ = '[data-action="Modal:open"]';
      const _closeButton_ = '[data-action="Modal:close"]';

      const $trigger = event.target.closest(_openButton_);
      const $target = $trigger ? document.querySelector(`${$trigger.getAttribute('href')}`) : undefined;

      const $close = event.target.closest(_closeButton_);
      const clickOutside = !event.target.closest(_modalContent_) && this.$active;

      if ($trigger && $target) {
        event.preventDefault();
        this.open($target, $trigger);
      } else if ($close || clickOutside) {
        this.close();
      }
    })
  },

  open($target, $trigger) {
    if ($target === this.$active) return;

    const open = () => {
      const $block = $target.querySelector('[data-modal-block]');

      $target.dispatchEvent(new CustomEvent("Modal:opened", {
        detail: { $trigger: $trigger }
      }), true);

      this.animation = gsap.timeline()
        .fadeIn($target, { duration: duration[2] })
        .eventCallback('onStart', () => {
          disablePageScroll();
          gsap.fromTo($block, { y: 20 }, { y: 0, duration: duration[2], ease: 'power2.out' });
        });

      this.$active = $target;
    }
    
    if(this.$active) this.close( open );
    else open();
  },

  close(callback) {
    if (!this.$active) return;

    if (this.timeout) {
      clearTimeout(this.timeout);
      delete this.timeout;
    }

    this.animation.reverse().eventCallback('onReverseComplete', () => {
      enablePageScroll();
      this.$active.dispatchEvent(new CustomEvent("Modal:closed"), true);
      delete this.$active;
      if (callback) callback();
    })
  }
}