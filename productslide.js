const slider = document.querySelector(".offer-slider");
const track = document.querySelector(".offer-track");
const cards = document.querySelectorAll(".offer-card");
const dotsContainer = document.querySelector(".slider-dots");

let current = 0;
let autoSlide = null;
let isDragging = false;
let userInteracted = false;

let startX = 0;
let currentTranslate = 0;
let previousTranslate = 0;

let sliderActive = false;


enableSlider();


/* =========================
   DOTS
========================= */

function createDots(){

  dotsContainer.innerHTML = "";

  cards.forEach((_, index)=>{

    const dot = document.createElement("span");

    if(index === current){
      dot.classList.add("active");
    }

    dotsContainer.appendChild(dot);
  });
}

/* =========================
   UPDATE
========================= */

function updateSlider(){

  const cardWidth = cards[0].offsetWidth + 20;

  track.style.transition = "transform 0.4s ease";
  track.style.transform = `translateX(-${current * cardWidth}px)`;

  previousTranslate = -(current * cardWidth);

  const dots = document.querySelectorAll(".slider-dots span");

  dots.forEach(dot => dot.classList.remove("active"));

  if(dots[current]){
    dots[current].classList.add("active");
    
    // --- SMART SCROLLABLE DOTS LOGIC ---
    const wrapper = document.querySelector(".dots-wrapper");
    if (wrapper) {
      const activeDot = dots[current];
      const wrapperWidth = wrapper.offsetWidth;
      const dotOffset = activeDot.offsetLeft;
      const dotWidth = activeDot.offsetWidth;

      // Target position to center the active dot inside the wrapper window
      let transformX = -(dotOffset - (wrapperWidth / 2) + (dotWidth / 2));

      // Constraint boundaries so the dots track doesn't scroll past the ends
      const maxScroll = 0;
      const minScroll = -(dotsContainer.scrollWidth - wrapperWidth);

      if (transformX > maxScroll) transformX = maxScroll;
      if (transformX < minScroll) transformX = minScroll;

      dotsContainer.style.transform = `translateX(${transformX}px)`;
    }
    // ------------------------------------
  }
}

/* =========================
   AUTOPLAY
========================= */

function startAutoSlide(){

      if(userInteracted) return;

  stopAutoSlide();

  autoSlide = setInterval(()=>{

    current++;

    if(current >= cards.length){
      current = 0;
    }

    updateSlider();

  }, 3000);
}

function stopAutoSlide(){

  clearInterval(autoSlide);
}

/* =========================
   DRAG
========================= */

function getPositionX(e){

  return e.type.includes("mouse")
  ? e.pageX
  : e.touches[0].clientX;
}

function dragStart(e){

  userInteracted = true;

  stopAutoSlide();

  isDragging = true;

  startX = getPositionX(e);

  track.style.transition = "none";
}

function dragMove(e){

  if(!isDragging) return;

  const currentX = getPositionX(e);

  const diff = currentX - startX;

  currentTranslate =
  previousTranslate + diff;

  track.style.transform =
  `translateX(${currentTranslate}px)`;
}

function dragEnd(){

  if(!isDragging) return;

  isDragging = false;

  const cardWidth = cards[0].offsetWidth + 20;

  const movedBy = currentTranslate - previousTranslate;
  //sensitivity is 40px
  const sensitivity = 40;

  // 3. Get the exact decimal index of where the slider is currently sitting
  let rawIndex = -currentTranslate / cardWidth;

  if (movedBy < -sensitivity) {
    // Swiped left 
    current = Math.ceil(rawIndex);
  } else if (movedBy > sensitivity) {
    // Swiped right 
    current = Math.floor(rawIndex);
  } else {
    // No swipe
    current = Math.round(rawIndex);
  }

  // 5. Ensure the index doesn't go out of bounds
  current = Math.max(
    0,
    Math.min(current, cards.length - 1)
  );

  updateSlider();

  startAutoSlide();
}

/* =========================
   ENABLE MOBILE SLIDER
========================= */

function enableSlider(){

  if(sliderActive) return;

  sliderActive = true;

  createDots();

  startAutoSlide();

  track.addEventListener(
    "touchstart",
    dragStart
  );

  track.addEventListener(
    "touchmove",
    dragMove
  );

  track.addEventListener(
    "touchend",
    dragEnd
  );

  track.addEventListener(
    "mousedown",
    dragStart
  );

  track.addEventListener(
    "mousemove",
    dragMove
  );

  track.addEventListener(
    "mouseup",
    dragEnd
  );

  track.addEventListener(
    "mouseleave",
    dragEnd
  );

  updateSlider();
}

/* =========================
   DISABLE MOBILE SLIDER
========================= */

function disableSlider(){

  if(!sliderActive) return;

  sliderActive = false;

  stopAutoSlide();

  track.style.transform = "";
  track.style.transition = "";

  dotsContainer.innerHTML = "";
}

/* =========================
   INIT
========================= */

checkSlider();

window.addEventListener(
  "resize",
  checkSlider
);

/* PREVENT IMAGE DRAG */

track.querySelectorAll("img")
.forEach(img => {

  img.draggable = false;
});

