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
  CustomInteractionEvents.init();
  Header.init();
  
  //aos
  AOS.init({
    easing: 'ease-out',
    offset: 0
  });

  //tab
  document.querySelectorAll('[data-tabs="parent"]').forEach($this => {
    new TabsElement($this).init();
  })
  //mobile dropdown
  document.querySelectorAll('.header-mobile-dropdown').forEach($this => {
    new HeaderMobileDropdown($this).init();
  })
});


const CustomInteractionEvents = Object.create({
  targets: {
    value: 'a, button, td, tr, [data-custom-interaction]'
  },
  touchEndDelay: {
    value: 100
  }, 
  init() {
    this.events = (event) => {
      let $targets = [];
      $targets[0] = event.target!==document?event.target.closest(this.targets.value):null;
      let $element = $targets[0], i = 0;
  
      while($targets[0]) {
        $element = $element.parentNode;
        if($element!==document) {
          if($element.matches(this.targets.value)) {
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
        this.timeout = setTimeout(() => {this.touched = false}, 500);
        if($targets[0]) {
          setTimeout(()=>{
            for(let $target of $targets) {
              $target.removeAttribute('data-touch');
            }
          }, this.touchEndDelay.value)
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
    document.addEventListener('touchstart',  this.events);
    document.addEventListener('touchend',    this.events);
    document.addEventListener('mouseenter',  this.events, true);
    document.addEventListener('mouseleave',  this.events, true);
    document.addEventListener('mousedown',   this.events);
    document.addEventListener('mouseup',     this.events);
    document.addEventListener('contextmenu', this.events);
  }
})

const Header = {
  $element: document.querySelector('.header'),

  init: function () {
    window.addEventListener('scroll', () => {
      this.check();
    })
    this.check();
  },

  check: function () {
    let y = window.pageYOffset,
        fixed = this.$element.classList.contains('header_fixed');

    if (y > 0 && !fixed) {
      this.$element.classList.add('header_fixed');
    } else if (y<=0 && fixed) {
      this.$element.classList.remove('header_fixed');
    }
  }
}

class TabsElement {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$links = this.$parent.querySelectorAll('[data-tabs="link"]');
    this.$blocks = this.$parent.querySelectorAll('[data-tabs="block"]');
    this.$wrapper = this.$parent.querySelector('[data-tabs="wrapper"]');

    this.resize = () => {
      let h = this.$blocks[this.index].getBoundingClientRect().height;
      this.$wrapper.style.height = `${h}px`;
    }

    this.set = (index) => {
      if(this.index!==undefined) {
        this.$links[this.index].classList.remove('is-active');
        this.$blocks[this.index].classList.remove('is-active');
      }
  
      this.$links[index].classList.add('is-active');
      this.$blocks[index].classList.add('is-active');
      
      this.index = index;
      this.resize();
    }

    this.$links.forEach(($this, index) => {
      if($this.classList.contains('is-active')) {
        this.set(index);
      }
      $this.addEventListener('click', () => {
        this.set(index);
      })
    })

    this.observer = new MutationObserver(this.resize);
    this.observer.observe(this.$wrapper, {
      childList: true,
      subtree: true
    });
    window.addEventListener('resize', this.resize);
  }
}

class HeaderMobileDropdown {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$toggle = this.$parent.querySelector('.header-mobile-dropdown__button');
    this.$content = this.$parent.querySelector('.header-mobile-dropdown__content');

    this.$toggle.addEventListener('click', () => {
      if(!this.state) this.show();
      else this.hide();
    })


    this.closeEvent = (event) => {
      let target = event.target !== document ? event.target.closest('.header-mobile-dropdown') : null;
      if(!target || target!==this.$parent) this.hide();
    }
    document.addEventListener('click', this.closeEvent)
    document.addEventListener('touchstart', this.closeEvent)
  }

  show() {
    this.state = true;
    this.$content.classList.add('is-active');
    this.$toggle.classList.add('is-active');
  }

  hide() {
    this.state = false;
    this.$content.classList.remove('is-active');
    this.$toggle.classList.remove('is-active');
  }
}