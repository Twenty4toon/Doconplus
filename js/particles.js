/* ===== PARTICLE CANVAS ANIMATION (multi-canvas support) ===== */
(function () {
  // Works for any <canvas class="particle-canvas"> (home hero + every page hero)
  const canvases = document.querySelectorAll('#particleCanvas, canvas.particle-canvas');
  if (!canvases.length) return;

  const allCanvases = [];

  canvases.forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    const state = {
      canvas,
      ctx,
      particles: [],
      mouse: { x: null, y: null },
      animationId: null,
    };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || window.innerWidth;
      const h = rect.height || window.innerHeight;
      // Handle device pixel ratio for crisp rendering
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      state.mouse.x = e.clientX - rect.left;
      state.mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
      state.mouse.x = null;
      state.mouse.y = null;
    });

    class Particle {
      constructor() {
        const rect = canvas.getBoundingClientRect();
        const w = rect.width || window.innerWidth;
        const h = rect.height || window.innerHeight;
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.5 ? '0, 200, 255' : '0, 105, 255';
      }

      update() {
        const rect = canvas.getBoundingClientRect();
        const w = rect.width || window.innerWidth;
        const h = rect.height || window.innerHeight;
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > w) this.x = 0;
        if (this.x < 0) this.x = w;
        if (this.y > h) this.y = 0;
        if (this.y < 0) this.y = h;

        if (state.mouse.x !== null) {
          const dx = state.mouse.x - this.x;
          const dy = state.mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            this.x -= dx * 0.01;
            this.y -= dy * 0.01;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
      }
    }

    function init() {
      state.particles = [];
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || window.innerWidth;
      const h = rect.height || window.innerHeight;
      const area = w * h;
      const count = Math.max(30, Math.min(90, Math.floor(area / 14000)));
      for (let i = 0; i < count; i++) {
        state.particles.push(new Particle());
      }
    }

    function connectParticles() {
      for (let a = 0; a < state.particles.length; a++) {
        for (let b = a + 1; b < state.particles.length; b++) {
          const dx = state.particles[a].x - state.particles[b].x;
          const dy = state.particles[a].y - state.particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 200, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(state.particles[a].x, state.particles[a].y);
            ctx.lineTo(state.particles[b].x, state.particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      state.particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      state.animationId = requestAnimationFrame(animate);
    }

    function start() {
      init();
      animate();
    }

    resize();
    start();

    state.resize = resize;
    state.start = start;
    allCanvases.push(state);
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      allCanvases.forEach((s) => {
        cancelAnimationFrame(s.animationId);
        s.resize();
        s.start();
      });
    }, 200);
  });
})();
