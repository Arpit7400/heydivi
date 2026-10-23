/* =====================================================================
   For Divya — main.js
   Everything personal lives in CONFIG. Edit only this object.
   ===================================================================== */
const CONFIG = {
  herName: "Divya",
  myName: "Arpit",
  birthday: "2026-10-24T00:00:00", // 24 October — next one falls in 2026
  song: "audio/song.mp3",

  // Add 3–30 photos. Drop files in /images and list them here.
  // Captions below already match your story — just point src to your real files.
  photos: [
    { src: "images/1.jpg", caption: "Pachmarhi, 2019 — where it all began", year: "2019" },
    { src: "images/2.jpg", caption: "The first time I knew it was you", year: "2019" },
    { src: "images/3.jpg", caption: "Udaipur, tumhare saath", year: "2022" },
    { src: "images/4.jpg", caption: "Jaipur — pinker because of you", year: "2023" },
    { src: "images/5.jpg", caption: "You, in my clothes, stealing my heart", year: "2024" },
    { src: "images/6.jpg", caption: "Just us, being us", year: "2025" },
  ],

  // 6–10 short reasons — straight from your words, softened a little
  reasons: [
    "Jis din tumne ek pair pe khade hokar mere liye khana banaya — that melted me, and I'll never forget it.",
    "The way food just tastes better when I eat it from your hands. Har baar.",
    "How much I love teasing you… and how you put up with me anyway.",
    "Tumhari possessiveness for me — it makes me feel like I'm truly yours.",
    "You in my clothes. Honestly, there's no better sight in the world.",
    "The way an ordinary day turns into my favourite one just because you're in it.",
    "Every laugh we share — I could spend my whole life collecting them.",
    "Simply — kyunki tum tum ho, Divya.",
  ],

  // Your letter — one string per paragraph, in your voice
  letter: [
    "Meri jaan Divya,",
    "It all started in Pachmarhi, 2019. I still remember getting to know you there — the more we talked, the more my heart quietly decided it was going to be you. Aur dekho, it never changed its mind.",
    "I fell for the smallest things. Tumne ek pair pe khade hokar mere liye khana banaya — kaun karta hai ye? You do. I love eating from your hands, teasing you till you laugh, and yes, even your possessiveness — kyunki wo batati hai ki main sirf tumhara hoon.",
    "Udaipur, Jaipur — har jagah tumhare saath perfect lagi. Ab bas ek hi sapna hai: poori duniya ghoomni hai, tumhare saath, hamesha.",
    "Aaj duniya us din ko celebrate kar rahi hai jis din tum aayi. Main to har din karta hoon. Happy birthday, meri jaan. Here's to us — aur un saare saalon ko jo abhi aane baaki hain.",
  ],

  // Future wishes for her — from your three wishes
  wishes: [
    "Jo bhi tumhare mann mein hai — main chahta hoon tum wo sab haasil karo, meri jaan.",
    "A beautiful life together — tum, main, aur hamare bachche. Ek ghar full of laughter.",
    "Poori duniya ghoomein, saath mein — one city, one sunset, one memory at a time.",
  ],

  // Hero subline + finale closing line
  heroSub: "the best thing that ever happened to my ordinary days — since Pachmarhi, 2019",
  finaleLine: "Ab poori duniya ghoomni hai, tumhare saath. Happy birthday, meri jaan. ❤",
};

