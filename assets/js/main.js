const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");
const toast = document.querySelector("[data-toast]");
const form = document.querySelector("#request");
const formNote = document.querySelector("[data-form-note]");
let toastTimer;

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3600);
};

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    header.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

const year = document.querySelector("[data-year]");
if (year) {
  year.textContent = new Date().getFullYear();
}

document.querySelectorAll("[data-accordion] .faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const modals = new Map();

document.querySelectorAll(".modal").forEach((modal) => {
  modals.set(modal.id, modal);
});

const openModal = (id) => {
  const modal = modals.get(id);
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close")?.focus();
};

const closeModal = () => {
  document.querySelectorAll(".modal.is-open").forEach((modal) => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  });
  document.body.classList.remove("modal-open");
};

document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", () => openModal(button.dataset.openModal));
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

const normalizePhone = (value) => value.replace(/[^\d+]/g, "");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = Array.from(form.querySelectorAll("input[required], textarea[required]"));
  let isValid = true;

  fields.forEach((field) => {
    const valid = field.type === "checkbox" ? field.checked : field.value.trim().length > 0;
    field.classList.toggle("is-invalid", !valid);
    isValid = isValid && valid;
  });

  const phone = form.querySelector('input[name="phone"]');
  const phoneValue = normalizePhone(phone.value);
  const phoneIsValid = phoneValue.length >= 11;

  phone.classList.toggle("is-invalid", !phoneIsValid);
  isValid = isValid && phoneIsValid;

  if (!isValid) {
    if (formNote) {
      formNote.textContent = "Проверьте имя, телефон и согласие с политикой.";
      formNote.classList.remove("success");
    }
    return;
  }

  // TODO(form): после подключения endpoint заменить этот блок реальной отправкой данных.
  form.reset();
  if (formNote) {
    formNote.textContent = "Заявка заполнена корректно. Подключите обработчик формы, чтобы получать обращения.";
    formNote.classList.add("success");
  }
  showToast("Форма готова к подключению обработчика заявок.");
});
