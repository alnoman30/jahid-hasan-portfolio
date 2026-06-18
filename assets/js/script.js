gsap.registerPlugin(ScrollTrigger);

const exists = (selector) => document.querySelector(selector);


// ──======================================= Smooth scroll (Lenis)======================================== ──
if (typeof Lenis !== 'undefined') {
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.3,
    infinite: false,
  });

  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
  }

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}


// mobile menu js
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const spans = document.querySelectorAll(".hamburger span");

if (hamburger && mobileMenu && spans.length >= 3) {

  let isOpen = false;

  hamburger.addEventListener("click", () => {
    isOpen = !isOpen;

    if (isOpen) {
      // Open menu
      gsap.to(mobileMenu, {
        right: 0,
        duration: 0.5,
        ease: "power3.out"
      });

      // Animate hamburger to X
      gsap.to(spans[0], {
        rotate: 45,
        y: 8,
        duration: 0.3
      });

      gsap.to(spans[1], {
        opacity: 0,
        duration: 0.2
      });

      gsap.to(spans[2], {
        rotate: -45,
        y: -8,
        duration: 0.3
      });

    } else {
      // Close menu
      gsap.to(mobileMenu, {
        right: "-100%",
        duration: 0.5,
        ease: "power3.in"
      });

      // Reset hamburger
      gsap.to(spans[0], {
        rotate: 0,
        y: 0,
        duration: 0.3
      });

      gsap.to(spans[1], {
        opacity: 1,
        duration: 0.2
      });

      gsap.to(spans[2], {
        rotate: 0,
        y: 0,
        duration: 0.3
      });
    }
  });

}

// Header scroll animation
const header = document.querySelector(".header-section");
const marquee = document.querySelector(".marquee");

if (header && marquee) {

  ScrollTrigger.create({
    trigger: marquee,
    start: "bottom top",

    onEnter: () => {
      header.classList.add("is-sticky");

      gsap.fromTo(
        header,
        {
          y: -100,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        }
      );
    },

    onLeaveBack: () => {
      header.classList.remove("is-sticky");

      gsap.to(header, {
        y: 0,
        opacity: 1,
        duration: 0.2
      });
    }
  });

}


//   Hero content staged animation
document.addEventListener("DOMContentLoaded", () => {

  if (
    typeof gsap === "undefined" ||
    typeof SplitText === "undefined"
  ) return;

  const title = document.querySelector(".hero-title");

  // stop if hero not present
  if (!title) return;

  gsap.registerPlugin(SplitText);

  // =========================
  // HERO TITLE SPLIT REVEAL
  // =========================
  const split = new SplitText(title, {
    type: "words, lines",
    linesClass: "line"
  });

  if (split.lines?.length) {
    gsap.set(split.lines, {
      overflow: "hidden",
      display: "block"
    });
  }

  if (split.words?.length) {
    gsap.set(split.words, {
      display: "inline-block"
    });
  }

  // =========================
  // HERO STATS + DIVIDERS
  // =========================
  const stats = document.querySelectorAll(
    ".hero-bottom-stats .stat-item"
  );

  const dividers = document.querySelectorAll(
    ".hero-bottom-stats .bg-white\\/24"
  );

  if (stats.length) {
    gsap.set(stats, {
      opacity: 0,
      y: 40
    });
  }

  if (dividers.length) {
    gsap.set(dividers, {
      scaleY: 0,
      transformOrigin: "top center",
      opacity: 0.3
    });
  }

  // =========================
  // MASTER TIMELINE
  // =========================
  const tl = gsap.timeline({
    delay: 0.2
  });

  // Title animation
  if (split.words?.length) {
    tl.from(split.words, {
      yPercent: 120,
      rotateX: -40,
      opacity: 0,
      transformOrigin: "0% 50% -50",
      duration: 1,
      ease: "power4.out",
      stagger: 0.03
    });
  }

  // Stats animation
  if (stats.length) {
    tl.to(stats, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power4.out",
      stagger: 0.15
    }, "-=0.4");
  }

  // Divider animation
  if (dividers.length) {
    tl.to(dividers, {
      scaleY: 1,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1
    }, "-=0.5");
  }

});


