/* =========================================================
   JAYA PORTFOLIO — interaksi
   Ubah data kontak di CONFIG di bawah ini.
   ========================================================= */
const CONFIG = {
  email: "Jaxyaa4@gmail.com",
  github: "https://github.com/jaxyaa",
  instagram: "https://www.instagram.com/brxziee.ex/",
  spotify: "https://open.spotify.com/playlist/5CliBMTwtND7QeWwQfo9Ht?si=of2eBEGqQMy82gSI3URQkw",
  // Komentar publik: isi dengan URL Firebase Realtime Database agar komentar bisa dilihat semua orang.
  // Contoh: "https://nama-project-default-rtdb.asia-southeast1.firebasedatabase.app"
  // Kosongkan = mode demo (komentar hanya tersimpan di browser ini). Lihat README.
  commentsDbUrl: "",
};

document.documentElement.classList.add("js");

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- Tautan kontak dari CONFIG ---------- */
$$("[data-link]").forEach((a) => {
  const k = a.dataset.link;
  a.href = k === "email" ? "mailto:" + CONFIG.email : CONFIG[k];
});

/* ---------- Navigasi mobile ---------- */
const menuBtn = $("#menuBtn");
const nav = $("#nav");
function setMenu(open) {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.textContent = open ? "CLOSE ✕" : "MENU ☰";
}
menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
$$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
document.addEventListener("click", (e) => {
  if (nav.classList.contains("open") && !nav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
});
window.matchMedia("(min-width: 801px)").addEventListener("change", () => setMenu(false));

/* ---------- Link aktif saat scroll ---------- */
const navLinks = $$("a", nav);
const sections = $$("main section[id]");
function setActive(id) {
  navLinks.forEach((a) => {
    const on = a.getAttribute("href") === "#" + id;
    a.classList.toggle("active", on);
    on ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
  });
}
const spy = new IntersectionObserver(
  (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)),
  { rootMargin: "-35% 0px -55% 0px" },
);
sections.forEach((s) => spy.observe(s));

/* ---------- Scroll: progress bar, header, tombol ke atas ---------- */
const progress = $("#progress");
const headerShell = $("#headerShell");
const toTop = $("#toTop");
let lastY = 0;
let ticking = false;
function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
  headerShell.classList.toggle("scrolled", y > 20);
  headerShell.classList.toggle("hidden", y > lastY && y > 240 && !nav.classList.contains("open"));
  toTop.classList.toggle("show", y > 700);
  if (max > 0 && max - y < 8) setActive("contact"); // pastikan CONTACT aktif di dasar halaman
  lastY = y;
  ticking = false;
}
window.addEventListener("scroll", () => !ticking && ((ticking = true), requestAnimationFrame(onScroll)), { passive: true });
onScroll();
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

/* ---------- Reveal saat scroll ---------- */
const revealSel = [
  ".hero .kicker",
  ".hero h1",
  ".hero .lead",
  ".hero .actions",
  ".profile-stage",
  ".section-head",
  ".about-photo",
  ".about-copy > *",
  ".project-card",
  ".contact-grid > div > *",
  ".comments > *",
];
const revealEls = $$(revealSel.join(","));
if ("IntersectionObserver" in window && !reduceMotion) {
  revealEls.forEach((el) => el.classList.add("reveal"));
  $$(".about-photo").forEach((el) => el.classList.add("clip"));
  $$(".about-copy > *").forEach((el) => el.classList.add("from-right"));
  // jeda berurutan untuk elemen bersaudara
  revealEls.forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.setProperty("--d", Math.min(sibs.indexOf(el), 6) * 90 + "ms");
  });
  // elemen ber-clip-path tidak terdeteksi observer → pantau induknya
  const triggers = new Map();
  revealEls.forEach((el) => triggers.set(el.classList.contains("clip") ? el.parentElement : el, el));
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = triggers.get(en.target);
        el.classList.add("in");
        io.unobserve(en.target);
        // setelah animasi selesai, kembalikan transisi bawaan elemen (hover dll.)
        setTimeout(() => {
          el.classList.remove("reveal", "in");
          el.style.removeProperty("--d");
        }, 1800);
      }),
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  triggers.forEach((_, t) => io.observe(t));
}

