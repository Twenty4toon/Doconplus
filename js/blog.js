/* ===== BLOG INTERACTIVE MOTION ===== */

/* Banner parallax on scroll */
const banner = document.querySelector('.blog-hero-banner');
if (banner && window.innerWidth > 768) {
  window.addEventListener('scroll', () => {
    const rect = banner.getBoundingClientRect();
    const scrolled = window.innerHeight - rect.top;
    if (scrolled > 0 && rect.top < window.innerHeight) {
      const amount = Math.min(scrolled * 0.04, 30);
      banner.style.transform = `translateY(${amount}px) scale(1.02)`;
    } else {
      banner.style.transform = '';
    }
  });
}

/* Mouse glow on blog banner */
const visual = document.querySelector('.blog-hero-visual');
if (visual) {
  const glow = document.createElement('div');
  glow.className = 'mouse-glow';
  visual.appendChild(glow);
  visual.addEventListener('mousemove', (e) => {
    const rect = visual.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + 'px';
    glow.style.top = (e.clientY - rect.top) + 'px';
    glow.classList.add('active');
  });
  visual.addEventListener('mouseleave', () => { glow.classList.remove('active'); });
}

/* Mouse glow on blog listing thumbnails */
document.querySelectorAll('.blog-card-img').forEach((cardImg) => {
  const g = document.createElement('div');
  g.className = 'mouse-glow';
  g.style.position = 'absolute';
  cardImg.appendChild(g);
  cardImg.addEventListener('mousemove', (e) => {
    const rect = cardImg.getBoundingClientRect();
    g.style.left = (e.clientX - rect.left) + 'px';
    g.style.top = (e.clientY - rect.top) + 'px';
    g.classList.add('active');
  });
  cardImg.addEventListener('mouseleave', () => { g.classList.remove('active'); });
});

/* Tilt effect on banner */
const wrap = document.querySelector('.blog-hero-banner-wrap');
if (wrap && window.innerWidth > 768) {
  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const img = wrap.querySelector('img');
    if (img) {
      img.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.03)`;
      img.style.boxShadow = `${(x * -20)}px ${(y * -20)}px 60px rgba(0,200,255,0.15), 0 20px 60px rgba(0,0,0,0.5)`;
    }
  });
  wrap.addEventListener('mouseleave', () => {
    const img = wrap.querySelector('img');
    if (img) { img.style.transform = ''; img.style.boxShadow = ''; }
  });
}

/* Smooth reveal for blog content sections */
const revealItems = document.querySelectorAll('.blog-reveal');
if (revealItems.length) {
  const revealBlogObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealBlogObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealItems.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.06}s`;
    revealBlogObserver.observe(el);
  });
}

document.querySelectorAll('.blog-counter').forEach(el => {
  const target = +el.dataset.target;
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 16);
});
