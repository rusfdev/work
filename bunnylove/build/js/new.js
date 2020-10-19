"use strict";

$(document).ready(function () {
  mobileSearch();
  header();
  slider.init();
  console.log('ddd');
});
var brakepoints = {
  xs: 576,
  sm: 768,
  md: 1024,
  lg: 1200
};

function mobileSearch() {
  var $open = $('.mobile-search-open'),
      $close = $('.mobile-search__close'),
      $block = $('.mobile-search');
  $open.add($close).on('click', function (event) {
    event.preventDefault();
    if ($(this).is($open)) $block.addClass('active');else $block.removeClass('active');
  });
}

function header() {
  var $header = $('.new-header__center'),
      scroll;
  check();
  $(window).scroll(function () {
    check();
  });

  function check() {
    scroll = $(window).scrollTop();

    if (scroll > 0) {
      $header.addClass('active');
    } else {
      $header.removeClass('active');
    }
  }
}

window.slider = {
  arrowPrev: '<svg class="icon" stroke="none" fill="currentColor" viewBox="0 0 10.5 18.1"><path d="M9,0l1.4,1.4L2.8,9l7.6,7.6L9,18.1L0,9C0,9,9.1,0,9,0z"></path></svg>',
  arrowNext: '<svg class="icon" stroke="none" fill="currentColor" viewBox="0 0 10.5 18.1"><path d="M1.4,18.1L0,16.7l7.6-7.6L0,1.5L1.4,0l9,9.1C10.4,9.1,1.3,18.1,1.4,18.1z"></path></svg>',
  init: function init() {
    console.log('ddd');
    this.el = $('.slider').not('.slick-initialized');
    slider.el.each(function () {
      var slideCount = 1,
          slideCountLg = 1,
          slideCountMd = 1,
          slideCountSm = 1,
          slideCountXs = 1,
          arrows = false,
          dots = false,
          centerMode = false,
          autoplay = false;

      if ($(this).is('.slider_dots')) {
        dots = true;
      }

      if ($(this).is('.blog-slider')) {
        slideCount = 3;
        slideCountLg = 3;
        slideCountMd = 2;
        slideCountSm = 2;
        slideCountXs = 1;
        initSlider($(this));
      } else if ($(this).is('.new-promo__slider')) {
        slideCount = 1;
        slideCountLg = 1;
        slideCountMd = 3;
        slideCountSm = 2;
        slideCountXs = 1;
        autoplay = true;
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
            breakpoint: brakepoints.lg,
            settings: {
              slidesToShow: slideCountLg,
              slidesToScroll: slideCountLg
            }
          }, {
            breakpoint: brakepoints.md,
            settings: {
              slidesToShow: slideCountMd,
              slidesToScroll: slideCountMd
            }
          }, {
            breakpoint: brakepoints.sm,
            settings: {
              slidesToShow: slideCountSm,
              slidesToScroll: slideCountSm
            }
          }, {
            breakpoint: brakepoints.xs,
            settings: {
              slidesToShow: slideCountXs,
              slidesToScroll: slideCountXs
            }
          }]
        });
      } //product-slider


      if ($(this).is('.product-slider')) {
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

      if ($(this).is('.product-nav-slider')) {
        if ($(this).find('.product-nav-slider__slide').length <= 3) {
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
          prevArrow: "<button type=\"button\" class=\"product-nav-slider__arrow product-nav-slider__arrow-prev\">".concat(slider.arrowPrev, "</button>"),
          nextArrow: "<button type=\"button\" class=\"product-nav-slider__arrow product-nav-slider__arrow-next\">".concat(slider.arrowNext, "</button>")
        });
      }
    });
  }
};