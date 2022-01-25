"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(document).ready(function () {
  homeBanner();
  header();
  gallery();
  landing_sliders();
  up();
  chatBlock();
  toggle(); //interaction

  new СustomInteraction({
    targets: 'a, button, [data-custom-interaction]'
  });
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

var СustomInteraction = function СustomInteraction() {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, СustomInteraction);

  this.targets = options.targets;
  this.touchendDelay = options.touchendDelay || 100; //ms

  var events = function events(event) {
    var $targets = [];
    $targets[0] = event.target !== document ? event.target.closest(_this.targets) : null;
    var $element = $targets[0],
        i = 0;

    while ($targets[0]) {
      $element = $element.parentNode;

      if ($element !== document) {
        if ($element.matches($targets.value)) {
          i++;
          $targets[i] = $element;
        }
      } else {
        break;
      }
    } //touchstart


    if (event.type == 'touchstart') {
      _this.touched = true;
      if (_this.timeout) clearTimeout(_this.timeout);

      if ($targets[0]) {
        var _iterator = _createForOfIteratorHelper($targets),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var $target = _step.value;
            $target.setAttribute('data-touch', '');
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    } //touchend
    else if (event.type == 'touchend' || event.type == 'contextmenu' && _this.touched) {
        _this.timeout = setTimeout(function () {
          _this.touched = false;
        }, _this.touchendDelay);

        if ($targets[0]) {
          setTimeout(function () {
            var _iterator2 = _createForOfIteratorHelper($targets),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var _$target = _step2.value;

                _$target.removeAttribute('data-touch');
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }, _this.touchendDelay);
        }
      } //mouseenter


    if (event.type == 'mouseenter' && !_this.touched && $targets[0] && $targets[0] == event.target) {
      $targets[0].setAttribute('data-hover', '');
    } //mouseleave
    else if (event.type == 'mouseleave' && !_this.touched && $targets[0] && $targets[0] == event.target) {
        $targets[0].removeAttribute('data-click');
        $targets[0].removeAttribute('data-hover');
      } //mousedown


    if (event.type == 'mousedown' && !_this.touched && $targets[0]) {
      $targets[0].setAttribute('data-click', '');
    } //mouseup
    else if (event.type == 'mouseup' && !_this.touched && $targets[0]) {
        $targets[0].removeAttribute('data-click');
      }
  };

  document.addEventListener('touchstart', events);
  document.addEventListener('touchend', events);
  document.addEventListener('mouseenter', events, true);
  document.addEventListener('mouseleave', events, true);
  document.addEventListener('mousedown', events);
  document.addEventListener('mouseup', events);
  document.addEventListener('contextmenu', events);
};
//# sourceMappingURL=maps/new.js.map
