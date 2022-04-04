import throttle from './throttle';

export default class СustomInteraction {
  constructor(options) {
    const _this = this;

    this._maxTargetsLength = 10;
    this._mainSelector = '[data-custom-interaction]';
    
    this._selectors = options?.targets || [];
    this._selectors.push(this._mainSelector);
    this._selector = this._selectors.join(', ');

    this._events = {
      'hover': ['mouseenter', 'mouseleave'],
      'touch': ['touchstart', 'touchend']
    }

    this._targets = new Proxy({}, {
      defineProperty(targets, key, property) {
        const target = property.value.target;
        const event = property.value.event;
        target.setAttribute(`data-${event}`, '');
        //create event
        target.dispatchEvent(new CustomEvent(`custom:${_this._events[event][0]}`, 
          { bubbles: true }
        ));
        targets[key] = property.value;
        return true;
      },
      deleteProperty(targets, key) {
        const target = targets[key].target;
        const event = targets[key].event;
        target.removeAttribute(`data-${event}`);
        //create event
        target.dispatchEvent(new CustomEvent(`custom:${_this._events[event][1]}`, 
          { bubbles: true }
        ));
        delete targets[key];
        return true;
      }
    })

    this._createMutationObserver();

    document.addEventListener('mouseenter', (event) => {
      this._mouseEnterEvent(event);
    }, true);

    document.addEventListener('mouseleave', (event) => {
      this._mouseLeaveEvent(event);
    }, true);

    document.addEventListener('touchstart', (event) => {
      this._touchStartEvent(event);
    });

    document.addEventListener('touchend', () => {
      this._touchEndTimeout = setTimeout(() => {
        this._clearTouchedElements();
        delete this._touchEndTimeout;
      }, 250);
    });

    document.addEventListener('contextmenu', () => {
      this._clearTouchedElements();
    });

    this._checkOnMouseMoveThrottle = throttle(this._checkOnMouseMove, 500, this);
    document.addEventListener('mousemove', (event) => {
      this._checkOnMouseMoveThrottle(event);
    })
  }
  
  _generateUniqueKey() {
    const availableKeys = [];
    for (let index = 1; index <= this._maxTargetsLength; index++) {
      if (!this._targets[index]) {
        availableKeys.push(index);
      }
    }
    if (!availableKeys.length) {
      return false;
    } else {
      const randomIndex = Math.round(Math.random() * (availableKeys.length - 1));
      return availableKeys[randomIndex];
    }
  }

  _createMutationObserver() {
    const config = {
      attributes: true,
      childList: true,
      subtree: true
    };

    const callback = (mutationsList, observer) => {
      for (let mutation of mutationsList) {
        //if disabled 
        if (mutation.type === 'attributes' && mutation.attributeName === 'disabled' && mutation.target.getAttribute('disabled') !== null) {
          for (const key in this._targets) {
            if (this._targets[key].target == mutation.target) {
              delete this._targets[key];
            }
          }
        }
      }
    };

    this._observer = new MutationObserver(callback);
    this._observer.observe(document.body, config);
  }

  _checkOnMouseMove(event) {
    for (const key in this._targets) {
      const target = this._targets[key].target;
      const x1 = target.getBoundingClientRect().left;
      const x2 = x1 + target.getBoundingClientRect().width;
      const y1 = target.getBoundingClientRect().top;
      const y2 = y1 + target.getBoundingClientRect().height;

      if (event.clientX < x1 || event.clientX > x2 || event.clientY < y1 || event.clientY > y2) {
        delete this._targets[key];
      }
    }
  }

  _touchStartEvent(event) {
    this._touched = true;

    if (this._touchEndTimeout) {
      clearTimeout(this._touchEndTimeout);
      this._clearTouchedElements();
      delete this._touchEndTimeout;
    }

    if (this._touchedTimeout) {
      clearTimeout(this._touchedTimeout);
    }
    
    this._touchedTimeout = setTimeout(() => {
      delete this._touched;
      delete this._touchedTimeout;
    }, 1000);

    const targets = [event.target.closest(this._selector)];
    if (!targets[0] || targets[0]?.getAttribute('disabled') !== null) return;
    
    let element = targets[0];
    while (element !== document.body) {
      element = element.parentNode;
      if (element.matches(this._selector)) {
        targets.push(element);
      }
    }

    for (let target of targets) {
      const key = this._generateUniqueKey();
      if (!key) return;

      this._targets[key] = {
        target: target,
        event: Object.keys(this._events)[1]
      }
    }
  }

  _clearTouchedElements() {
    for (const key in this._targets) {
      if (this._targets[key].event == Object.keys(this._events)[1]) {
        delete this._targets[key];
      }
    }
  }

  _mouseEnterEvent(event) {
    const target = event.target !== document && event.target.closest(this._selector) == event.target 
      ? event.target
      : false;

    if (this._touched || !target) return;

    const key = this._generateUniqueKey();

    if (!key) return;

    this._targets[key] = {
      target: target,
      event: Object.keys(this._events)[0]
    }
  }

  _mouseLeaveEvent(event) {
    const target = event.target !== document && event.target.closest(this._selector) == event.target 
      ? event.target
      : false;

    if (this._touched || !target) return;

    for (const key in this._targets) {
      if (this._targets[key].target == target) {
        delete this._targets[key];
      }
    }
  }
}