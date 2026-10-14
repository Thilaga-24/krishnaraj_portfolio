const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

// Gallery filters
const filterButtons = document.querySelectorAll(".filter-button");
const galleryCards = Array.from(document.querySelectorAll(".gallery-card"));

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    galleryCards.forEach(card => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

// Accessible image lightbox with previous/next controls
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCount = document.getElementById("lightboxCount");
const visibleCards = () => galleryCards.filter(card => !card.hidden);
let currentIndex = 0;

function showImage(index) {
  const cards = visibleCards();
  if (!cards.length) return;
  currentIndex = (index + cards.length) % cards.length;
  const card = cards[currentIndex];
  const image = card.querySelector("img");
  lightboxImage.src = card.dataset.full;
  lightboxImage.alt = image.alt;
  lightboxCount.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
}

function openLightbox(card) {
  const cards = visibleCards();
  showImage(cards.indexOf(card));
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("lightboxClose").focus();
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
galleryCards.forEach(card => card.addEventListener("click", () => openLightbox(card)));
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
document.getElementById("lightboxPrev").addEventListener("click", () => showImage(currentIndex - 1));
document.getElementById("lightboxNext").addEventListener("click", () => showImage(currentIndex + 1));
lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showImage(currentIndex - 1);
  if (event.key === "ArrowRight") showImage(currentIndex + 1);
});
