gsap.registerPlugin(ScrollTrigger);


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


// 
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const spans = document.querySelectorAll(".hamburger span");

let isOpen = false;

hamburger.addEventListener("click", () => {
  isOpen = !isOpen;

  if (isOpen) {
    // Open menu
    gsap.to(mobileMenu, { right: 0, duration: 0.5, ease: "power3.out" });

    // Animate hamburger to X
    gsap.to(spans[0], { rotate: 45, y: 8, duration: 0.3 });
    gsap.to(spans[1], { opacity: 0, duration: 0.2 });
    gsap.to(spans[2], { rotate: -45, y: -8, duration: 0.3 });

  } else {
    // Close menu
    gsap.to(mobileMenu, { right: "-100%", duration: 0.5, ease: "power3.in" });

    // Reset hamburger
    gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3 });
    gsap.to(spans[1], { opacity: 1, duration: 0.2 });
    gsap.to(spans[2], { rotate: 0, y: 0, duration: 0.3 });
  }
});

// 
document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("section-grid-bg");

    let blinkInterval;
    let resizeTimeout;

    const ACTIVE_COLOR = "#37325B";
    const INACTIVE_COLOR = "rgba(0,0,0,0)";

    function createGrid() {
        if (blinkInterval) clearInterval(blinkInterval);

        grid.innerHTML = "";

        // Responsive cell size
        const cellSize = window.innerWidth < 768 ? 80 : 120;

        const cols = Math.ceil(window.innerWidth / cellSize);
        const rows = Math.ceil(window.innerHeight / cellSize);

        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

        const totalCells = cols * rows;

        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement("div");
            cell.className = "section-grid-cell";
            cell.style.backgroundColor = INACTIVE_COLOR;
            grid.appendChild(cell);
        }

        startBlinking();
    }

    function startBlinking() {
        const cells = grid.children;

        function blinkCell() {
            const cell = cells[Math.floor(Math.random() * cells.length)];
            if (!cell) return;

            gsap.fromTo(
                cell,
                {
                    backgroundColor: INACTIVE_COLOR
                },
                {
                    backgroundColor: ACTIVE_COLOR,
                    duration: gsap.utils.random(2.5, 4.5), // slower fade
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: 1,
                    overwrite: "auto"
                }
            );
        }

        // softer initial wave
        for (let i = 0; i < 20; i++) {
            gsap.delayedCall(Math.random() * 4, blinkCell);
        }

        // slower continuous flow
        blinkInterval = setInterval(() => {
            const count = gsap.utils.random(1, 3, 1); // fewer active cells

            for (let i = 0; i < count; i++) {
                gsap.delayedCall(Math.random() * 2.5, blinkCell);
            }
        }, 1000); // slower cycle
    }

    createGrid();

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createGrid, 250);
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
gsap.fromTo(".profile-card",
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

            // optional: makes it more responsive on resize
            invalidateOnRefresh: true
        }
    }
);