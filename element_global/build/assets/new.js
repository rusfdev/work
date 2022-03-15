const ScrollToAnchor = {
  init() {
    const triggerSelector = '[data-action="ScrollToAnchor"]';

    const clickEvent = (event) => {
      console.log('click')
      const triggerElement = event.target.closest(`${triggerSelector}`);
      if (!triggerElement) return;

      event.preventDefault();

      const arr = triggerElement.getAttribute('href').split('#'),
            attr = '#' + arr[arr.length - 1],
            targetElement = document.querySelector(`${attr}`);

      if (!targetElement) return;

      scrollEvent(targetElement);
    }

    const scrollEvent = (targetElement) => {
      const scrollY = targetElement.getBoundingClientRect().top + window.pageYOffset,
            hh = document.querySelector('header').getBoundingClientRect().height,
            y = scrollY - hh - 30;

      $('html, body').animate({
        scrollTop: y
      }, 500);
    }

    document.addEventListener('click', clickEvent);
  }
}



ScrollToAnchor.init();