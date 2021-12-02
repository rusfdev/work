const breakpoints = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1600
}

document.addEventListener("DOMContentLoaded", function() {
  CustomInteractionEvents.init();
  autoRenewalCheck();
  //date input
  document.querySelectorAll('.input-date').forEach($this => {
    new DateInput($this).init();
  })
  //select
  document.querySelectorAll('.select').forEach($this => {
    new Select($this).init();
  })
  //lang
  document.querySelectorAll('.lang-toggle').forEach($this => {
    new LangToggle($this).init();
  })
});

const CustomInteractionEvents = Object.create({
  targets: {
    value: 'a, button, [data-custom-interaction], .ss-option'
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

function autoRenewalCheck() {
  document.addEventListener('change', (event) => {
    const $target = event.target;
    const $parent = $target.closest('.auto-renewal-element');
    if (!$parent) return;

    const $text = $parent.querySelector('.auto-renewal-element__text strong');

    if ($target.checked) {
      $text.textContent = 'включено';
    } else {
      $text.textContent = 'не включено';
    }
  })
}

class DateInput {
  constructor($parent) {
    this.$parent = $parent;
  }
  init() {
    this.$input = this.$parent.querySelector('input');

    this.instance = flatpickr(this.$input, {
      "locale": "ru",
      dateFormat: "d.m.Y",
      disableMobile: true,
      position: 'auto left',
      nextArrow: '<svg width="10" height="17" viewBox="0 0 10 17" xmlns="http://www.w3.org/2000/svg"><path d="M1.97652 0.325817C1.76125 0.114994 1.48728 0 1.16438 0C0.518591 0 0 0.49831 0 1.13078C0 1.44701 0.136987 1.7345 0.362036 1.9549L7.21135 8.50958L0.362036 15.0451C0.136987 15.2655 0 15.5626 0 15.8692C0 16.5017 0.518591 17 1.16438 17C1.48728 17 1.76125 16.885 1.97652 16.6742L9.58904 9.39121C9.86301 9.14205 9.99022 8.8354 10 8.5C10 8.1646 9.86301 7.87711 9.58904 7.61838L1.97652 0.325817Z" fill="currentColor"/></svg>',
      prevArrow: '<svg width="10" height="17" viewBox="0 0 10 17" xmlns="http://www.w3.org/2000/svg"><path d="M8.02348 16.6742C8.23875 16.885 8.51272 17 8.83562 17C9.48141 17 10 16.5017 10 15.8692C10 15.553 9.86301 15.2655 9.63796 15.0451L2.78865 8.49042L9.63796 1.9549C9.86301 1.7345 10 1.43743 10 1.13078C10 0.498309 9.48141 0 8.83562 0C8.51272 0 8.23875 0.114994 8.02348 0.325817L0.410959 7.60879C0.136986 7.85795 0.00978474 8.1646 0 8.5C0 8.8354 0.136986 9.12289 0.410959 9.38162L8.02348 16.6742Z" fill="currentColor"/></svg>'
    });

  }
}

class Select {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$select = this.$parent.querySelector('select');

    this.select = new SlimSelect({
      select: this.$select,
      showSearch: false
    })

    //add custom arrow
    this.select.slim.container.querySelector('.ss-arrow span').insertAdjacentHTML('afterbegin', `
      <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 6" class="icon">
        <path d="M5.49999 5.33324C5.33449 5.33357 5.1741 5.27593 5.04666 5.17033L0.796659 1.62866C0.652005 1.50843 0.561038 1.33566 0.543769 1.14836C0.5265 0.961054 0.584344 0.774564 0.704575 0.62991C0.824807 0.485257 0.997577 0.39429 1.18488 0.377021C1.37218 0.359752 1.55867 0.417595 1.70333 0.537827L5.49999 3.71116L9.29666 0.651161C9.36911 0.592322 9.45248 0.548383 9.54197 0.521869C9.63146 0.495355 9.72531 0.486788 9.81812 0.496662C9.91093 0.506536 10.0009 0.534654 10.0828 0.579402C10.1647 0.62415 10.237 0.684646 10.2954 0.75741C10.3603 0.830242 10.4094 0.915686 10.4397 1.00839C10.47 1.10109 10.4809 1.19905 10.4716 1.29614C10.4623 1.39323 10.433 1.48734 10.3856 1.5726C10.3382 1.65785 10.2738 1.7324 10.1962 1.79158L5.94624 5.21283C5.81514 5.30173 5.65802 5.34413 5.49999 5.33324Z"></path>
      </svg>
    `);
  }
}

class LangToggle {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    
  }
}