/* ---------- Efek scramble pada menu ---------- */
const chars = "ABCDEFGHJKLMNPRSTUVWXYZ#%*";
if (!reduceMotion && finePointer) {
  navLinks.forEach((link) => {
    const original = link.textContent;
    let busy = false;
    link.addEventListener("pointerenter", () => {
      if (busy) return;
      busy = true;
      let frame = 0;
      const t = setInterval(() => {
        link.textContent = [...original].map((ch, i) => (i < frame / 2 ? ch : chars[Math.floor(Math.random() * chars.length)])).join("");
        if (++frame > original.length * 2) {
          clearInterval(t);
          link.textContent = original;
          busy = false;
        }
      }, 30);
    });
  });
}

/* ---------- Efek 3D tilt + sorotan pada kartu proyek & potret ---------- */
if (!reduceMotion && finePointer) {
  $$(".project-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", x * 100 + "%");
      card.style.setProperty("--my", y * 100 + "%");
      card.style.setProperty("--rx", (0.5 - y) * 6 + "deg");
      card.style.setProperty("--ry", (x - 0.5) * 8 + "deg");
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });

  const stage = $(".profile-stage");
  const portrait = $(".portrait");
  const orbit = $(".orbit");
  stage.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    portrait.style.transform = `translate(${x * 14}px, ${y * 14}px)`;
    orbit.style.transform = `translate(${x * -18}px, ${y * -18}px)`;
  });
  stage.addEventListener("pointerleave", () => {
    portrait.style.transform = "";
    orbit.style.transform = "";
  });
}

/* ---------- Toast ---------- */
const toast = $("#toast");
let toastTimer;
function showToast(msg, type = "ok") {
  toast.textContent = msg;
  toast.className = "toast show " + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.className = "toast"), 4200);
}

/* ---------- Parallax foto About ---------- */
const aboutPhoto = $(".about-photo .photo");
if (aboutPhoto && !reduceMotion) {
  window.addEventListener(
    "scroll",
    () => {
      const r = aboutPhoto.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; // -1..1
      aboutPhoto.style.transform = `translateY(${p * -28}px)`;
    },
    { passive: true },
  );
}

/* ---------- Modal proyek ---------- */
const cards = $$(".project-card");
const modal = $("#modal");
const mMedia = $("#modalMedia");
let current = -1;
let lastFocus = null;

