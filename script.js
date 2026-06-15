const navMenu = document.getElementById("navMenu");
const hamburger = document.querySelector(".hamburger");
const navOverlay = document.getElementById("js-nav-overlay");

let lastScroll = 0;
const header = document.getElementById("header");
let isNavScrolling = false;

/* HEADER SHOW/HIDE */
window.addEventListener("scroll", () => {
  const isMobile = window.innerWidth <= 1100;
  
  if(!isMobile){
  if (isNavScrolling) {
    detectScrollEnd();
  }

  if (!isNavScrolling) {
    let currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll) {
      header.style.top = "-80px";
    } else {
      header.style.top = "0";
    }

    lastScroll = currentScroll;
  }
  }

  updateActiveSection();
});


/* NAVIGATION */
const links = document.querySelectorAll(".nav-link");
const indicator = document.querySelector(".nav-indicator");

function moveIndicator(element) {
  const isMobile = window.innerWidth <= 1100;

  if (isMobile) {
    indicator.style.width = "0px";
    indicator.style.height = "0px";
  } else {
    indicator.style.width = `${element.offsetWidth}px`;
    indicator.style.left = `${element.offsetLeft}px`;
    indicator.style.top = "6px";
    indicator.style.height = `calc(100% - 12px)`;
  }
}

/* CLICK NAV */
links.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    isNavScrolling = true;

    links.forEach(l => l.classList.remove("active"));
    this.classList.add("active");
    moveIndicator(this);

    header.style.top = "0";

    const targetSection = document.querySelector(
      this.getAttribute("href")
    );

    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

   closeMenu();
   detectScrollEnd();
  });
});

/* nav scroll end checker */
let scrollTimeout;

function detectScrollEnd() {
  clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {
    isNavScrolling = false;
    lastScroll = window.pageYOffset;
  }, 100);
}

/* ACTIVE SECTION DETECTION */
function updateActiveSection() {
  if (isNavScrolling) return;

  let sections = document.querySelectorAll("section");

  sections.forEach(section => {
    const top = window.scrollY;
    const offset = section.offsetTop - 150;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (top >= offset && top < offset + height) {
      links.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
          moveIndicator(link);
        }
      });
    }
  });
}

/* INITIAL LOAD */
window.onload = () => {
  const activeLink = document.querySelector(".nav-link.active");
  moveIndicator(activeLink);
};

function toggleMenu() {
  const isOpen = navMenu.classList.toggle("show");
  
  if (hamburger) hamburger.classList.toggle('active');
  if (navOverlay) navOverlay.classList.toggle('active');
  
  // Freeze body background scrolling on mobile when menu is active
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

/* EXPLICIT MENU CLOSER */
function closeMenu() {
  if (hamburger) hamburger.classList.remove('active');
  if (navMenu) navMenu.classList.remove("show");
  if (navOverlay) navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* EVENT LISTENERS FOR CLOSING */
if (hamburger) hamburger.addEventListener('click', toggleMenu);
if (navOverlay) navOverlay.addEventListener('click', closeMenu);