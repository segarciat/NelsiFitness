// Wrapper for navbar animations --- IIFE
const Navbar = (() => {
  // Nav elements
  const nav = document.querySelector("nav");
  const navwrap = document.querySelector(".navbar-wrap");
  const navMenu = document.querySelector(".navbar-menu");
  const navLinks = Array.from(document.querySelectorAll(".navbar-menu a"));
  const hamburger = document.getElementById("hamburger");

  // Website sections and ids
  const sections = [
    document.querySelector("header"),
    ...Array.from(document.querySelectorAll("section"))
  ];

  const sectionIds = sections.map(section => `#${section.id}`);

  // Flags for toggling navmenu on small devices
  const smallDevice = window.matchMedia("(max-width: 600px)");
  let showNav = 0;

  const loadEventListeners = () => {
    navMenu.addEventListener("click", scrollNav);
    hamburger.addEventListener("mouseup", toggleMenu);
    window.addEventListener("scroll", () => {
      updateCurrent();
      if (!smallDevice.matches) {
        adjustNavbar();
      }
    });
  };

  const scrollNav = e => {
    if (e.target.hasAttribute("href")) {
      let scrollBehavior = "smooth";
      // Tapping link hides navbar on small device
      if (smallDevice.matches) {
        toggleMenu();
        scrollBehavior = "auto";
      }

      // Match section id and scroll to section
      const section = sectionIds.indexOf(e.target.getAttribute("href"));
      sections[section].scrollIntoView({
        behavior: scrollBehavior,
        block: "start"
      });
    }
    // Default behavior: link jumps to section
    e.preventDefault();
  };

  // Darken nav only when scrolled off the top
  const adjustNavbar = () => {
    if (window.scrollY > 0) {
      darkenNav();
    } else {
      lightenNav();
    }
  };

  // Transparent navbar with more padding
  const lightenNav = () => {
    // More padding and transparent
    navwrap.querySelector(".logo").removeAttribute("style");
    navwrap.removeAttribute("style");
    nav.removeAttribute("style");
  };

  // More opaque, dark navbar, shrunk
  const darkenNav = () => {
    // Shrink navbar and opaque background
    navwrap.querySelector(".logo").style.height = "3.5rem";
    navwrap.style.padding = "0.25rem 0";
    nav.style.background = "rgba(0,0,0,1)";
  };

  // Hamburger clicked: toggle navMenu
  const toggleMenu = () => {
    showNav = (showNav + 1) % 2;
    navMenu.style.maxHeight = `${1000 * showNav}px`;
  };

  // Places id "current" on navlink for underline
  const updateCurrent = () => {
    // Find current section, remove id (of current)
    let current = sections.length - 1;
    while (
      sections[current].offsetTop >
      window.scrollY + navwrap.clientHeight
    ) {
      // Remove current id from it
      navLinks[current].removeAttribute("id");
      current--;
    }

    // Add id "current" to the current section
    navLinks[current].id = "current";

    // Remove id "current" from the rest
    while (current > 0) {
      navLinks[--current].removeAttribute("id");
    }
  };

  loadEventListeners();
})();
