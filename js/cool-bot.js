/* =========================================================
   Docon+ — Floating Rive "Cool" Bot
   - Smoothly floats across the page (stays ABOVE content)
   - Head, eyes & whole body lean toward the cursor/pointer
   - Tap/click the bot -> waves (Chat state) + a minimal "Hi!" bubble
   - Both desktop and mobile: the bot follows the pointer.
   ========================================================= */

(function () {
  const wrap = document.getElementById('coolBotWrap');
  const canvas = document.getElementById('coolBotCanvas');
  if (!wrap || !canvas || typeof rive === 'undefined') return;

  // ---- Tuning ----
  const FLOAT_AMPLITUDE = 14;     // px idle bobbing
  const FOLLOW_EASE = 0.022;      // slightly slow, smooth follow toward cursor (0-1)
  const LOOK_EASE = 0.09;         // how fast eyes/head turn toward the cursor
  const MARGIN = 24;              // keep this far from edges
  const REACH = 0.45;             // fraction of viewport the look spans
  const FLOAT_TRAIL = 0.014;      // lag so it drifts/floats behind the pointer
  const MAX_TILT = 12;            // max degrees the bot leans while moving
  const EYE_PARALLAX = 10;        // px the artboard shifts to fake eye-follow
  const MOBILE_BREAK = 768;       // px width below which we use a tighter offset
  const DESKTOP_TRAIL = 0.006;
  const DESKTOP_EASE = 0.009;

  // ---- State ----
  let winW = window.innerWidth;
  let winH = window.innerHeight;
  const isMobile = winW <= MOBILE_BREAK;

  const target = { x: winW * 0.16, y: winH * 0.55 };   // point the bot aims for
  const float = { x: target.x, y: target.y };          // slow floating trail
  const pos = { x: target.x, y: target.y };            // current bot center
  const look = { x: 0, y: 0 };                         // -1..1 normalized look direction
  const lookTarget = { x: 0, y: 0 };
  let tilt = 0;                 // current lean in degrees
  let tiltTarget = 0;
  let eyeX = 0, eyeY = 0;       // eased parallax for eye-follow illusion

  if (isMobile) {
    target.x = winW * 0.5;
    target.y = 40;
    float.x = target.x; float.y = target.y;
    pos.x = target.x; pos.y = target.y;
  }

  let lastMouse = performance.now();
  let bobT = 0;
  let patrolT = Math.random() * Math.PI * 2;   // offset so bots don't sync

  // ---- Mobile-only state ----
  let isDragging = false;
  let dragOffX = 0, dragOffY = 0;
  let dragMoved = false;
  let dragCooldown = 0;
  const DRAG_COOLDOWN_MS = 3000;
  let autoGazeT = 0;
  let autoGazeX = 0, autoGazeY = 0;
  let nextGazeChange = 3 + Math.random() * 3;

  // Rive inputs
  let rInstance = null;
  let chatInput = null;    // Boolean -> greeting/wave state
  let resetInput = null;   // Trigger  -> return to idle

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  // Inspect the loaded artboard's state machine for usable inputs.
  function bindInputs() {
    try {
      const sm = rInstance.stateMachineNames && rInstance.stateMachineNames[0];
      if (!sm) return;
      const inputs = rInstance.stateMachineInputs(sm);
      if (!inputs) return;
      for (const inp of inputs) {
        const name = (inp.name || '').toLowerCase();
        if (inp.type === rive.StateMachineInputType.Boolean && name === 'chat') chatInput = inp;
        else if (inp.type === rive.StateMachineInputType.Trigger && name === 'reset') resetInput = inp;
      }
    } catch (e) { /* non-fatal */ }
  }

  // Load the Rive file (embedded base64 so it works on file:// and http://).
  const RIV_SRC = window.__COOL_BOT_RIV__ || 'riv_file/cool.riv';

  function startRive(stateMachineName) {
    const opts = {
      src: RIV_SRC,
      canvas: canvas,
      autoplay: true,
      fit: rive.Fit.contain,
      alignment: rive.Alignment.Center,
      onLoad: () => {
        try { rInstance.resizeDrawingSurfaceToCanvas(); } catch (e) {}
        setTimeout(() => { try { rInstance.resizeDrawingSurfaceToCanvas(); } catch (e) {} }, 60);
        setTimeout(() => { try { rInstance.resizeDrawingSurfaceToCanvas(); } catch (e) {} }, 400);
        let smName = stateMachineName;
        if (!smName && rInstance.stateMachineNames && rInstance.stateMachineNames.length) {
          smName = rInstance.stateMachineNames[0];
        }
        if (smName) { try { rInstance.play(smName); } catch (e) {} }
        bindInputs();
        requestAnimationFrame(tick);
      },
      onLoadError: () => { if (stateMachineName) startRive(null); }
    };
    rInstance = new rive.Rive(opts);
  }
  startRive('State Machine');

  // ---- Pointer tracking (desktop only) ----
  function onMove(x, y) {
    lastMouse = performance.now();
    if (isMobile) return;

    if (!isDragging && performance.now() - dragCooldown > DRAG_COOLDOWN_MS) {
      const off = 70;
      target.x = clamp(x - off, off / 2 + MARGIN, winW - off / 2 - MARGIN);
      target.y = clamp(y - off, off / 2 + MARGIN, winH - off / 2 - MARGIN);
    }

    const dx = (x - float.x) / (winW * REACH);
    const dy = (y - float.y) / (winH * REACH);
    lookTarget.x = clamp(dx, -1, 1);
    lookTarget.y = clamp(dy, -1, 1);
  }

  window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => {
    if (!isMobile && e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  // ---- Speech bubble (minimal "Hi!" on bot tap/click) ----
  const bubble = document.createElement('div');
  bubble.className = 'cool-bot-bubble';
  bubble.textContent = 'Hi!';
  wrap.appendChild(bubble);
  let bubbleTimer = null;
  let waveTimer = null;
  function showBubble(msg) {
    bubble.textContent = msg;
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 2200);
  }
  function wave() {
    if (chatInput) { try { chatInput.value = true; } catch (e) {} }
    clearTimeout(waveTimer);
    waveTimer = setTimeout(() => {
      if (chatInput) { try { chatInput.value = false; } catch (e) {} }
      if (resetInput) { try { resetInput.fire(); } catch (e) {} }
    }, 2600);
  }
  function onBotTap(e) {
    if (dragMoved) return;
    if (e) e.stopPropagation();
    wave();
    showBubble('Hi!');
  }

  // Make the bot itself tappable/clickable. The wrapper stays pass-through so
  // the rest of the page (text, links, images) is never blocked; only the bot
  // canvas reacts to a tap/click. Works for mouse, touch and pointer.
  canvas.style.pointerEvents = 'auto';
  canvas.style.cursor = 'pointer';
  canvas.addEventListener('click', onBotTap);

  if (isMobile) {
    // Combined drag + tap for mobile
    let touchStartX = 0, touchStartY = 0;

    canvas.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      dragMoved = false;
      isDragging = true;
      dragOffX = t.clientX - pos.x;
      dragOffY = t.clientY - pos.y;
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const t = e.touches[0];
      if (Math.abs(t.clientX - touchStartX) > 8 || Math.abs(t.clientY - touchStartY) > 8) {
        dragMoved = true;
      }
      const nx = clamp(t.clientX - dragOffX, winW * 0.15, winW * 0.85);
      const ny = clamp(t.clientY - dragOffY, 35, 60);
      target.x = nx;
      target.y = ny;
      float.x = nx;
      float.y = ny;
      e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
      isDragging = false;
      if (!dragMoved) onBotTap();
    });

    canvas.addEventListener('touchcancel', () => { isDragging = false; });
  } else {
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); onBotTap(e); }, { passive: false });

    // Desktop drag support
    let mouseStartX = 0, mouseStartY = 0;

    canvas.addEventListener('mousedown', (e) => {
      mouseStartX = e.clientX;
      mouseStartY = e.clientY;
      dragMoved = false;
      isDragging = true;
      dragOffX = e.clientX - pos.x;
      dragOffY = e.clientY - pos.y;
      canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      if (Math.abs(e.clientX - mouseStartX) > 8 || Math.abs(e.clientY - mouseStartY) > 8) {
        dragMoved = true;
      }
      const nx = clamp(e.clientX - dragOffX, MARGIN + 50, winW - MARGIN - 50);
      const ny = clamp(e.clientY - dragOffY, MARGIN + 50, winH - MARGIN - 50);
      target.x = nx;
      target.y = ny;
      float.x = nx;
      float.y = ny;
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      dragCooldown = performance.now();
      canvas.style.cursor = 'pointer';
    });
  }

  window.addEventListener('resize', () => {
    winW = window.innerWidth;
    winH = window.innerHeight;
    if (rInstance) rInstance.resizeDrawingSurfaceToCanvas();
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function tick() {
    bobT += 0.016;
    patrolT += 0.01;

    // Smooth floating follow (desktop AND mobile): "float" lags behind the
    // pointer target, the bot eases toward that floating point. Trails
    // naturally instead of snapping to the cursor.
    const trail = isMobile ? FLOAT_TRAIL : DESKTOP_TRAIL;
    const ease = isMobile ? FOLLOW_EASE : DESKTOP_EASE;
    float.x += (target.x - float.x) * trail;
    float.y += (target.y - float.y) * trail;
    pos.x += (float.x - pos.x) * ease;
    pos.y += (float.y - pos.y) * ease;

    // ---- Mobile: drift between logo and hamburger in navbar ----
    if (isMobile && !isDragging) {
      target.x += (winW * 0.5 + Math.sin(patrolT * 0.4) * 20 - target.x) * 0.008;
      target.x = clamp(target.x, winW * 0.28, winW * 0.72);

      autoGazeT += 0.016;
      if (autoGazeT > nextGazeChange) {
        autoGazeT = 0;
        nextGazeChange = 2 + Math.random() * 4;
        autoGazeX = (Math.random() - 0.5) * 1.2;
        autoGazeY = (Math.random() - 0.5) * 0.8;
      }
      lookTarget.x += (autoGazeX - lookTarget.x) * 0.015;
      lookTarget.y += (autoGazeY - lookTarget.y) * 0.015;
    }

    // Ease eyes/head direction.
    look.x += (lookTarget.x - look.x) * LOOK_EASE;
    look.y += (lookTarget.y - look.y) * LOOK_EASE;

    // Eye-follow illusion: nudge the artboard slightly toward the look point.
    eyeX += (look.x * EYE_PARALLAX - eyeX) * LOOK_EASE;
    eyeY += (look.y * EYE_PARALLAX - eyeY) * LOOK_EASE;
    canvas.style.transform = `translate(${eyeX.toFixed(2)}px, ${eyeY.toFixed(2)}px)`;

    // Idle bobbing + drift (calmed when reduced motion is preferred).
    const amp = reduceMotion ? FLOAT_AMPLITUDE * 0.3 : (isMobile ? FLOAT_AMPLITUDE * 0.35 : FLOAT_AMPLITUDE);
    const bob = Math.sin(bobT * 1.4) * amp;
    const driftX = reduceMotion ? 0 : (isMobile ? 0 : Math.sin(bobT * 0.6) * 10);

    // Natural slant: lean into the direction of horizontal travel.
    const vx = pos.x - (tick._px || pos.x);
    tick._px = pos.x;
    tiltTarget = clamp(vx * 0.6, -MAX_TILT, MAX_TILT);
    tilt += (tiltTarget - tilt) * 0.08;

    const cx = pos.x + driftX;
    const cy = pos.y + bob;
    wrap.style.left = cx.toFixed(2) + 'px';
    wrap.style.top = cy.toFixed(2) + 'px';
    wrap.style.transform = `translate(-50%, -50%) rotate(${tilt.toFixed(2)}deg)`;

    // Relax the look toward center when the pointer is idle (desktop only).
    if (!isMobile && performance.now() - lastMouse > 1200) {
      lookTarget.x += (0 - lookTarget.x) * 0.05;
      lookTarget.y += (0 - lookTarget.y) * 0.05;
    }

    requestAnimationFrame(tick);
  }
})();