/* ===================================================================== */
/* Utilities                                                              */
/* ===================================================================== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);

/* ===================================================================== */
/* Scene manager                                                          */
/* ===================================================================== */
const SceneManager = (() => {
  let scenes = [];
  let order = []; // active scene indices (countdown may be skipped)
  let pos = 0;
  const progressEl = $("#progress");

  function init() {
    scenes = $$(".scene");
    // Decide whether countdown is shown
    const now = new Date();
    const bday = new Date(CONFIG.birthday);
    const beforeBday = !isNaN(bday) && now < bday;

    order = scenes
      .map((s) => Number(s.dataset.scene))
      .filter((n) => (n === 1 ? beforeBday : true));

    buildProgress();
    // wire "next" buttons
    $$("[data-next]").forEach((b) => b.addEventListener("click", next));
    return { beforeBday, bday };
  }

  function buildProgress() {
    progressEl.innerHTML = "";
    order.forEach((sceneNum, i) => {
      const dot = document.createElement("button");
      dot.className = "progress__dot";
      dot.setAttribute("aria-label", `Go to scene ${i + 1}`);
      dot.addEventListener("click", () => goToIndex(i));
      progressEl.appendChild(dot);
    });
  }

  function sceneEl(sceneNum) {
    return scenes.find((s) => Number(s.dataset.scene) === sceneNum);
  }

  function show(sceneNum) {
    scenes.forEach((s) => {
      const active = Number(s.dataset.scene) === sceneNum;
      if (active) {
        s.hidden = false;
        // force reflow so transition plays
        void s.offsetWidth;
        s.classList.add("is-active");
      } else if (s.classList.contains("is-active")) {
        s.classList.remove("is-active");
        setTimeout(() => {
          if (!s.classList.contains("is-active")) s.hidden = true;
        }, 950);
      } else {
        s.hidden = true;
      }
    });
    updateProgress();
    playRevealsIn(sceneEl(sceneNum));
    SceneHooks.enter(sceneNum);
  }

  function updateProgress() {
    $$(".progress__dot").forEach((d, i) => d.classList.toggle("is-current", i === pos));
  }

  function goToIndex(i) {
    pos = clamp(i, 0, order.length - 1);
    show(order[pos]);
  }

  function next() {
    if (pos < order.length - 1) {
      pos++;
      show(order[pos]);
    }
  }

  function startFromHero() {
    // jump to first non-gate scene (countdown if present else hero)
    const firstAfterGate = order.findIndex((n) => n !== 0);
    goToIndex(firstAfterGate === -1 ? 0 : firstAfterGate);
  }

  function begin() {
    // reveal chrome
    progressEl.hidden = false;
    startFromHero();
  }

  function replay() {
    const heroIdx = order.indexOf(2);
    goToIndex(heroIdx === -1 ? 0 : heroIdx);
  }

  function playRevealsIn(el) {
    if (!el) return;
    $$(".reveal-up", el).forEach((r, i) => {
      r.classList.remove("in");
      setTimeout(() => r.classList.add("in"), 120 + i * 140);
    });
  }

  function revealGate() { playRevealsIn(sceneEl(0)); }

  return { init, show, next, goToIndex, begin, replay, sceneEl, revealGate, get current() { return order[pos]; } };
})();

/* ===================================================================== */
/* Bokeh + audio + mute                                                   */
/* ===================================================================== */
function buildBokeh() {
  if (REDUCED) return;
  const host = $("#bokeh");
  const count = 14;
  for (let i = 0; i < count; i++) {
    const orb = document.createElement("span");
    orb.className = "orb";
    const size = rand(6, 26);
    orb.style.width = orb.style.height = `${size}px`;
    orb.style.left = `${rand(0, 100)}%`;
    orb.style.top = `${rand(0, 100)}%`;
    orb.style.setProperty("--dur", `${rand(10, 22)}s`);
    orb.style.setProperty("--o", rand(0.2, 0.6).toFixed(2));
    orb.style.animationDelay = `${rand(0, 8)}s`;
    host.appendChild(orb);
  }
}

