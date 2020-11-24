
$(document).ready(function() {
  gallery();
})

//gallery
function gallery() {
  if($.fancybox) {

    $('.owl-item [data-fancybox]').on('click', function() {
      let $selector = $(this).parents('.owl-carousel').find('.owl-item:not(.cloned) [data-fancybox]');
      console.log('sss')
      $.fancybox.open( $selector, {
          selector : $selector,
          backFocus : false
      }, $selector.index( this ) );

      return false;
    });
    
  }
}