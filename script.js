const teamMembers = [
  {
    code: "LUX-01",
    name: "Santino Cerio",
    role: "Project Manager, tester y diseñador de IA",
    initials: "SC",
    photo: null,
    specialties: ["Producto", "Calidad", "IA"],
    accent: "#d3b46f",
  },
  {
    code: "LUX-02",
    name: "Exequiel Kelezuki",
    role: "Backend Developer",
    initials: "EK",
    photo: null,
    specialties: ["Backend", "Datos", "Arquitectura"],
    accent: "#72a8e8",
  },
  {
    code: "LUX-03",
    name: "Lautaro Coll",
    role: "Frontend Developer",
    initials: "LC",
    photo: null,
    specialties: ["Frontend", "Interacción", "Accesibilidad"],
    accent: "#63bba7",
  },
  {
    code: "LUX-04",
    name: "Victoria Berg",
    role: "Diseñadora UX/UI",
    initials: "VB",
    photo: null,
    specialties: ["UX", "Interfaz", "Sistemas"],
    accent: "#cb8ea9",
  },
];

const galleryItems = {
  dashboard: {
    src: "assets/app/dashboard.png",
    alt: "Dashboard de LuxIA con un resumen del trabajo",
    width: 689,
    height: 430,
  },
  causas: {
    src: "assets/app/causas.png",
    alt: "Vista de causas de LuxIA con controles para organizar expedientes",
    width: 674,
    height: 164,
  },
  agenda: {
    src: "assets/app/agenda.png",
    alt: "Agenda de LuxIA con calendario de audiencias y fechas",
    width: 668,
    height: 849,
  },
  documentos: {
    src: "assets/app/documentos.png",
    alt: "Vista documental de LuxIA con controles de búsqueda y carga",
    width: 667,
    height: 220,
  },
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");

const setMenuState = (open) => {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  navigation.classList.toggle("is-open", open);
  navigation.inert = window.innerWidth <= 860 && !open;
  document.body.classList.toggle("menu-open", open);
};

setMenuState(false);

menuToggle?.addEventListener("click", () => {
  setMenuState(menuToggle.getAttribute("aria-expanded") !== "true");
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
    setMenuState(false);
    menuToggle.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) setMenuState(false);
});

const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 20);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const teamGrid = document.querySelector("[data-team-grid]");

if (teamGrid) {
  teamGrid.innerHTML = teamMembers
    .map(
      (member) => `
        <article class="team-card reveal" style="--card-accent: ${member.accent}">
          <div class="team-card-inner">
            <div class="card-topline">
              <span class="card-code">${member.code}</span>
              <span class="card-class">Equipo LuxIA</span>
            </div>
            <div class="team-portrait">
              ${
                member.photo
                  ? `<img src="${member.photo}" alt="Fotografía de ${member.name}" loading="lazy" />`
                  : `<span class="team-initials" aria-label="Iniciales de ${member.name}">${member.initials}</span>`
              }
            </div>
            <div class="team-info">
              <h3>${member.name}</h3>
              <p class="team-role">${member.role}</p>
              <ul class="team-specialties" aria-label="Especialidades">
                ${member.specialties.map((specialty) => `<li>${specialty}</li>`).join("")}
              </ul>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

const galleryImage = document.querySelector("[data-gallery-image]");
const galleryTabs = [...document.querySelectorAll("[data-gallery-tab]")];
let galleryChangeTimer;

galleryTabs.forEach((tab, tabIndex) => {
  tab.addEventListener("click", () => {
    const item = galleryItems[tab.dataset.galleryTab];
    if (!item || !galleryImage) return;

    galleryTabs.forEach((otherTab) => {
      const selected = otherTab === tab;
      otherTab.classList.toggle("is-active", selected);
      otherTab.setAttribute("aria-selected", String(selected));
      otherTab.tabIndex = selected ? 0 : -1;
    });

    window.clearTimeout(galleryChangeTimer);
    galleryImage.classList.add("is-changing");
    galleryChangeTimer = window.setTimeout(
      () => {
        galleryImage.src = item.src;
        galleryImage.alt = item.alt;
        galleryImage.width = item.width;
        galleryImage.height = item.height;
        galleryImage.classList.remove("is-changing");
      },
      reducedMotion ? 0 : 160,
    );
  });

  tab.addEventListener("keydown", (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (tabIndex + direction + galleryTabs.length) % galleryTabs.length;
    galleryTabs[nextIndex].focus();
    galleryTabs[nextIndex].click();
  });
});

const revealElements = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".team-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.style.setProperty("--rotate-x", `${(0.5 - y) * 4}deg`);
      card.style.setProperty("--rotate-y", `${(x - 0.5) * 5}deg`);
      card.style.setProperty("--shine-angle", `${95 + x * 40}deg`);
      card.style.setProperty("--shine-opacity", "1");
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rotate-x", "0deg");
      card.style.setProperty("--rotate-y", "0deg");
      card.style.setProperty("--shine-opacity", "0");
    });
  });
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();