const Audio2 = (() => {
  const el = $("#song");
  const toggle = $("#muteToggle");
  let available = false;
  let muted = false;

  function init() {
    if (!CONFIG.song) return;
    el.src = CONFIG.song;
    el.volume = 0;
    el.addEventListener("canplaythrough", () => {
      available = true;
      toggle.hidden = false;
    }, { once: true });
    el.addEventListener("error", () => {
      available = false;
      toggle.hidden = true;
    });
    toggle.addEventListener("click", () => (muted ? unmute() : mute()));
  }

  const TARGET_VOL = 0.55;

  function fadeTo(target, ms = 800) {
    const start = el.volume;
    const t0 = performance.now();
    // Guarantee the target volume even if rAF is throttled (e.g. background
    // tab) — a setTimeout backstop lands the final value no matter what.
    const backstop = setTimeout(() => { el.volume = target; }, ms + 60);
    function step(t) {
      const k = clamp((t - t0) / ms, 0, 1);
      el.volume = start + (target - start) * k;
      if (k < 1) requestAnimationFrame(step);
      else clearTimeout(backstop);
    }
    requestAnimationFrame(step);
  }

  function play() {
    if (!available) return;
    el.play().then(() => {
      if (muted) return; // respect an explicit mute
      // If the page is visible, do the pretty fade-up. If it's hidden (timers
      // suspended) just set the volume directly so sound is never stuck at 0.
      if (document.visibilityState === "visible" && !REDUCED) {
        el.volume = 0;
        fadeTo(TARGET_VOL);
      } else {
        el.volume = TARGET_VOL;
      }
    }).catch(() => {});
  }
  function mute() { muted = true; toggle.classList.add("is-muted"); fadeTo(0, 500); }
  function unmute() {
    muted = false; toggle.classList.remove("is-muted");
    if (el.paused) el.play().catch(() => {});
    fadeTo(TARGET_VOL, 500);
  }
  return { init, play };
})();

/* ===================================================================== */
/* Letter-by-letter reveal (hero)                                         */
/* ===================================================================== */
function revealText(el, text, perChar = 55, whole = false) {
  el.innerHTML = "";
  // whole=true reveals the text as ONE connected unit — required for
  // script/cursive fonts whose letters join and must not be split apart.
  if (whole) {
    const span = document.createElement("span");
    span.className = "char word-reveal";
    span.textContent = text;
    el.appendChild(span);
    if (REDUCED) { span.classList.add("in"); return; }
    // Use a keyframe animation (not a transition) so it fires reliably even
    // while the parent scene is still transitioning its own opacity.
    void el.offsetWidth;
    span.classList.add("in");
    return;
  }
  const spans = [...text].map((ch) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = ch;
    el.appendChild(span);
    return span;
  });
  if (REDUCED) {
    spans.forEach((s) => s.classList.add("in"));
    return;
  }
  // Force the initial (hidden) state to paint, then stagger each char in
  // with a real setTimeout so the transition always fires reliably.
  void el.offsetWidth;
  spans.forEach((s, i) => setTimeout(() => s.classList.add("in"), i * perChar));
}

/* ===================================================================== */
/* Confetti / particle engine (shared canvas)                             */
/* ===================================================================== */
const FX = (() => {
  const canvas = $("#fxCanvas");
  const ctx = canvas.getContext("2d");
  let parts = [];
  let raf = null;
  const COLORS = ["#e85d8a", "#e8c87e", "#8b5fbf", "#fff3d6"];

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  function confetti(count = 120, originY = -20) {
    if (REDUCED) return;
    const W = window.innerWidth;
    for (let i = 0; i < count; i++) {
      parts.push({
        x: rand(0, W), y: originY - rand(0, 200),
        vx: rand(-1.5, 1.5), vy: rand(2, 6),
        size: rand(5, 11), rot: rand(0, Math.PI * 2), vr: rand(-0.2, 0.2),
        color: COLORS[(Math.random() * COLORS.length) | 0],
        life: rand(120, 220),
      });
    }
    run();
  }

  function cannon(x, y) {
    if (REDUCED) return;
    for (let i = 0; i < 90; i++) {
      const a = rand(-Math.PI * 0.85, -Math.PI * 0.15);
      const sp = rand(6, 15);
      parts.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        size: rand(5, 10), rot: rand(0, 6), vr: rand(-0.3, 0.3),
        color: COLORS[(Math.random() * COLORS.length) | 0], life: rand(80, 160),
      });
    }
    run();
  }

  function rising(count = 60) {
    if (REDUCED) return;
    const W = window.innerWidth, H = window.innerHeight;
    for (let i = 0; i < count; i++) {
      parts.push({
        x: rand(0, W), y: H + rand(0, 60),
        vx: rand(-0.4, 0.4), vy: rand(-3, -7),
        size: rand(3, 7), rot: 0, vr: 0, glow: true,
        color: i % 2 ? "#e8c87e" : "#fff3d6", life: rand(90, 160),
      });
    }
    run();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts = parts.filter((p) => p.life > 0 && p.y < window.innerHeight + 40);
    parts.forEach((p) => {
      p.vy += p.glow ? 0.02 : 0.16; // gravity (glow = gentle)
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = clamp(p.life / 60, 0, 1);
      ctx.fillStyle = p.color;
      if (p.glow) {
        ctx.shadowBlur = 12; ctx.shadowColor = p.color;
        ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, 7); ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }
      ctx.restore();
    });
    if (parts.length) raf = requestAnimationFrame(tick);
    else { cancelAnimationFrame(raf); raf = null; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }
  function run() { if (!raf) raf = requestAnimationFrame(tick); }

  function clear() {
    parts = [];
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return { confetti, cannon, rising, resize, clear };
})();

