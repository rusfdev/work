"use strict";

$(document).ready(function () {
  homeBanner();
  header();
  gallery();
  landing_sliders();
  up();
  chatBlock();
  toggle();
});

function homeBanner() {
  var $slider = $('.home-banner .owl-carousel'),
      arrowPrev = '<svg class="icon" viewBox="0 0 10.5 18.1"><path stroke="none" d="M9,0l1.4,1.4L2.8,9l7.6,7.6L9,18.1L0,9C0,9,9.1,0,9,0z"></path></svg>',
      arrowNext = '<svg class="icon" viewBox="0 0 10.5 18.1"><path stroke="none" d="M1.4,18.1L0,16.7l7.6-7.6L0,1.5L1.4,0l9,9.1C10.4,9.1,1.3,18.1,1.4,18.1z"></path></svg>';

  if ($slider.length) {
    $slider.owlCarousel({
      loop: true,
      nav: true,
      smartSpeed: 500,
      dots: true,
      items: 1,
      lazyLoad: true,
      autoplay: true,
      autoplayTimeout: (+$slider.data('autoplay-timeout') || 5) * 1000,
      navText: [arrowPrev, arrowNext]
    });
  }
}

function header() {
  var $header = $('header'),
      height,
      scroll;
  check();
  $(window).scroll(function () {
    check();
  });

  function check() {
    if (!$header.hasClass('header_landing')) {
      scroll = $(window).scrollTop();
      height = $header.height();

      if (scroll > height) {
        $header.addClass('fixed');
      } else {
        $header.removeClass('fixed');
      }
    }
  }
} //gallery


function gallery() {
  if ($.fancybox) {
    $('.owl-item [data-fancybox]').on('click', function () {
      var $selector = $(this).parents('.owl-carousel').find('.owl-item:not(.cloned) [data-fancybox]');
      $.fancybox.open($selector, {
        selector: $selector,
        backFocus: false
      }, $selector.index(this));
      return false;
    });
  }
}

function landing_sliders() {
  var $sliders = $('.landing-slider .owl-carousel');

  if ($sliders.length) {
    $sliders.each(function () {
      var $this = $(this);
      var count1, count2, count3, count4;

      if ($this.is('.landing-slider_1 .owl-carousel')) {
        count1 = 2;
        count2 = 2;
        count3 = 3;
        count4 = 4;
      } else if ($this.is('.landing-slider_2 .owl-carousel')) {
        count1 = 1;
        count2 = 2;
        count3 = 3;
        count4 = 4;
      }

      $this.owlCarousel({
        loop: true,
        margin: 20,
        responsive: {
          0: {
            items: count1,
            margin: 16
          },
          576: {
            items: count2
          },
          768: {
            items: count3
          },
          992: {
            items: count4
          }
        }
      });
    });
  }
}

function toggle() {
  var $section = $('.toggle-section'),
      speed = 250;
  $section.each(function () {
    var $this = $(this),
        $toggle = $this.children('.toggle-section__trigger'),
        $content = $this.children('.toggle-section__content'),
        $close = $content.find('.toggle-section__close'),
        state = $this.hasClass('active') ? true : false,
        initialized;
    $toggle.on('click', function () {
      state = !state ? true : false;
      check();
    });
    $close.on('click', function () {
      state = false;
      check();
    });

    if ($this.is('[data-hover]')) {
      var timeout;
      $toggle.add($content).on('mouseenter', function (event) {
        if (!isTouch) {
          if (timeout) clearTimeout(timeout);
          state = true;
          check();
        }
      });
      $toggle.add($content).on('mouseleave', function (event) {
        if (!isTouch) {
          var delay;

          if ($(this).is($toggle)) {
            delay = 500;
          } else {
            delay = 100;
          }

          timeout = setTimeout(function () {
            state = false;
            check();
          }, delay);
        }
      });
    }

    if ($this.is('[data-out-hide]') || $this.is('[data-hover]')) {
      $(document).on('click touchstart', function (event) {
        var $target = $(event.target);

        if (!$target.closest($content).length && !$target.closest($toggle).length && state) {
          state = false;
          check();
        }
      });
    }

    function check() {
      if (state) {
        $this.add($content).add($toggle).addClass('active');

        if ($this.is('[data-slide]')) {
          $content.slideDown(speed);
        }
      } else {
        $this.add($toggle).add($content).removeClass('active');

        if ($this.is('[data-slide]')) {
          if (initialized) {
            $content.stop().slideUp(speed);
          } else {
            $content.hide(0);
          }
        }
      }
    }

    check();
    initialized = true;
  });
}

function up() {
  var $btn = $('.js-up');

  function check() {
    var scroll = $(window).scrollTop();

    if (scroll > 50) {
      $btn.addClass('visible');
    } else {
      $btn.removeClass('visible');
    }
  }

  $(window).on('scroll', function () {
    check();
  });
  check();
  $btn.on('click', function (event) {
    event.preventDefault();
    $("html, body").animate({
      scrollTop: 0
    }, 500);
  });
}

function chatBlock() {
  var $block = $('.chat-block'),
      $open = $('[data-chat-open]'),
      $close = $('[data-chat-close]');
  $open.on('click', function () {
    $block.addClass('active');
  });
  $close.on('click', function () {
    $block.removeClass('active');
  });
}
//# sourceMappingURL=maps/new.js.map
