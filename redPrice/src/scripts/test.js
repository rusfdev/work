


document.addEventListener('DOMContentLoaded', function() {
  
  function test_number(value) {
    let val = value.replace(/[^\d]/g, '');
    if(val.length > 10) {
      return val.slice(1);
    }
  }
  
  Inputmask({
    mask: "+7 (999) 999-99-99",
    showMaskOnHover: false,
    clearIncomplete: false,
    onBeforeMask: function(value, opts) {
      return test_number(value)
    },
    onBeforePaste: function (value, opts) {
      return test_number(value)
    },
    onKeyDown: function (event, buffer, caretPos, opts) {
      let value = '';
  
      if (caretPos.end == 18 && /^[0-9]$/.test(event.key) && buffer[4] == '8') {
        delete buffer[1];
        delete buffer[4];
  
        for (let val of buffer) {
          if (/^[0-9]$/.test(val)) {
            value += val;
          }
        }
  
        value += event.key;
        event.target.value = value;
      }
    },
  }).mask('[data-mask="phone"]');
  

})
