navwrap = document.querySelector('.navbar-wrap');
// Get nav links
const navLinks = Array.from(document.querySelectorAll('.navbar-menu a'));
// Get the sections, links
const sections = Array.from(document.querySelectorAll('section'));
sections.unshift(document.querySelector('header'));

// Get sectionIds
const sectionIds = sections.map(section => `#${section.id}`);

// Hamburger menu interaction
const iPhoneMedia = window.matchMedia("(max-width: 600px)");
let canHover = !(matchMedia('(hover: none)').matches);
if (canHover) {
  document.body.classList.add('can-hover');
}

document.getElementById('hamburger').addEventListener('mouseup', showNavMenu);

window.addEventListener('scroll', () => {
  updateCurrent();
  if(!iPhoneMedia.matches){
    adjustNavbar();
  }
});

navwrap.addEventListener('click', smoothScroll);

let showNav = false;
function showNavMenu(e) {
  let navMenu = document.querySelector('.navbar-menu');
  showNav = !showNav;
  if(showNav){
    navMenu.style.maxHeight = '1000px';
  } else {
    navMenu.style.maxHeight = '0';
  }

}

function smoothScroll(e) {
  if(e.target.hasAttribute('href')){
    if(iPhoneMedia.matches){
      showNavMenu();
    }

    const section = sectionIds.indexOf(e.target.getAttribute('href'));
    sections[section].scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
  e.preventDefault();
}

function updateCurrent() {
  // Find current section -- start at last
  let current = sections.length - 1;
  while(sections[current].offsetTop > window.scrollY + navwrap.clientHeight)
  {
    navLinks[current].classList.remove('current');
    navLinks[current].classList.remove('can-hover');
    current--;
  }
  
  // Add class "current" to the current section
  navLinks[current].classList.add('current');
  navLinks[current].classList.add('can-hover');

  // Remove current for previous sections
  while(current > 0){
    navLinks[--current].classList.remove('current');
    navLinks[current].classList.remove('can-hover');
  }

}

function adjustNavbar() {
  if(window.scrollY > 0)
  {
    makeNavDark();
  }
  else {
    makeNavTransparent();
  }
}

function makeNavTransparent() {
  // More padding and transparent
  navwrap.querySelector('.logo').removeAttribute('style');
  navwrap.removeAttribute('style');
  navwrap.parentElement.parentElement.removeAttribute('style');
}

function makeNavDark(){
  // Shrink navbar and opaque background
  navwrap.querySelector('.logo').style.height = '3.5rem';
  navwrap.style.padding = '0.25rem 0';
  navwrap.parentElement.parentElement.style.background = 'rgba(0,0,0,1)';
}