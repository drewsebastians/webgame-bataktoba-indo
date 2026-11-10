export function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector("#nav-links-list");
  if (!toggle || !links) return;

  const setOpen = (open) => {
    links.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setOpen(!links.classList.contains("nav-open")));
  const closeOnEscape = (event) => {
    if (event.key !== "Escape" || toggle.getAttribute("aria-expanded") !== "true") return;
    event.preventDefault();
    setOpen(false);
    toggle.focus();
  };
  toggle.addEventListener("keydown", closeOnEscape);
  links.addEventListener("keydown", closeOnEscape);
}
