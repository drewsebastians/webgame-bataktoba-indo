export function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector("#nav-links-list");
  if (!links) return;

  const currentPage = document.body?.dataset.page;
  links.querySelectorAll("a[data-nav]").forEach((link) => {
    if (link.dataset.nav === currentPage) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (!toggle) return;

  const nav = toggle.closest(".nav") || toggle.parentElement;

  const setOpen = (open) => {
    links.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setOpen(!links.classList.contains("nav-open")));

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || toggle.getAttribute("aria-expanded") !== "true") return;
    event.preventDefault();
    setOpen(false);
    toggle.focus();
  });

  document.addEventListener("pointerdown", (event) => {
    if (toggle.getAttribute("aria-expanded") !== "true" || nav?.contains(event.target)) return;
    setOpen(false);
  });

  document.addEventListener("focusin", (event) => {
    if (toggle.getAttribute("aria-expanded") !== "true" || nav?.contains(event.target)) return;
    setOpen(false);
  });

  const mobileViewport = window.matchMedia("(max-width: 720px)");
  mobileViewport.addEventListener("change", (event) => {
    if (!event.matches) setOpen(false);
  });
}
