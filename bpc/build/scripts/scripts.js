const brakepoints = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1600
}

const $wrapper = document.querySelector('.wrapper');
const $header = document.querySelector('.header');

document.addEventListener("DOMContentLoaded", function() {
  new TouchHoverEvents('a, button, [data-touch-hover]').init();
  toggle();
  scrolling();
  Advantages();
});

window.onload = function() {
  //show page
  document.body.classList.add('loaded');
}

class TouchHoverEvents {
  constructor(targets) {
    this.targets = targets;
  }
  init() {
    let touchEndDelay = 100; //ms

    let events = (event) => {
      let $targets = [];
      $targets[0] = event.target!==document?event.target.closest(this.targets):null;
      let $element = $targets[0], i = 0;
  
      while($targets[0]) {
        $element = $element.parentNode;
        if($element!==document) {
          if($element.matches(this.targets)) {
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
          for(let $target of document.querySelectorAll(this.targets)) $target.classList.remove('touch');
          for(let $target of $targets) $target.setAttribute('data-touch', '');
        }
      } 
      //touchend
      else if(event.type=='touchend' || (event.type=='contextmenu' && this.touched)) {
        this.timeout = setTimeout(() => {this.touched = false}, 500);
        if($targets[0]) {
          setTimeout(()=>{
            for(let $target of $targets) {
              $target.removeAttribute('data-touch');
            }
          }, touchEndDelay)
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

function toggle() {
  let $section = $('.toggle-section'),
      speed = 250;

  $section.each(function() {
    let $this = $(this),
        $toggle = $this.find('.toggle-section__trigger'),
        $content = $this.find('.toggle-section__content'),
        state = $this.hasClass('is-active') ? true : false,
        initialized;

    $toggle.on('click', function() {
      state = !state ? true : false;
      check();
    })
    
    if($this.is('[data-hover]')) {
      let timeout;
      
      $toggle.add($content).on('mouseenter', function(event){
        if(!TouchHoverEvents.touched) {
          if(timeout) clearTimeout(timeout);
          state=true;
          check();
        }
      })

      $toggle.add($content).on('mouseleave', function(event){
        if(!TouchHoverEvents.touched) {
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
        $this.add($content).add($toggle).addClass('is-active');
        if($this.is('[data-slide]')) {
          $content.slideDown(speed);
        }
      } 
      else {
        $this.add($toggle).add($content).removeClass('is-active');
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

function scrolling() {
  let $triggers = document.querySelectorAll('[data-scroll]');
  
  $triggers.forEach($this => {
    $this.addEventListener('click', (event)=> {
      event.preventDefault();
      let href = $this.getAttribute('href'),
          $target = document.querySelector(href);
      if($target) gsap.to(window, {duration:1, scrollTo:href, ease:'power2.inOut'});
    })
  }) 
}

function Advantages() {
  let $cards = document.querySelectorAll('.section-advantages__card'),
      $items = document.querySelectorAll('.section-advantages__item'),
      $items_container = document.querySelector('.section-advantages__content'),
      activeIndex,
      animations = [];

  $items.forEach(($this, index) => {
    let $image = $this.querySelector('.section-advantages__item-image');

    animations[index] = gsap.timeline({paused:true})
      .fromTo($this, {autoAlpha:0}, {autoAlpha:1, duration:0.5, ease:'power2.inOut'})
      .fromTo($image, {scale:0.8}, {scale:1, duration:0.5, ease:'power2.out'}, '-=0.5')
  })

  let resizeEvent = () => {
    let h = [];
    $items.forEach($this => {
      h.push($this.getBoundingClientRect().height);
    })
    $items_container.style.height = Math.max(...h)+'px';
  }

  let changeEvent = (index=0) => {
    if(index!==activeIndex) {
      if(activeIndex!==undefined) {
        $cards[activeIndex].classList.remove('is-active');
        $items[activeIndex].classList.remove('is-active');
        animations[activeIndex].timeScale(1.5).reverse();
      }
      $cards[index].classList.add('is-active');
      $items[index].classList.add('is-active');
      animations[index].timeScale(1).play();
      activeIndex = index;
    }
  }

  changeEvent();
  resizeEvent();
  window.addEventListener('resize', resizeEvent);
  $cards.forEach(($this, index) => {
    $this.addEventListener('click',      () => { changeEvent(index) });
    $this.addEventListener('mouseenter', () => { changeEvent(index) });
  })
}