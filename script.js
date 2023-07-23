'use strict';

///////////////////////////////////////
// Modal window
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');
const message = document.createElement('div');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// cookie message:
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies for improved fucntionality and analytics.<button class ="btn btn--close-cookie">Got it!</button>';

header.prepend(message);

//delete elements:

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); //sinijor programerur
  });

//Styles
message.style.backgroundColor = '#37383d';
message.style.position = 'sticky';

// document.documentElement.style.setProperty('--color-primary','orangered')

//Smooth scroll:
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});
document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});

//operations section
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//hover effect when mouse enters/exit the navigation menu
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    // logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation: Intersection Observer API:
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = entries => {
  const [entry] = entries;
  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Revealing images:
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return; //guard statement

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); //stop log na console observera
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15, //15% od viewporta
});
allSections.forEach(function (section) {
  //radimo forEach da se primeni za svaku sekciju
  sectionObserver.observe(section); // omogucavanje rada
  section.classList.add('section--hidden');
});
// lazy loading images:
const allImage = document.querySelectorAll('img[data-src]');

const lazyLoad = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});
allImage.forEach(function (images) {
  imgObserver.observe(images);
});

//slajdovi:
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const dotContainer = document.querySelector('.dots');
let curSlide = 0;
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const maxSlide = slides.length;
// slider.style.transform = 'scale(1)';
// slider.style.overflow = 'visible';

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class ="dots__dot" data-slide="${i}
    "></button>`
    );
  });
};
createDots();

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
goToSlide(0);

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
};
btnRight.addEventListener('click', nextSlide);

const prevSLide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
};
btnLeft.addEventListener('click', prevSLide);

// Tasteri leva i desna strelica:
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    nextSlide();
  }
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    prevSLide();
  }
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.closest('.dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
  }
});
