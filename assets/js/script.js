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

        const cellSize = 100;

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