/* ===================================================================== */
/* Fireworks (finale, its own canvas)                                     */
/* ===================================================================== */
const Fireworks = (() => {
  const canvas = $("#fireworks");
  const ctx = canvas.getContext("2d");
  let particles = [], rockets = [], raf = null, running = false, spawnT = 0;
  const COLORS = ["#e85d8a", "#e8c87e", "#8b5fbf", "#fff3d6", "#ff9ec2"];

  function resize() {
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function launch() {
    const W = canvas.clientWidth;
    rockets.push({
      x: rand(W * 0.15, W * 0.85), y: canvas.clientHeight,
      vy: rand(-9, -12), targetY: rand(canvas.clientHeight * 0.12, canvas.clientHeight * 0.5),
      color: COLORS[(Math.random() * COLORS.length) | 0],
      type: ["burst", "willow", "ring"][(Math.random() * 3) | 0],
    });
  }

  function explode(x, y, color, type) {
    const n = type === "ring" ? 40 : 70;
    for (let i = 0; i < n; i++) {
      let a, sp;
      if (type === "ring") { a = (i / n) * Math.PI * 2; sp = 5; }
      else { a = rand(0, Math.PI * 2); sp = type === "willow" ? rand(1, 5) : rand(2, 7); }
      particles.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        color, life: type === "willow" ? rand(70, 120) : rand(40, 80),
        willow: type === "willow",
      });
    }
  }

  function tick(t) {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(13,5,18,0.25)";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.globalCompositeOperation = "lighter";

    if (running && t - spawnT > 620) { launch(); spawnT = t; }

    rockets = rockets.filter((r) => {
      r.y += r.vy; r.vy += 0.12;
      ctx.fillStyle = r.color; ctx.shadowBlur = 8; ctx.shadowColor = r.color;
      ctx.beginPath(); ctx.arc(r.x, r.y, 2.2, 0, 7); ctx.fill();
      if (r.y <= r.targetY || r.vy >= 0) { explode(r.x, r.y, r.color, r.type); return false; }
      return true;
    });

    particles = particles.filter((p) => p.life > 0);
    particles.forEach((p) => {
      p.vy += p.willow ? 0.04 : 0.08; p.vx *= 0.99;
      p.x += p.vx; p.y += p.vy; p.life--;
      ctx.globalAlpha = clamp(p.life / 60, 0, 1);
      ctx.fillStyle = p.color; ctx.shadowBlur = 10; ctx.shadowColor = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.willow ? 1.6 : 2.2, 0, 7); ctx.fill();
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;

    if (running || particles.length || rockets.length) raf = requestAnimationFrame(tick);
    else { raf = null; ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight); }
  }

  function start() {
    resize();
    if (REDUCED) { // single gentle burst, no loop
      explode(canvas.clientWidth / 2, canvas.clientHeight / 3, COLORS[1], "ring");
      if (!raf) raf = requestAnimationFrame(tick);
      return;
    }
    running = true; spawnT = 0;
    // opening volley
    for (let i = 0; i < 3; i++) setTimeout(launch, i * 200);
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function stop() { running = false; }

  window.addEventListener("resize", () => { if (raf) resize(); });
  return { start, stop, burstAt: explode };
})();