// Background blink animation
class BlinkingGrid {
  constructor(element, {
    activeColor = "#F4F4F4",
    inactiveColor = "rgba(255,255,255,0.02)",
    borderColor = "rgba(255,255,255,0.03)",

    mobileBreakpoint = 768,
    mobileCellSize = 140,
    desktopCellSize = 120,

    maxMobileRows = 20
  } = {}) {

    this.grid = element;

    this.ACTIVE_COLOR = activeColor;
    this.INACTIVE_COLOR = inactiveColor;
    this.BORDER_COLOR = borderColor;

    this.mobileBreakpoint = mobileBreakpoint;
    this.mobileCellSize = mobileCellSize;
    this.desktopCellSize = desktopCellSize;
    this.maxMobileRows = maxMobileRows;

    this.blinkInterval = null;
    this.resizeTimeout = null;

    this.init();
  }

  init() {
    if (!this.grid) return;

    this.createGrid();

    window.addEventListener("resize", () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.createGrid(), 250);
    });
  }

  createGrid() {
    if (this.blinkInterval) clearInterval(this.blinkInterval);

    this.grid.innerHTML = "";

    const isMobile = window.innerWidth < this.mobileBreakpoint;

    const cellSize = isMobile
      ? this.mobileCellSize
      : this.desktopCellSize;

    // ✅ WIDTH based columns (stable everywhere)
    const cols = Math.ceil(window.innerWidth / cellSize);

    // ✅ HEIGHT based on ACTUAL SECTION, not viewport
    const gridHeight = this.grid.offsetHeight || this.grid.parentElement?.offsetHeight || window.innerHeight;

    let rows = Math.ceil(gridHeight / cellSize);

    // optional mobile cap (prevents extreme density)
    if (isMobile) {
      rows = Math.min(rows, this.maxMobileRows);
    }

    this.grid.style.display = "grid";
    this.grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    this.grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const totalCells = cols * rows;

    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement("div");

      cell.className = "section-grid-cell";

      // base styling (border controlled per instance)
      cell.style.backgroundColor = this.INACTIVE_COLOR;
      cell.style.border = `1px solid ${this.BORDER_COLOR}`;

      this.grid.appendChild(cell);
    }

    this.startBlinking();
  }

  startBlinking() {
    const cells = this.grid.children;

    const blinkCell = () => {
      const cell = cells[Math.floor(Math.random() * cells.length)];
      if (!cell) return;

      gsap.fromTo(
        cell,
        {
          backgroundColor: this.INACTIVE_COLOR,
          boxShadow: "0 0 0px rgba(0,0,0,0)"
        },
        {
          backgroundColor: this.ACTIVE_COLOR,
          boxShadow: `0 0 12px ${this.ACTIVE_COLOR}33`,
          duration: gsap.utils.random(2.5, 4.5),
          ease: "sine.inOut",
          yoyo: true,
          repeat: 1,
          overwrite: "auto"
        }
      );
    };

    // initial wave
    for (let i = 0; i < 20; i++) {
      gsap.delayedCall(Math.random() * 4, blinkCell);
    }

    // continuous flow
    this.blinkInterval = setInterval(() => {
      const count = gsap.utils.random(1, 3, 1);

      for (let i = 0; i < count; i++) {
        gsap.delayedCall(Math.random() * 2.5, blinkCell);
      }
    }, 1000);
  }

  destroy() {
    if (this.blinkInterval) clearInterval(this.blinkInterval);
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    this.grid.innerHTML = "";
  }
}

