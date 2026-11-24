// Asma Radwan — Portfolio scripts (no dependencies)
(() => {
  const root = document.documentElement;

  /* ---------- Theme (light / dark) ---------- */
  const themeBtn = document.getElementById("themeToggle");
  const setTheme = (t) => {
    root.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
    themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    document.querySelector('meta[name="theme-color"]').setAttribute("content", t === "dark" ? "#0d0f14" : "#fbfaf9");
  };
  setTheme(root.getAttribute("data-theme") || "light");
  themeBtn.addEventListener("click", () => setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));
  // Follow the OS setting until the visitor picks a theme themselves
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme-chosen")) setTheme(e.matches ? "dark" : "light");
  });
  themeBtn.addEventListener("click", () => localStorage.setItem("theme-chosen", "1"));

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById("menuToggle");
  const links = document.getElementById("navLinks");
  menuBtn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => { links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); })
  );

  /* ---------- Nav: border on scroll + active section ---------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const navAnchors = [...links.querySelectorAll('a[href^="#"]')];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));

  /* ---------- Typing effect ---------- */
  const typed = document.getElementById("typed");
  const words = ["Data Analytics Engineer", "Data Analyst", "Data Scientist", "BI Developer"];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typed && !reduce) {
    let w = 0, i = words[0].length, deleting = true;
    const tick = () => {
      const word = words[w];
      i += deleting ? -1 : 1;
      typed.textContent = word.slice(0, i);
      let delay = deleting ? 40 : 80;
      if (!deleting && i === word.length) { deleting = true; delay = 1800; }
      else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2200);
  }

  /* ---------- Project filters ---------- */
  const filters = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.setAttribute("aria-pressed", b === btn));
      const f = btn.dataset.filter;
      projects.forEach((p) => p.classList.toggle("hidden", f !== "all" && !p.dataset.cat.split(" ").includes(f)));
    })
  );

  /* ---------- Lightbox ---------- */
  const box = document.getElementById("lightbox");
  const boxImg = box.querySelector("img");
  const boxTitle = box.querySelector("h3");
  const prev = box.querySelector("[data-prev]");
  const next = box.querySelector("[data-next]");
  let gallery = [], idx = 0;
  const show = () => {
    boxImg.src = gallery[idx];
    boxImg.alt = boxTitle.textContent + (gallery.length > 1 ? ` — view ${idx + 1} of ${gallery.length}` : "");
    prev.hidden = next.hidden = gallery.length < 2;
  };
  document.querySelectorAll(".project-thumb").forEach((t) =>
    t.addEventListener("click", () => {
      gallery = t.dataset.gallery.split(",");
      idx = 0;
      boxTitle.textContent = t.closest(".project").querySelector("h3").textContent;
      show();
      box.showModal();
    })
  );
  prev.addEventListener("click", () => { idx = (idx - 1 + gallery.length) % gallery.length; show(); });
  next.addEventListener("click", () => { idx = (idx + 1) % gallery.length; show(); });
  box.querySelector("[data-close]").addEventListener("click", () => box.close());
  box.addEventListener("click", (e) => { if (e.target === box) box.close(); });
  box.addEventListener("keydown", (e) => {
    if (gallery.length < 2) return;
    if (e.key === "ArrowLeft") prev.click();
    if (e.key === "ArrowRight") next.click();
  });

  /* ---------- Reveal on scroll ---------- */
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); reveal.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));

  /* ---------- Contact form (FormSubmit, no backend needed) ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    status.className = "form-status";
    status.textContent = "Sending…";
    btn.disabled = true;
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === "false" || data.success === false) throw new Error(data.message || "Request failed");
      form.reset();
      status.classList.add("ok");
      status.textContent = "Thank you! Your message was sent. I'll get back to you soon.";
    } catch (err) {
      status.classList.add("err");
      status.innerHTML = 'Sorry, something went wrong. Please email me directly at <a href="mailto:asma.magdy.hamed@gmail.com">asma.magdy.hamed@gmail.com</a>.';
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
