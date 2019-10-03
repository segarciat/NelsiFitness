navwrap = document.querySelector('.navbar-wrap');

window.addEventListener('scroll', () => {
  updateCurrent();
  adjustNavbar();
});

function updateCurrent() {
  // Get the sections, links
  const sections = Array.from(document.querySelectorAll('section'));
  sections.unshift(document.querySelector('header'));

  // Get nav links and nav height
  const navLinks = document.querySelectorAll('.navbar-menu a');
  
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
    navwrap.querySelector('.logo').style.height = '4rem';
    navwrap.style.padding = '0.25rem 0';
    navwrap.parentElement.parentElement.style.background = 'rgba(0,0,0,1)';
  }
  else {
    navwrap.querySelector('.logo').removeAttribute('style');
    navwrap.removeAttribute('style');
    navwrap.parentElement.parentElement.removeAttribute('style');
  }
}