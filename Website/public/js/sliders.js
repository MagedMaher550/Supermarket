let appendNumber = 4;
let prependNumber = 1;
let slidesPerViewDeals = 2;
let slidesPerViewOtherSliders = 5;
let slidesPerViewBrandsSlider = 6;

const maxMedia768 = window.matchMedia('(max-width: 768px)')
const maxMedia992 = window.matchMedia('(max-width: 992px)')
const maxMedia1200 = window.matchMedia('(max-width: 1200px)')

const minMedia768 = window.matchMedia('(min-width: 768px)')
const minMedia992 = window.matchMedia('(min-width: 992px)')
const minMedia1200 = window.matchMedia('(min-width: 1200px)')


if(maxMedia992.matches) {
  slidesPerViewDeals = 1;
}

if(minMedia992.matches && maxMedia1200.matches){
  slidesPerViewOtherSliders = 4;
} else if(minMedia768.matches && maxMedia992.matches) {
  slidesPerViewOtherSliders = 3;
  slidesPerViewBrandsSlider = 4;
} else if (maxMedia768.matches) {
  slidesPerViewOtherSliders = 2;
  slidesPerViewBrandsSlider = 3;
}




let swiperDeals = new Swiper('.swiper1', {
  slidesPerView: slidesPerViewDeals,
  centeredSlides: false,
  spaceBetween: 0,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

let swiperSilders = new Swiper('.swiper2', {
  slidesPerView: slidesPerViewOtherSliders,
  centeredSlides: false,
  spaceBetween: 0,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

let swiperBrandsSlider = new Swiper('.swiper3', {
  slidesPerView: slidesPerViewBrandsSlider,
  autoplay: {
    delay: 1500,
  },
  centeredSlides: false,
  spaceBetween: 0,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
