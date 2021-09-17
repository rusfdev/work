document.addEventListener("DOMContentLoaded", function(event) {
  CustomInteractionEvents.init();
  Map.init();
});

const CustomInteractionEvents = Object.create({
  targets: {
    value: 'a, button, .region'
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

function goToPage(href) {
  document.location.href = href;
}

const Map = {
  init: function() {
    this.$map = document.querySelector('.map');
    this.$element = this.$map.querySelector('.map__inner');
    this.$zoom_in = this.$map.querySelector('.map__control_zoom-in');
    this.$zoom_out = this.$map.querySelector('.map__control_zoom-out');
    this.zoom = 1;
    this.zoom_max = 2.5;

    this.zoom_in = () => {
      this.zoom = Math.min(this.zoom_max, this.zoom + 0.5);
      this.check_state();
    }

    this.zoom_out = () => {
      this.zoom = Math.max(1, this.zoom - 0.5);
      this.check_state();
    }

    this.check_state = () => {
      this.$element.style.width = `${this.zoom * 100}%`;

      if(this.zoom == 1) this.$zoom_out.classList.add('disabled');
      else this.$zoom_out.classList.remove('disabled');

      if(this.zoom == this.zoom_max) this.$zoom_in.classList.add('disabled');
      else this.$zoom_in.classList.remove('disabled');
    }

    this.$zoom_in.addEventListener('click', this.zoom_in);
    this.$zoom_out.addEventListener('click', this.zoom_out);
    
    this.check_state();
  }
}