/* INIT MULTIPLE GRIDS WITH DATA ATTRIBUTES */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".section-grid-bg").forEach((grid) => {

    new BlinkingGrid(grid, {
      activeColor: grid.dataset.active || "#F4F4F4",
      borderColor: grid.dataset.border || "rgba(255,255,255,0.03)"
    });

  });
});

// Common CTA btn Animation
class CTAButtonHover {
    constructor(button) {
        this.button = button;
        this.flair = button.querySelector(".cta-btn-flair");

        if (!this.flair) return;

        this.xSet = gsap.quickSetter(this.flair, "xPercent");
        this.ySet = gsap.quickSetter(this.flair, "yPercent");

        this.initEvents();
    }

    getXY(e) {
        const rect = this.button.getBoundingClientRect();

        const x = gsap.utils.clamp(
            0,
            100,
            gsap.utils.mapRange(
                0,
                rect.width,
                0,
                100,
                e.clientX - rect.left
            )
        );

        const y = gsap.utils.clamp(
            0,
            100,
            gsap.utils.mapRange(
                0,
                rect.height,
                0,
                100,
                e.clientY - rect.top
            )
        );

        return { x, y };
    }

    initEvents() {
        this.button.addEventListener("mouseenter", (e) => {
            const { x, y } = this.getXY(e);

            this.xSet(x);
            this.ySet(y);

            gsap.to(this.flair, {
                scale: 1,
                duration: 0.45,
                ease: "power3.out"
            });
        });

        this.button.addEventListener("mousemove", (e) => {
            const { x, y } = this.getXY(e);

            gsap.to(this.flair, {
                xPercent: x,
                yPercent: y,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        this.button.addEventListener("mouseleave", (e) => {
            const { x, y } = this.getXY(e);

            gsap.killTweensOf(this.flair);

            gsap.to(this.flair, {
                xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
                yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
                scale: 0,
                duration: 0.35,
                ease: "power3.out"
            });
        });
    }
}

document.querySelectorAll(".cta-btn-hover").forEach((button) => {
    new CTAButtonHover(button);
});



// PROFILE CARD ANIMATION 
const profileCard = document.querySelector(".profile-card");
const heroContents = document.querySelector(".hero-contents");

if (profileCard && heroContents) {

    gsap.fromTo(
        ".profile-card",
        {
            x: 120,
            opacity: 0
        },
        {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".hero-contents",
                start: "top 80%",
                end: "bottom 50%",

                // play on enter, reverse on leave
                toggleActions: "play reverse play reverse",

                // makes it responsive on resize
                invalidateOnRefresh: true
            }
        }
    );

}


// Testimonial animation splidejs
document.addEventListener('DOMContentLoaded', function () {

  const slider = document.getElementById('testimonial-splide');

  if (typeof Splide === 'undefined' || !slider) return;

  const splide = new Splide('#testimonial-splide', {
    type: 'loop',
    perPage: 1,
    arrows: false,
    pagination: false,
    speed: 400,
    drag: true,
  }).mount();

  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => splide.go('<'));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => splide.go('>'));
  }

});


// FAQ animation
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".faq-item");

  items.forEach(item => {
    const content = item.querySelector(".faq-content");

    gsap.set(content, {
      height: 0,
      overflow: "hidden"
    });

    item.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-active");

      document.querySelectorAll(".faq-item").forEach(el => {
        el.classList.remove("is-active");

        gsap.to(el.querySelector(".faq-content"), {
          height: 0,
          duration: 0.4,
          ease: "power2.inOut"
        });
      });

      if (!isOpen) {
        item.classList.add("is-active");

        gsap.to(content, {
          height: "auto",
          duration: 0.5,
          ease: "power2.inOut"
        });
      }
    });
  });
});


