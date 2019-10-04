navwrap = document.querySelector('.navbar-wrap');
// Get nav links
const navLinks = Array.from(document.querySelectorAll('.navbar-menu a'));
// Get the sections, links
const sections = Array.from(document.querySelectorAll('section'));
sections.unshift(document.querySelector('header'));

window.addEventListener('scroll', () => {
  updateCurrent();
  adjustNavbar();
});

navwrap.addEventListener('click', smoothScroll);

function smoothScroll(e) {
  if(e.target.hasAttribute('href')){
    const section = navLinks.indexOf(e.target);
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
    current--;
  }
  
  // Add class "current" to the current section
  navLinks[current].classList.add('current');

  // Remove current for previous sections
  while(current > 0)
    navLinks[--current].classList.remove('current');
}

function adjustNavbar() {
  if(window.scrollY > 0)
  {
    // Shrink navbar and opaque background
    navwrap.querySelector('.logo').style.height = '4rem';
    navwrap.style.padding = '0.25rem 0';
    navwrap.parentElement.parentElement.style.background = 'rgba(0,0,0,1)';
  }
  else {
    // More padding and transparent
    navwrap.querySelector('.logo').removeAttribute('style');
    navwrap.removeAttribute('style');
    navwrap.parentElement.parentElement.removeAttribute('style');
  }
}