/* ===================================================================== */
/* Photo helper — fallback gradient + heart                               */
/* ===================================================================== */
function makePhoto(photo, className) {
  const img = new Image();
  img.className = className;
  img.loading = "lazy";
  img.alt = photo.caption || "A memory";
  img.src = photo.src;
  img.addEventListener("error", () => {
    const ph = document.createElement("div");
    ph.className = className + " img-fallback";
    ph.style.background = `linear-gradient(135deg, var(--violet), var(--rose))`;
    ph.setAttribute("role", "img");
    ph.setAttribute("aria-label", photo.caption || "A memory");
    img.replaceWith(ph);
  });
  return img;
}

/* ===================================================================== */
/* Scene-specific builders + hooks                                        */
/* ===================================================================== */
const SceneHooks = (() => {
  const built = new Set();

  function enter(sceneNum) {
    switch (sceneNum) {
      case 2: hero(); break;
      case 3: cake(); break;
      case 4: story(); break;
      case 5: reasons(); break;
      case 6: letter(); break;
      case 7: lanterns(); break;
      case 8: finale(); break;
    }
  }

  /* --- Hero --- */
  function hero() {
    const title = $("#heroTitle"), name = $("#heroName"), sub = $("#heroSub");
    revealText(title, "Happy Birthday", 45);
    // Her name is in a connected script font — reveal it whole, not per-letter,
    // so the cursive letters stay joined and legible.
    setTimeout(() => revealText(name, CONFIG.herName, 90, true), 900);
    sub.textContent = CONFIG.heroSub || "";
    if (!built.has("balloons")) { buildBalloons(); built.add("balloons"); }
    setTimeout(() => FX.confetti(70), 1400);
  }

  function buildBalloons() {
    if (REDUCED) return;
    const host = $("#balloons");
    const palettes = [["#e85d8a", "#a83566"], ["#e8c87e", "#c99a3e"], ["#8b5fbf", "#5a3a86"], ["#ff9ec2", "#d9628f"]];
    for (let i = 0; i < 9; i++) {
      const b = document.createElement("span");
      b.className = "balloon";
      const p = palettes[i % palettes.length];
      b.style.setProperty("--c1", p[0]);
      b.style.setProperty("--c2", p[1]);
      b.style.setProperty("--w", `${rand(40, 74)}px`);
      b.style.left = `${rand(4, 92)}%`;
      b.style.setProperty("--rise", `${rand(13, 22)}s`);
      b.style.setProperty("--swayDur", `${rand(3, 6)}s`);
      b.style.animationDelay = `${rand(0, 10)}s, ${rand(0, 2)}s`;
      host.appendChild(b);
    }
  }

  /* --- Cake --- */
  function cake() {
    if (built.has("cake")) return;
    built.add("cake");
    const host = $("#candles");
    const n = clamp(CONFIG.photos.length ? 5 : 5, 3, 7); // aesthetic count of candles
    host.innerHTML = "";
    let lit = n;
    for (let i = 0; i < n; i++) {
      const c = document.createElement("div");
      c.className = "candle-sm";
      c.innerHTML = `<span class="candle-sm__body"></span><span class="candle-sm__flame" role="button" tabindex="0" aria-label="Blow out candle ${i + 1}"></span>`;
      const flame = $(".candle-sm__flame", c);
      const blow = () => {
        if (c.classList.contains("out")) return;
        c.classList.add("out");
        lit--;
        if (lit === 0) allBlown();
      };
      flame.addEventListener("click", blow);
      flame.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); blow(); } });
      host.appendChild(c);
    }

    // Optional mic detection
    $("#micBtn").addEventListener("click", startMic);
  }

  function allBlown() {
    const cakeEl = $("#cake");
    cakeEl.classList.add("dimmed");
    $("#cakeHint").textContent = "";
    setTimeout(() => {
      cakeEl.classList.remove("dimmed");
      FX.cannon(window.innerWidth / 2, window.innerHeight * 0.6);
      const hint = $("#cakeHint");
      hint.style.color = "var(--gold)";
      hint.textContent = `Make a wish, meri jaan ✨`;
      $("#cakeNext").hidden = false;
      $("#cakeNext").classList.add("in");
    }, 700);
  }

  function startMic() {
    const btn = $("#micBtn");
    if (!navigator.mediaDevices?.getUserMedia) { btn.textContent = "mic not available — tap the flames"; return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      btn.textContent = "🎤 listening… now blow!";
      const AC = window.AudioContext || window.webkitAudioContext;
      const ac = new AC();
      const src = ac.createMediaStreamSource(stream);
      const analyser = ac.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      let active = true;
      const check = () => {
        if (!active) return;
        analyser.getByteFrequencyData(data);
        let sum = 0; for (let i = 0; i < data.length; i++) sum += data[i];
        const avg = sum / data.length;
        if (avg > 55) { // volume spike ~= blowing
          const next = $$(".candle-sm:not(.out) .candle-sm__flame")[0];
          if (next) next.click();
        }
        if ($$(".candle-sm:not(.out)").length === 0) {
          active = false; stream.getTracks().forEach((t) => t.stop()); ac.close();
          return;
        }
        requestAnimationFrame(check);
      };
      check();
    }).catch(() => { btn.textContent = "no mic — just tap the flames 🙂"; });
  }

  /* --- Story timeline --- */
  function story() {
    if (built.has("story")) return;
    built.add("story");
    const host = $("#timeline");
    host.innerHTML = "";
    CONFIG.photos.forEach((photo, i) => {
      const item = document.createElement("div");
      item.className = `tl-item ${i % 2 ? "tl-item--right" : "tl-item--left"}`;
      const card = document.createElement("figure");
      card.className = "polaroid";
      card.style.setProperty("--rot", `${rand(-5, 5).toFixed(1)}deg`);
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `${photo.caption || "Memory"} — open`);

      const img = makePhoto(photo, "polaroid__img");
      const cap = document.createElement("figcaption");
      cap.className = "polaroid__cap";
      cap.innerHTML = `<span class="cap"></span><span class="yr"></span>`;
      $(".cap", cap).textContent = photo.caption || "";
      $(".yr", cap).textContent = photo.year || "";

      card.append(img, cap);
      const open = () => Lightbox.open(photo);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });

      item.appendChild(card);
      host.appendChild(item);
    });

    // reveal on scroll
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.2, root: SceneManager.sceneEl(4) });
    $$(".tl-item", host).forEach((el) => io.observe(el));
    // fallback: reveal first few immediately
    $$(".tl-item", host).slice(0, 2).forEach((el) => el.classList.add("in"));
  }

  /* --- Reasons deck --- */
  function reasons() {
    if (built.has("reasons")) return;
    built.add("reasons");
    const deck = $("#reasonDeck");
    const moreBtn = $("#reasonMore");
    deck.innerHTML = "";
    const list = [...CONFIG.reasons];
    let idx = -1;

    const cards = list.map((text, i) => {
      const card = document.createElement("article");
      card.className = "reason-card";
      card.style.zIndex = list.length - i;
      card.innerHTML = `<span class="reason-card__no">reason no. ${String(i + 1).padStart(2, "0")}</span>
                        <p class="reason-card__text"></p>`;
      $(".reason-card__text", card).textContent = text;
      deck.appendChild(card);
      return card;
    });
    // end card
    const end = document.createElement("article");
    end.className = "reason-card reason-card--end";
    end.innerHTML = `<p class="reason-card__text">…and about a thousand more I'm saving for when we're old.</p>`;
    deck.appendChild(end);
    cards.push(end);

    function reveal() {
      if (idx >= 0 && idx < cards.length) cards[idx].classList.add("gone");
      idx++;
      if (idx < cards.length) {
        cards[idx].classList.add("in");
        if (idx === cards.length - 1) {
          moreBtn.hidden = true;
          $("#reasonNext").hidden = false;
          $("#reasonNext").classList.add("in");
        }
      }
    }
    moreBtn.hidden = false;
    $("#reasonNext").hidden = true;
    moreBtn.textContent = "reveal first ❤";
    moreBtn.onclick = () => { reveal(); moreBtn.textContent = "one more ❤"; };
    reveal(); // show the first automatically
    moreBtn.textContent = "one more ❤";
  }

  /* --- Letter typewriter --- */
  let letterTimer = null, letterDone = false;
  function letter() {
    if (built.has("letter")) return;
    built.add("letter");
    const body = $("#letterBody");
    $("#letterSign").textContent = CONFIG.myName;
    body.innerHTML = "";
    letterDone = false;

    const paras = CONFIG.letter;
    let pi = 0, ci = 0;
    let pEl = null;
    const caret = document.createElement("span");
    caret.className = "letter__caret";

    function finish() {
      letterDone = true;
      clearTimeout(letterTimer);
      body.innerHTML = paras.map((p) => `<p>${escapeHTML(p)}</p>`).join("");
      $("#letterNext").hidden = false;
      $("#letterNext").classList.add("in");
      $("#letterSkip").hidden = true;
    }

    function type() {
      if (pi >= paras.length) { finish(); return; }
      if (ci === 0) {
        pEl = document.createElement("p");
        body.appendChild(pEl);
        pEl.appendChild(caret);
      }
      const text = paras[pi];
      if (ci < text.length) {
        caret.insertAdjacentText("beforebegin", text[ci]);
        ci++;
        letterTimer = setTimeout(type, REDUCED ? 0 : rand(18, 42));
      } else {
        pi++; ci = 0;
        letterTimer = setTimeout(type, REDUCED ? 0 : 380);
      }
    }

    $("#letterSkip").hidden = false;
    $("#letterSkip").onclick = finish;
    $("#letterNext").hidden = true;
    if (REDUCED) { finish(); } else { type(); }
  }

  /* --- Lanterns --- */
  function lanterns() {
    FX.clear(); // quiet the sky — clear any lingering confetti for this gentle scene
    if (built.has("lanterns")) return;
    built.add("lanterns");
    buildStars();
    const layer = $("#lanternLayer");
    const scene = SceneManager.sceneEl(7);
    const wishes = [...CONFIG.wishes];
    let released = 0;

    function release() {
      if (released >= wishes.length) return;
      const wish = wishes[released];
      const l = document.createElement("div");
      l.className = "lantern";
      l.style.setProperty("--x", `${rand(20, 80)}%`);
      l.style.setProperty("--rise", `${rand(22, 30)}s`);
      l.innerHTML = `<div class="lantern__body"></div><div class="lantern__text"></div>`;
      $(".lantern__text", l).textContent = wish;
      layer.appendChild(l);
      released++;
      if (released >= wishes.length) {
        $("#lanternHint").textContent = "…carried up to the stars.";
        $("#lanternNext").hidden = false;
        $("#lanternNext").classList.add("in");
      } else {
        $("#lanternHint").textContent = `tap the sky to release the next (${released}/${wishes.length})`;
      }
    }

    const tapHandler = (e) => {
      if (e.target.closest(".btn")) return;
      release();
    };
    scene.addEventListener("click", tapHandler);
    release(); // first one free
  }

  function buildStars() {
    const host = $("#stars");
    host.innerHTML = "";
    for (let i = 0; i < 60; i++) {
      const s = document.createElement("span");
      s.className = "star";
      s.style.left = `${rand(0, 100)}%`;
      s.style.top = `${rand(0, 70)}%`;
      s.style.setProperty("--tw", `${rand(2, 5)}s`);
      s.style.setProperty("--so", rand(0.3, 0.9).toFixed(2));
      s.style.animationDelay = `${rand(0, 4)}s`;
      host.appendChild(s);
    }
  }

  /* --- Finale --- */
  function finale() {
    $("#finaleTitle").textContent = `Happy Birthday ${CONFIG.herName}`;
    $("#finaleLine").textContent = CONFIG.finaleLine || "";
    Fireworks.start();
    FX.confetti(140);
    if (!built.has("finaleBtns")) {
      built.add("finaleBtns");
      $("#hugBtn").addEventListener("click", () => {
        FX.cannon(window.innerWidth / 2, window.innerHeight * 0.7);
        $("#hugBtn").textContent = "🤗 consider it collected ❤";
      });
      $("#replayBtn").addEventListener("click", () => { Fireworks.stop(); SceneManager.replay(); });
    }
  }

  return { enter };
})();

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ===================================================================== */
/* Lightbox                                                               */
/* ===================================================================== */
const Lightbox = (() => {
  let box = null, prevFocus = null;
  function ensure() {
    if (box) return;
    box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML = `<button class="lightbox__close" aria-label="Close">✕</button>
      <div class="lightbox__stage"></div>`;
    document.body.appendChild(box);
    box.addEventListener("click", (e) => { if (e.target === box || e.target.closest(".lightbox__close")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }
  function open(photo) {
    ensure();
    prevFocus = document.activeElement;
    const stage = $(".lightbox__stage", box);
    stage.innerHTML = "";
    const img = makePhoto(photo, "lightbox__img");
    const cap = document.createElement("div");
    cap.className = "lightbox__cap";
    cap.textContent = photo.caption || "";
    stage.append(img, cap);
    box.classList.add("open");
    $(".lightbox__close", box).focus();
  }
  function close() {
    if (box) box.classList.remove("open");
    if (prevFocus) prevFocus.focus();
  }
  return { open, close };
})();

/* ===================================================================== */
/* Countdown                                                              */
/* ===================================================================== */
function startCountdown(bday) {
  const dEl = $("#cd-days"), hEl = $("#cd-hours"), mEl = $("#cd-mins"), sEl = $("#cd-secs");
  const pad = (n) => String(n).padStart(2, "0");
  function loop() {
    const diff = bday - new Date();
    if (diff <= 0) {
      dEl.textContent = hEl.textContent = mEl.textContent = sEl.textContent = "00";
      FX.confetti(160);
      Fireworks.start();
      setTimeout(() => { Fireworks.stop(); SceneManager.next(); }, 3200);
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    dEl.textContent = pad(d); hEl.textContent = pad(h); mEl.textContent = pad(m); sEl.textContent = pad(s);
    requestAnimationFrame(() => setTimeout(loop, 250));
  }
  loop();
}

/* ===================================================================== */
/* Boot                                                                   */
/* ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // Fill static config-driven text
  $("#gateName").textContent = CONFIG.herName;
  document.title = `For ${CONFIG.herName} ✨`;

  buildBokeh();
  Audio2.init();

  const { beforeBday, bday } = SceneManager.init();

  // Play the gate scene's entrance reveals (it's active from the start,
  // so show() was never called for it).
  SceneManager.revealGate();

  // Begin gate
  $("#beginBtn").addEventListener("click", () => {
    Audio2.play();       // user gesture unlocks audio
    FX.rising(70);       // burst of rising golden particles
    SceneManager.begin();
    if (beforeBday) startCountdown(bday);
  });

  // keyboard: right arrow / space advances (except in inputs)
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") SceneManager.next();
  });
});