// Filter case study animations
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".filter-btn");
  const cases = document.querySelectorAll(".case-item");

  let activeFilter = "all";
  let isAnimating = false;

  function setActive(btn) {
    buttons.forEach((b) => {
      b.classList.remove("bg-tomato", "text-white", "border-tomato");
      b.classList.add("bg-white", "text-black", "border-[#E5E8ED]");
    });

    btn.classList.add("bg-tomato", "text-white", "border-tomato");
    btn.classList.remove("bg-white", "text-black", "border-[#E5E8ED]");
  }

  const defaultBtn = document.querySelector('[data-filter="all"]');
  if (defaultBtn) setActive(defaultBtn);

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      if (filter === activeFilter || isAnimating) return;

      activeFilter = filter;
      isAnimating = true;
      setActive(btn);

      cases.forEach((item) => {
        const category = item.dataset.category;
        const show = filter === "all" || category === filter;

        if (show) {
          item.style.display = "flex";

          gsap.fromTo(
            item,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.25,
              ease: "power2.out"
            }
          );
        } else {
          gsap.to(item, {
            opacity: 0,
            y: 10,
            duration: 0.2,
            ease: "power1.out",
            onComplete: () => {
              item.style.display = "none";
            }
          });
        }
      });

      setTimeout(() => {
        isAnimating = false;
      }, 250);
    });
  });
});



// Stats grid counter animation

document.addEventListener('DOMContentLoaded', () => {

    const counters = document.querySelectorAll('.counter');

    function formatNum(n, format) {
        return format === 'comma'
            ? n.toLocaleString()
            : n;
    }

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const el = entry.target;

            if (el.dataset.animated === 'true') return;

            el.dataset.animated = 'true';

            const target = parseInt(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            const prefix = el.dataset.prefix || '';
            const format = el.dataset.format || '';

            const duration = 1800;
            const steps = 60;
            const increment = target / steps;
            const interval = duration / steps;

            let current = 0;

            const timer = setInterval(() => {

                current += increment;

                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }

                el.textContent =
                    prefix +
                    formatNum(Math.round(current), format) +
                    suffix;

            }, interval);

            observer.unobserve(el);

        });

    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });

});

// 
document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap) return;

  const grid = document.getElementById('works-grid');
  if (!grid) return;

  gsap.registerPlugin(ScrollTrigger);

  /* =========================
     SCROLL ANIMATIONS
  ========================= */

  gsap.from('.reveal-head', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#works',
      start: 'top 80%'
    }
  });

  gsap.from('.work-card', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#works-grid',
      start: 'top 85%'
    }
  });

  /* =========================
     CURSOR VIEW WORK EFFECT
  ========================= */

  const medias = grid.querySelectorAll('.work-media');

  medias.forEach((media) => {
    const btn = media.querySelector('.view-work');
    if (!btn) return;

    // initial state
    gsap.set(btn, {
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      opacity: 0
    });

    const xTo = gsap.quickTo(btn, 'x', {
      duration: 0.5,
      ease: 'power3.out'
    });

    const yTo = gsap.quickTo(btn, 'y', {
      duration: 0.5,
      ease: 'power3.out'
    });

    const getPos = (e) => {
      const rect = media.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const showBtn = () => {
      gsap.to(btn, {
        scale: 1,
        opacity: 1,
        duration: 0.45,
        ease: 'back.out(1.8)'
      });
    };

    const hideBtn = () => {
      gsap.to(btn, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      });
    };

    media.addEventListener('mouseenter', (e) => {
      const pos = getPos(e);

      gsap.set(btn, {
        x: pos.x,
        y: pos.y
      });

      showBtn();
    });

    media.addEventListener('mousemove', (e) => {
      const pos = getPos(e);
      xTo(pos.x);
      yTo(pos.y);
    });

    media.addEventListener('mouseleave', () => {
      hideBtn();
    });
  });

  /* Hide all when leaving grid */
  grid.addEventListener('mouseleave', () => {
    grid.querySelectorAll('.view-work').forEach((btn) => {
      gsap.to(btn, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      });
    });
  });
});