function fillModal(i) {
  current = (i + cards.length) % cards.length;
  const card = cards[current];
  mMedia.replaceChildren($(".project-image", card).cloneNode(true));
  $("#modalNo").textContent = `PROJECT ${String(current + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
  $("#modalTitle").textContent = $("h3", card).textContent;
  $("#modalDesc").textContent = $(".project-info p", card).textContent;
  $("#modalMeta").replaceChildren(...$$(".project-meta span", card).map((n) => n.cloneNode(true)));
}
function openModal(i) {
  lastFocus = document.activeElement;
  fillModal(i);
  modal.hidden = false;
  document.body.classList.add("modal-open");
  $(".modal-close").focus();
}
function closeModal() {
  if (modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  lastFocus && lastFocus.focus();
}
cards.forEach((card, i) => {
  card.addEventListener("click", () => openModal(i));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(i);
    }
  });
});
$$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeModal));
$("#modalPrev").addEventListener("click", () => fillModal(current - 1));
$("#modalNext").addEventListener("click", () => fillModal(current + 1));
document.addEventListener("keydown", (e) => {
  if (modal.hidden) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") fillModal(current - 1);
  if (e.key === "ArrowRight") fillModal(current + 1);
  if (e.key === "Tab") {
    // jaga fokus tetap di dalam modal
    const f = $$("button", modal).filter((b) => b.offsetParent !== null);
    const first = f[0],
      last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
    else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
  }
});

/* ---------- Komentar publik ---------- */
const DB = (CONFIG.commentsDbUrl || "").replace(/\/$/, "");
const LS_KEY = "jaya-comments-v1";
const LS_LAST = "jaya-last-post";
const COOLDOWN = 20000; // jeda antar komentar (ms)
const cForm = $("#commentForm");
const cList = $("#commentList");
const cCount = $("#commentCount");
const charCount = $("#charCount");

const safeLS = {
  get: (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
};

$("#storageMode").textContent = DB ? "● Public · visible to everyone" : "Demo mode · saved in this browser only";

function timeAgo(ts) {
  const s = Math.max(0, (Date.now() - ts) / 1000);
  if (s < 45) return "just now";
  if (s < 3600) return Math.round(s / 60) + " min ago";
  if (s < 86400) return Math.round(s / 3600) + " h ago";
  if (s < 2592000) return Math.round(s / 86400) + " d ago";
  return new Date(ts).toLocaleDateString();
}
const clean = (v, max) => String(v ?? "").replace(/\s+\n/g, "\n").trim().slice(0, max);

async function fetchComments() {
  let rows;
  if (DB) {
    const r = await fetch(`${DB}/comments.json?orderBy="$key"&limitToLast=100`);
    if (!r.ok) throw new Error("load failed");
    const data = (await r.json()) || {};
    rows = Object.entries(data).map(([id, v]) => ({ id, ...v }));
  } else {
    try {
      rows = JSON.parse(safeLS.get(LS_KEY) || "[]");
    } catch {
      rows = [];
    }
  }
  return rows
    .filter((c) => c && c.name && c.message)
    .map((c) => ({ id: c.id, name: clean(c.name, 30), message: clean(c.message, 300), ts: Number(c.ts) || 0 }))
    .sort((a, b) => b.ts - a.ts);
}

async function saveComment(c) {
  if (DB) {
    const r = await fetch(`${DB}/comments.json`, { method: "POST", body: JSON.stringify(c) });
    if (!r.ok) throw new Error("save failed");
  } else {
    let rows = [];
    try {
      rows = JSON.parse(safeLS.get(LS_KEY) || "[]");
    } catch {}
    rows.push(c);
    safeLS.set(LS_KEY, JSON.stringify(rows.slice(-100)));
  }
}

function render(rows) {
  cCount.textContent = rows.length === 1 ? "1 comment" : rows.length + " comments";
  if (!rows.length) {
    const li = document.createElement("li");
    li.className = "comment-empty";
    li.textContent = "No comments yet. Be the first to say hello!";
    return cList.replaceChildren(li);
  }
  cList.replaceChildren(
    ...rows.map((c) => {
      const li = document.createElement("li");
      li.className = "comment";
      const av = document.createElement("div");
      av.className = "comment-av";
      av.textContent = (c.name[0] || "?").toUpperCase();
      const box = document.createElement("div");
      const meta = document.createElement("div");
      meta.className = "comment-meta";
      const b = document.createElement("b");
      b.textContent = c.name;
      const t = document.createElement("time");
      t.textContent = timeAgo(c.ts);
      t.dateTime = new Date(c.ts).toISOString();
      meta.append(b, t);
      const p = document.createElement("p");
      p.textContent = c.message; // textContent → aman dari XSS
      box.append(meta, p);
      li.append(av, box);
      return li;
    }),
  );
}

async function refresh() {
  try {
    render(await fetchComments());
  } catch {
    cCount.textContent = "Comments";
    const li = document.createElement("li");
    li.className = "comment-empty";
    li.textContent = "Couldn't load comments right now.";
    cList.replaceChildren(li);
  }
}

cForm.message.addEventListener("input", () => (charCount.textContent = `${cForm.message.value.length} / 300`));
$$("input, textarea", cForm).forEach((el) => el.addEventListener("input", () => el.classList.remove("invalid")));

cForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (cForm.website.value) return; // honeypot (bot)
  const name = clean(cForm.name.value, 30);
  const message = clean(cForm.message.value, 300);
  cForm.name.classList.toggle("invalid", !name);
  cForm.message.classList.toggle("invalid", !message);
  if (!name || !message) {
    (name ? cForm.message : cForm.name).focus();
    return showToast("Please fill in your name and comment.", "err");
  }
  const wait = COOLDOWN - (Date.now() - Number(safeLS.get(LS_LAST) || 0));
  if (wait > 0) return showToast(`Please wait ${Math.ceil(wait / 1000)}s before posting again.`, "err");

  const btn = $("button[type=submit]", cForm);
  btn.disabled = true;
  try {
    await saveComment({ name, message, ts: Date.now() });
    safeLS.set(LS_LAST, String(Date.now()));
    cForm.message.value = "";
    charCount.textContent = "0 / 300";
    showToast("Comment posted. Thank you!");
    await refresh();
  } catch {
    showToast("Couldn't post your comment. Please try again.", "err");
  } finally {
    btn.disabled = false;
  }
});

refresh();
if (DB) setInterval(() => !document.hidden && refresh(), 30000);
