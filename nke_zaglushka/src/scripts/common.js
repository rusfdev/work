import { gsap } from "gsap";

window.onload = function(){
  TouchHoverEvents.init();
  Counter.init();
  Animation.start();
}

const speed = 1;

//hover/touch custom events
const TouchHoverEvents = {
  targets: 'a[class], button, label, tr, .jsTouchHover, .js-3d-object',
  touched: false,
  touchEndDelay: 100, //ms
  init: function() {
    document.addEventListener('touchstart',  (event)=>{this.events(event)});
    document.addEventListener('touchend',    (event)=>{this.events(event)});
    document.addEventListener('mouseenter',  (event)=>{this.events(event)},true);
    document.addEventListener('mouseleave',  (event)=>{this.events(event)},true);
    document.addEventListener('mousedown',   (event)=>{this.events(event)});
    document.addEventListener('mouseup',     (event)=>{this.events(event)});
    document.addEventListener('contextmenu', (event)=>{this.events(event)});
  },
  events: function(event) {
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
        for(let $target of $targets) $target.classList.add('touch');
      }
    } 
    //touchend
    else if(event.type=='touchend' || (event.type=='contextmenu' && this.touched)) {
      this.timeout = setTimeout(() => {this.touched = false}, 500);
      if($targets[0]) {
        setTimeout(()=>{
          for(let $target of $targets) {
            $target.dispatchEvent(new CustomEvent("customTouchend"));
            $target.classList.remove('touch');
          }
        }, this.touchEndDelay)
      }
    } 
    
    //mouseenter
    if(event.type=='mouseenter' && !this.touched && $targets[0] && $targets[0]==event.target) {
      $targets[0].classList.add('hover');
    }
    //mouseleave
    else if(event.type=='mouseleave' && !this.touched && $targets[0] && $targets[0]==event.target) {
      $targets[0].classList.remove('hover', 'focus');
    }
    //mousedown
    if(event.type=='mousedown' && !this.touched && $targets[0]) {
      $targets[0].classList.add('focus');
    } 
    //mouseup
    else if(event.type=='mouseup' && !this.touched  && $targets[0]) {
      $targets[0].classList.remove('focus');
    }
  }
}

//timer
const Counter = {
  init: function() {
    this.$timer = document.querySelector(".timer");
    this.$items = document.querySelectorAll(".timer__item-value");
    this.$labels = document.querySelectorAll(".timer__item-text");
    this.now_date = +new Date();
    this.end_date = +new Date(2021, 11, 31, 23, 59, 59);
    this.timer();
    this.interval = setInterval(()=>{
      this.timer();
    }, 1000)
  },
  timer: function() {
    this.now_date = +new Date();
    let timeleft = Math.max(0, (this.end_date - this.now_date));

    if (timeleft == 0) {
      clearInterval(this.interval);
    } else { 
      this.values = [ 
        Math.floor(timeleft/(1000 * 60 * 60 * 24)),
        Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60)),
        Math.floor((timeleft % (1000 * 60)) / 1000) ];

      this.$items.forEach(($item, index)=>{
        $item.textContent = this.values[index];
      })
      
      //коррекция слов
      function returnLastItem(arr) {
        return arr[arr.length - 1];
      }

      this.$labels.forEach(($label, index)=>{
        let variant1 = ['день', 'час', 'минута', 'секунда'],
            variant2 = ['дня', 'часа', 'минуты', 'секунды'],
            variant3 = ['дней', 'часов', 'минут', 'секунд'];
        
        let last = +returnLastItem(this.values[index].toString().split(''));

        if(this.values[index]==1 || (last==1 && this.values[index]!==11)) {
          $label.textContent = variant1[index];
        } else if((this.values[index]<5 || (last<5 && this.values[index]>20)) && last!==0 && this.values[index]!==0) {
          $label.textContent = variant2[index];
        } else {
          $label.textContent = variant3[index];
        }
      })

    }

    //dots animation
    let $dots = document.querySelectorAll('.timer__item-dots');
    gsap.timeline()
      .to($dots, {autoAlpha:1, duration:0.2, ease:'power2.out'})
      .to($dots, {autoAlpha:0, duration:0.7, ease:'power2.in'})
  }
}

const Animation = {
  start: function() {
    let $main = document.querySelector('.main'),  
        $blocks = document.querySelectorAll('.item'),
        $bg = document.querySelectorAll('.bg__container'),
        $center = document.querySelectorAll('.center'),
        $waves = document.querySelector('.center__waves-items');
    //progress
    let alldays = 120,
        leftdays = Counter.values[0],
        percent_progress = 100 - Math.max(0, leftdays/alldays*100);
    
    gsap.timeline() 
      .fromTo($main, {autoAlpha:0}, {autoAlpha:1, duration:speed, ease:'power2.inOut'}) //1
      .fromTo($blocks, {autoAlpha:0}, {autoAlpha:1, duration:speed, ease:'power2.inOut', stagger:{amount:speed/2, from:'random'}},`-=${speed/2}`) //2
      .fromTo($center, {autoAlpha:0}, {autoAlpha:1, duration:speed*1.5, ease:'power2.inOut'},`-=${speed}`) //2.5
      .fromTo($center, {scale:1.2}, {scale:1, duration:speed*1.5, ease:'power2.out'},`-=${speed*1.5}`) //2.5
      .fromTo($waves, {y:12}, {yPercent:-percent_progress, duration:speed*4, ease:'power2.inOut'},`-=${speed*2.5}`) //4
      .fromTo($bg, {autoAlpha:0}, {autoAlpha:1, duration:speed*3, ease:'power2.inOut'}, `-=${speed*4}`) //2
      .fromTo($bg, {xPercent:10}, {xPercent:0, duration:speed*4, ease:'power2.out'}, `-=${speed*4}`) //2

  }
}
