const instance = new TypeIt('#replaceStrings', {
  strings: ['analyst '],
  //-- Other options...
}).go();

new TypeIt('#replaceStrings', {
  strings: ["Analyst ", "Scientist"],
  speed: 50,
  loop: true,
  breakLines: false,
  waitUntilVisible: true
}).go();

$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    items: 1,
    nav: true,

  });
});

$(document).ready(function () {
  $('.counter').each(function () {
    var $this = $(this),
      countTo = $this.attr('data-count');
    $({ countNum: $this.text() }).animate({
      countNum: countTo
    },
      {
        duration: 3000,
        easing: 'linear',
        step: function () {
          $this.text(Math.floor(this.countNum));
        },
        complete: function () {
          $this.text(this.countNum);
        }
      });
  });
});

var swiper = new Swiper('.swiper-container', {
  pagination: {
    el: '.swiper-pagination',
    dynamicBullets: true,
  },
});


