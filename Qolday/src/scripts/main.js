const breakpoints = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1600
}

const msDuration = {
  1: +getComputedStyle(document.documentElement).getPropertyValue('--animation-duration-1').replace(/[^\d.-]/g, ''),
  2: +getComputedStyle(document.documentElement).getPropertyValue('--animation-duration-2').replace(/[^\d.-]/g, ''),
  3: +getComputedStyle(document.documentElement).getPropertyValue('--animation-duration-3').replace(/[^\d.-]/g, '')
}

gsap.defaults({
  ease: "power2.inOut",
  duration: msDuration[1] / 1000
});
gsap.registerEffect({
  name: "fadeIn",
  effect: ($element, config) => {
    return gsap.fromTo($element, {autoAlpha: 0}, {immediateRender: false, autoAlpha: 1, duration: config.duration || msDuration[1] / 1000,
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

document.addEventListener("DOMContentLoaded", function() {
  Modals.init();
});

const Modals = {
  init: function () {

    this.open = ($modal) => {
      if($modal == this.$active || (this.animation && this.animation.isActive())) return;

      let event = ()=> {
        this.animation = gsap.timeline({paused: true}).fadeIn($modal);
        
        //mobile nav
        if ($modal.classList.contains('mobile-nav')) {
          const $inner = $modal.querySelector('.mobile-nav__container');
          this.animation.add(
            gsap.fromTo($inner, {x: -50}, {x: 0, ease:'power2.out'}), '<'
          )
        }

        this.animation.play().eventCallback('onStart', () => {
          scrollLock.disablePageScroll();
        });

        this.$active = $modal;
      }
      
      if(this.$active) this.close(event);
      else event();
    }

    this.close = (callback) => {
      if(!this.$active || (this.animation && this.animation.isActive())) return;

      this.animation.reverse().eventCallback('onReverseComplete', () => {
        scrollLock.enablePageScroll();
        delete this.$active;
        if(callback) callback();
      })
    }

    document.addEventListener('click', (event) => {
      let $open = event.target.closest('[data-action="Modal:open"]'),
          $close = event.target.closest('[data-action="Modal:close"]');

      if ($open) {
        event.preventDefault();
        let $target = document.querySelector(`${$open.getAttribute('href')}`);
        if ($target) this.open($target);
      } else if ($close) {
        this.close();
      }
    })
  }
}