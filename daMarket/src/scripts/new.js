import {gsap} from "gsap";
gsap.defaults({
  ease: "power2.inOut"
});

gsap.registerEffect({
  name: "fadeIn",
  effect: ($element, config) => {
    return gsap.fromTo($element, {autoAlpha: 0}, {immediateRender: false, autoAlpha: 1, duration: config.duration || 0.15,
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
  
  //banner
  document.querySelectorAll('.cards-banner').forEach(($banner) => {
    new Banner($banner).init();
  })
  //flip cards
  document.querySelectorAll('.cards-banner__card').forEach(($card) => {
    new FlipCard($card).init();
  })
  //tabs
  document.querySelectorAll('[data-tabs="parent"]').forEach($this => {
    new TabsElement($this).init();
  })
})

function mobile() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
}

class Banner {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$cards = this.$parent.querySelectorAll('.cards-banner__card');
    this.$backgrounds = this.$parent.querySelectorAll('.cards-banner__background');
    this.$triggers = this.$parent.querySelectorAll('.cards-banner__tabs-element');
    this.$slider = this.$parent.querySelector('.cards-banner__tabs-slider');

    this.active = 1;

    this.change = (index) => {
      const $cardNew = this.$cards[index];
      const $cardOld = this.$cards[this.active];
      const $bgNew = this.$backgrounds[index];
      const $bgOld = this.$backgrounds[this.active];

      let startEase;
      if (this.animation && this.animation.isActive()) {
        this.animation.pause();
        if (this.animation.progress() < 0.7) {
          startEase = 'power2.out';
        } else {
          startEase = 'power2.in';
        }
        
      } else {
        startEase = 'power2.in';
      }

      this.animation = gsap.timeline({paused:true})
        .addLabel('start')

        .to($bgNew, {autoAlpha: 1, duration: 1}, 'start')
        .to($bgOld, {autoAlpha: 0, duration: 0.5}, 'start')

        .to($cardNew, {yPercent: 90, x: 10, duration: 0.25, ease: startEase,
          onComplete: () => {
            $cardNew.style.zIndex = '2';
            $cardNew.classList.add('active');
            $cardNew.classList.add('scaled');
          }
        }, 'start')
        .to($cardNew, {yPercent: 0, xPercent: 0, x: 0, scale: 1, duration: 0.35, ease: 'power2.inOut'}, '>')

        .to($cardOld, {yPercent: -10, x: -10, duration: 0.25, ease: startEase, 
          onStart: () => {
            $cardOld.classList.remove('active');
          },
          onComplete: () => {
            $cardOld.style.zIndex = '1';
            $cardOld.classList.remove('scaled');
          }
        }, 'start')
        .to($cardOld, {yPercent: 80, xPercent: 10, x: 0, scale: 0.8, duration: 0.35, ease: 'power2.inOut'}, '>')
      
      if (!this.initialized) {
        this.animation.progress(1);
      } else {
        this.animation.play();
      }
      

      window.dispatchEvent(new Event("Banner:change"));
      
      this.$triggers[this.active].classList.remove('active');
      this.$triggers[index].classList.add('active');

      if (index == 1) {
        this.$slider.classList.add('active');
      } else {
        this.$slider.classList.remove('active');
      }

      this.active = index;
    }

    this.change(0);

    this.$cards.forEach(($card, index) => {
      $card.addEventListener('click', () => {
        if (index == this.active) return;
        this.change(index);
      })
    })

    this.$triggers.forEach(($trigger, index) => {
      $trigger.addEventListener('click', () => {
        if (index == this.active) return;
        this.change(index);
      })
    })

    this.initialized = true;
  }
}

class FlipCard {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$images = this.$parent.querySelectorAll('.cards-banner__card-inner');

    this.$parent.style.perspective = '1000px';

    this.flip = () => {
      this.flipped = !this.flipped;

      if (this.animation && this.animation.isActive()) {
        this.animation.pause();
      }

      let rotation = this.flipped ? 180 : 0;
      this.animation = gsap.timeline()
        .to(this.$images[0], {rotateY: rotation, duration: 0.5, ease: 'power2.out'})
        .to(this.$images[1], {rotateY: rotation + 180, duration: 0.5, ease: 'power2.out'}, '<')
    }

    window.addEventListener('Banner:change', () => {
      if (this.flipped) this.flip();
    });

    this.$parent.addEventListener('click', () => {
      if (this.$parent.classList.contains('active')) this.flip();
    })

    if (mobile()) return;

    this.$parent.addEventListener('mouseenter', () => {
      if (this.$parent.classList.contains('active') && !this.flipped) this.flip();
    })
    this.$parent.addEventListener('mouseleave', () => {
      if (this.$parent.classList.contains('active') && this.flipped) this.flip();
    })
  }
}

class TabsElement {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$links = this.$parent.querySelectorAll('[data-tabs="link"]');
    this.$blocks = this.$parent.querySelectorAll('[data-tabs="block"]');

    this.set = (index) => {
     
      gsap.timeline()
        .fadeIn(this.$blocks[index])
        .eventCallback('onStart', () => {
          this.$links[index].classList.add('active');

          if(this.index!==undefined) {
            this.$links[this.index].classList.remove('active');
            this.$blocks[this.index].classList.remove('d-block');
          }

          this.index = index;
        });

    }

    this.$links.forEach(($this, index) => {
      if($this.classList.contains('active')) {
        this.index = index;
      }
      $this.addEventListener('click', () => {
        if(this.index !== index) this.set(index);
      })
    })

  }
}