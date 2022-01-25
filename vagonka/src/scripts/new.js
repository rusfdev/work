$(document).ready(function(){
  homeBanner();
  header();
  gallery();
  landing_sliders();
  up();
  chatBlock();
  toggle();

  //interaction
  new СustomInteraction({
    targets: 'a, button, [data-custom-interaction]'
  });
})


function homeBanner() {
  let $slider = $('.home-banner .owl-carousel'),
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
      navText: [
        arrowPrev,
        arrowNext
      ]
    });
  }
  
}

function header() {
  let $header = $('header'), 
      height,
      scroll;

  check();

  $(window).scroll(function() {
    check();
  });

  function check() {
    if(!$header.hasClass('header_landing')) {
      scroll = $(window).scrollTop();
      height = $header.height();
      if(scroll>height){
        $header.addClass('fixed');
      } else {
        $header.removeClass('fixed');
      }
    }
  }
  
}

//gallery
function gallery() {
  if($.fancybox) {

    $('.owl-item [data-fancybox]').on('click', function() {
      let $selector = $(this).parents('.owl-carousel').find('.owl-item:not(.cloned) [data-fancybox]');
      $.fancybox.open( $selector, {
          selector : $selector,
          backFocus : false
      }, $selector.index( this ) );

      return false;
    });
    
  }
}

function landing_sliders() {
  let $sliders = $('.landing-slider .owl-carousel');
  if($sliders.length) {
    $sliders.each(function() {
      let $this = $(this);
      let count1, count2, count3, count4;

      if($this.is('.landing-slider_1 .owl-carousel')) {
        count1 = 2;
        count2 = 2; 
        count3 = 3; 
        count4 = 4;
      } else if($this.is('.landing-slider_2 .owl-carousel')) {
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
    })
  }
}

function toggle() {
  let $section = $('.toggle-section'),
      speed = 250;

  $section.each(function() {
    let $this = $(this),
        $toggle = $this.children('.toggle-section__trigger'),
        $content = $this.children('.toggle-section__content'),
        $close = $content.find('.toggle-section__close'),
        state = $this.hasClass('active') ? true : false,
        initialized;

    $toggle.on('click', function() {
      state = !state ? true : false;
      check();
    })

    $close.on('click', function() {
      state = false;
      check();
    })
    
    if($this.is('[data-hover]')) {
      let timeout;
      
      $toggle.add($content).on('mouseenter', function(event){
        if(!isTouch) {
          if(timeout) clearTimeout(timeout);
          state=true;
          check();
        }
      })

      $toggle.add($content).on('mouseleave', function(event){
        if(!isTouch) {
          let delay;
          if($(this).is($toggle)) {
            delay=500;
          } else {
            delay=100;
          }
          timeout = setTimeout(()=>{
            state=false;
            check();
          }, delay)
        }
      })

    }

    if($this.is('[data-out-hide]') || $this.is('[data-hover]')) {
      $(document).on('click touchstart', function(event) {
        let $target = $(event.target);
        if(!$target.closest($content).length && !$target.closest($toggle).length && state) {
          state=false;
          check();
        }
      })
    } 

    function check() {
      if(state) {
        $this.add($content).add($toggle).addClass('active');
        if($this.is('[data-slide]')) {
          $content.slideDown(speed);
        }
      } 
      else {
        $this.add($toggle).add($content).removeClass('active');
        if($this.is('[data-slide]')) {
          if(initialized) {
            $content.stop().slideUp(speed);
          } else {
            $content.hide(0);
          }
        }
      }
    }

    check();

    initialized=true;
  })
}

function up() {
  let $btn = $('.js-up');

  function check() {
    let scroll = $(window).scrollTop();
    if(scroll>50) {
      $btn.addClass('visible');
    } else {
      $btn.removeClass('visible');
    }
  }

  $(window).on('scroll', function() {
    check();
  })

  check();

  $btn.on('click', function(event) {
    event.preventDefault();
    $("html, body").animate({scrollTop:0}, 500);
  })
}

function chatBlock() {
  let $block = $('.chat-block'),
      $open = $('[data-chat-open]'),
      $close = $('[data-chat-close]');

  $open.on('click', function() {
    $block.addClass('active');
  })
  $close.on('click', function() {
    $block.removeClass('active');
  })
}

class СustomInteraction {
  constructor(options = {}) {
    this.targets = options.targets;
    this.touchendDelay = options.touchendDelay || 100; //ms

    const events = (event) => {
      const $targets = [];

      $targets[0] = event.target !== document ? event.target.closest(this.targets) : null;
      
      let $element = $targets[0], i = 0;
  
      while($targets[0]) {
        $element = $element.parentNode;
        if($element!==document) {
          if($element.matches($targets.value)) {
            i++;
            $targets[i] = $element;
          }
        } 
        else {
          break;
        }
      }
  
      //touchstart
      if(event.type=='touchstart') {
        this.touched = true;
        if(this.timeout) clearTimeout(this.timeout);
        if($targets[0]) {
          for(let $target of $targets) $target.setAttribute('data-touch', '');
        }
      } 
      //touchend
      else if(event.type=='touchend' || (event.type=='contextmenu' && this.touched)) {
        this.timeout = setTimeout(() => {this.touched = false}, this.touchendDelay);
        if($targets[0]) {
          setTimeout(()=>{
            for(let $target of $targets) {
              $target.removeAttribute('data-touch');
            }
          }, this.touchendDelay)
        }
      } 
      //mouseenter
      if(event.type=='mouseenter' && !this.touched && $targets[0] && $targets[0]==event.target) {
        $targets[0].setAttribute('data-hover', '');
      }
      //mouseleave
      else if(event.type=='mouseleave' && !this.touched && $targets[0] && $targets[0]==event.target) {
        $targets[0].removeAttribute('data-click');
        $targets[0].removeAttribute('data-hover');
      }
      //mousedown
      if(event.type=='mousedown' && !this.touched && $targets[0]) {
        $targets[0].setAttribute('data-click', '');
      } 
      //mouseup
      else if(event.type=='mouseup' && !this.touched  && $targets[0]) {
        $targets[0].removeAttribute('data-click');
      }
    }

    document.addEventListener('touchstart',  events);
    document.addEventListener('touchend',    events);
    document.addEventListener('mouseenter',  events, true);
    document.addEventListener('mouseleave',  events, true);
    document.addEventListener('mousedown',   events);
    document.addEventListener('mouseup',     events);
    document.addEventListener('contextmenu', events);
  }
}