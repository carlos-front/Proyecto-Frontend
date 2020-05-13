$(document).ready(function(){

  $('.lang span').on('click', function() {
      $('.lang ul').slideToggle();
  });

  $('.owl-carousel').owlCarousel({
    loop:true,
    nav:true,
    navText:['<img class="prev" src="img/logos_iconos/left-arrow.png"/>','<img class="next" src="img/logos_iconos/right-arrow.png"/>'],
    responsive:{
        0:{
            items:2
        },
        600:{
            items:3
        },
        1000:{
            items:5
        }
    }
  })

});
