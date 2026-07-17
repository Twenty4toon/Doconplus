/* =========================================================
   Docon+ — Floating Rive "Cool" Bot with Q&A Chat
   - Smoothly floats across the page (stays ABOVE content)
   - Head, eyes & whole body lean toward the cursor/pointer
   - Tap/click the bot -> opens interactive Q&A chat panel
   - Both desktop and mobile: the bot follows the pointer.
   ========================================================= */

(function () {
  const wrap = document.getElementById('coolBotWrap');
  const canvas = document.getElementById('coolBotCanvas');
  if (!wrap || !canvas || typeof rive === 'undefined') return;

  // ---- Q&A Dataset (Docon+ specific) ----
  const botQA = [
    { q: "What services does Docon+ offer?", a: "Docon+ offers complete healthcare digital marketing including SEO, social media management, custom website design, Google Business Profile optimization, and personal branding for doctors and clinics." },
    { q: "How much do your services cost?", a: "Our pricing is customized based on your practice size, goals, and service scope. We offer packages starting from affordable monthly retainers. Book a free consultation and we will create a tailored quote for you." },
    { q: "How can I contact you?", a: "You can reach us at +91 9597374221, email us at doconplus@gmail.com, or use the contact form on our website. We are also available on WhatsApp \u2014 just click the green icon on this page!" },
    { q: "What industries do you serve?", a: "We specialize in healthcare \u2014 serving doctors, dentists, dermatologists, orthopedic surgeons, clinics, hospitals, and wellness centers across India and globally." },
    { q: "Do you offer SEO for healthcare websites?", a: "Absolutely! Our healthcare SEO includes local SEO (Google Maps ranking), on-page optimization, technical SEO, content strategy (blogs, service pages), and reputation management to help patients find you online." },
    { q: "Can I see some case studies?", a: "Yes! Visit our Case Studies page to see real results we have delivered for healthcare clients \u2014 including increased website traffic, higher patient inquiries, and improved search rankings." },
    { q: "How long does it take to see results?", a: "It depends on the service. SEO typically shows meaningful improvements in 3\u20136 months. Social media growth can be seen in 1\u20133 months. Website design takes 2\u20134 weeks. We set clear timelines during onboarding." },
    { q: "Do you offer website design?", a: "Yes, we design custom healthcare websites that are patient-friendly, mobile-optimized, and conversion-focused. Features include online booking, telemedicine integration, service pages, doctor profiles, and more." },
    { q: "What makes Docon+ different?", a: "We are 100% healthcare-focused. Unlike general agencies, we understand patient behavior, medical compliance, and what actually drives appointments. Every strategy is data-driven and tailored to your specialty." },
    { q: "How do I get started?", a: "Getting started is easy! Click the Get a Free Consultation button on this page, fill out our contact form, or WhatsApp us. We will schedule a call to understand your practice and create a custom plan." },
    { q: "What is included in healthcare SEO?", a: "Healthcare SEO includes on-page optimization, technical SEO, local SEO & Google Maps ranking, voice search optimization, Practo & Lybrate profile optimization, keyword research, and patient-focused content strategy." },
    { q: "Do you manage social media for doctors?", a: "Yes! We manage Instagram, Facebook, and YouTube for healthcare professionals \u2014 including educational reels, patient engagement, community building, and monthly performance analytics." },
    { q: "Do you run Google Ads for clinics?", a: "Absolutely! We run Google Search & Display campaigns, Facebook & Instagram ads with treatment-specific targeting, retargeting, budget optimization, and detailed ROAS tracking." },
    { q: "What is online reputation management?", a: "Our ORM includes Google Review management, negative response strategy, patient feedback systems, GBP optimization, and trust badge display to protect and enhance your online image." },
    { q: "Do you offer WhatsApp automation?", a: "Yes! Our WhatsApp automation handles 24/7 appointment booking, follow-up reminders, FAQ bot, automated review requests, EMR & calendar sync, and broadcast health campaigns." },
    { q: "What patient lead generation do you offer?", a: "We build high-converting landing pages, run Google & Meta lead ads, do A/B testing with conversion tracking, integrate WhatsApp & call tracking, and deliver monthly ROI reports." },
    { q: "Do you offer content and video production?", a: "Yes! Professional clinic video shoots, YouTube content strategy, blog writing, patient guides, commercial ad production, and social media creative design are all part of our services." },
    { q: "Do you offer personal branding for doctors?", a: "Yes \u2014 we build your brand identity with logo design, thought leadership content, LinkedIn optimization, speaking opportunity outreach, and specialty authority positioning." },
    { q: "Where are you based and who do you serve?", a: "We are based in India and serve healthcare professionals pan-India and globally \u2014 including doctors, clinics, hospitals, dental practices, and diagnostic labs." },
    { q: "Do you guarantee results?", a: "We set transparent, data-driven expectations. Campaigns launch in 7 days, SEO improvements show in 90 days, and we provide monthly reports tracking real patient inquiries, not vanity metrics." },
    { q: "What is your process?", a: "Our 4-step growth system: 1) Digital Audit of your current presence, 2) Custom Strategy Blueprint, 3) Implementation & launch, 4) Ongoing optimization and scaling." },
    { q: "Is there a free consultation?", a: "Yes! We offer a free 30-minute strategy call with no obligations. We will analyze your practice and provide a clear roadmap to grow \u2014 completely free." },
    { q: "What social proof do you have?", a: "We are trusted by 500+ doctors, maintain a 4.9-star Google rating, serve 50+ cities across India, and are rated as India's top healthcare marketing agency." },
    { q: "Do you offer clinic photography?", a: "Yes, we provide professional doctor portraits, clinic interior shoots, doctor-patient interaction photography, and high-quality B-roll footage for video reels." },
    { q: "How fast can campaigns launch?", a: "Most campaigns launch within 7 days. SEO results become visible within 90 days, while social media and ad campaigns can generate leads within the first few weeks." },
    { q: "price?", a: "Our pricing is customized based on your practice size, goals, and service scope. We offer packages starting from affordable monthly retainers. Book a free consultation and we will create a tailored quote for you." },
    { q: "cost?", a: "Our pricing is customized based on your practice size, goals, and service scope. We offer packages starting from affordable monthly retainers. Book a free consultation and we will create a tailored quote for you." },
    { q: "rates?", a: "Our pricing is customized based on your practice size, goals, and service scope. We offer packages starting from affordable monthly retainers. Book a free consultation and we will create a tailored quote for you." },
    { q: "packages?", a: "Our pricing is customized based on your practice size, goals, and service scope. We offer packages starting from affordable monthly retainers. Book a free consultation and we will create a tailored quote for you." },
    { q: "fees?", a: "Our pricing is customized based on your practice size, goals, and service scope. We offer packages starting from affordable monthly retainers. Book a free consultation and we will create a tailored quote for you." },
    { q: "email?", a: "You can reach us at +91 9597374221, email us at doconplus@gmail.com, or use the contact form on our website." },
    { q: "phone?", a: "You can reach us at +91 9597374221, email us at doconplus@gmail.com, or use the contact form on our website." },
    { q: "support?", a: "You can reach us at +91 9597374221, email us at doconplus@gmail.com, or use the contact form on our website." },
    { q: "help?", a: "You can reach us at +91 9597374221, email us at doconplus@gmail.com, or use the contact form on our website." },
    { q: "branding?", a: "We build your brand identity with logo design, thought leadership content, LinkedIn optimization, speaking opportunity outreach, and specialty authority positioning." },
    { q: "leads?", a: "We build high-converting landing pages, run Google & Meta lead ads, do A/B testing with conversion tracking, integrate WhatsApp & call tracking, and deliver monthly ROI reports." },
    { q: "portfolio?", a: "Visit our Case Studies page to see real results we have delivered for healthcare clients \u2014 including increased website traffic, higher patient inquiries, and improved search rankings." },
    { q: "examples?", a: "Visit our Case Studies page to see real results we have delivered for healthcare clients \u2014 including increased website traffic, higher patient inquiries, and improved search rankings." },
    { q: "guarantee?", a: "We set transparent, data-driven expectations. Campaigns launch in 7 days, SEO improvements show in 90 days, and we provide monthly reports tracking real patient inquiries, not vanity metrics." },
    { q: "work?", a: "Our 4-step growth system: 1) Digital Audit of your current presence, 2) Custom Strategy Blueprint, 3) Implementation & launch, 4) Ongoing optimization and scaling." },
    { q: "turnaround?", a: "Most campaigns launch within 7 days. SEO results become visible within 90 days, while social media and ad campaigns can generate leads within the first few weeks." },
    { q: "compliance?", a: "We are 100% healthcare-focused and fully compliant with NMC and MCI guidelines. All marketing strategies are ethical, patient-centric, and regulation-friendly." }
  ];

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
  let docked = false;
  function onMove(x, y) {
    lastMouse = performance.now();
    if (isMobile) return;

    // When docked, skip cursor position tracking (bot stays near chat) but keep look direction
    if (!docked && !isDragging && performance.now() - dragCooldown > DRAG_COOLDOWN_MS) {
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

  // ---- Chat Panel with Text Input ----
  let chatOpen = false;
  let chatPanel = null;
  let chatMessages = null;
  let chatInputEl = null;
  let waveTimer = null;
  function wave() {
    if (chatInput) { try { chatInput.value = true; } catch (e) {} }
    clearTimeout(waveTimer);
    waveTimer = setTimeout(() => {
      if (chatInput) { try { chatInput.value = false; } catch (e) {} }
      if (resetInput) { try { resetInput.fire(); } catch (e) {} }
    }, 2600);
  }
  function findBestMatch(input) {
    var lower = input.toLowerCase().trim();
    if (!lower) return null;
    if (/^(hi|hello|hey|yo|sup|howdy|heya|namaste|namaskar|ok|okay|k|kk|alright|sure|hmm|hlo|helo|hellow|good\s*(morning|afternoon|evening|day)|how\s*(are\s*you|is\s*it\s*going)|whats\s*up|what's up)$/.test(lower) || /^(hi|hello|hey)\b/.test(lower)) {
      return "Hi there! \uD83D\uDC4B How can I help you today? Ask me about our services, pricing, SEO, website design, or anything about Docon+!";
    }
    if (/\b(thanks|thank you|thx|ty|thnk|thnks|thank u|cheers|appreciate|much appreciated|thanks a lot)\b/.test(lower)) {
      return "You're welcome! \uD83D\uDE0A Feel free to ask if anything else comes to mind.";
    }
    if (/\b(bye|goodbye|see you|talk later|catch you later|see ya|later|take care|tc|gtg|gotta go)\b/.test(lower)) {
      return "Goodbye! \uD83D\uDC4B Don't hesitate to reach out anytime. Have a great day!";
    }
    var words = lower.split(/\s+/).filter(function (w) { return w.length > 2; });
    if (words.length === 0) {
      return "I'm not sure about that. For specific questions, contact us at doconplus@gmail.com or call +91 9597374221!";
    }
    var bestScore = 0;
    var bestAnswer = null;
    for (var i = 0; i < botQA.length; i++) {
      var item = botQA[i];
      var score = 0;
      for (var j = 0; j < words.length; j++) {
        if (item.q.toLowerCase().indexOf(words[j]) !== -1) score += 2;
        if (item.a.toLowerCase().indexOf(words[j]) !== -1) score += 1;
      }
      if (score > bestScore) { bestScore = score; bestAnswer = item.a; }
    }
    if (bestScore > 0) return bestAnswer;
    return "I'm not sure about that. For personalized help, email us at doconplus@gmail.com or call +91 9597374221. You can also ask about services, pricing, or SEO!";
  }
  function buildChatPanel() {
    if (chatPanel) return;
    chatPanel = document.createElement('div');
    chatPanel.className = 'cool-bot-chat-panel';
    var header = document.createElement('div');
    header.className = 'cool-bot-chat-header';
    var title = document.createElement('span');
    title.className = 'cool-bot-chat-title';
    title.textContent = '\u2726 Docon+ Bot';
    header.appendChild(title);
    var closeBtn = document.createElement('button');
    closeBtn.className = 'cool-bot-chat-close';
    closeBtn.innerHTML = '\u00d7';
    closeBtn.setAttribute('aria-label', 'Close chat');
    closeBtn.addEventListener('click', function (ce) { ce.stopPropagation(); closeChat(); });
    header.appendChild(closeBtn);
    chatPanel.appendChild(header);
    var body = document.createElement('div');
    body.className = 'cool-bot-chat-body';
    chatMessages = document.createElement('div');
    chatMessages.className = 'cool-bot-chat-messages';
    body.appendChild(chatMessages);
    var inputRow = document.createElement('div');
    inputRow.className = 'cool-bot-chat-input-row';
    chatInputEl = document.createElement('input');
    chatInputEl.className = 'cool-bot-chat-input';
    chatInputEl.type = 'text';
    chatInputEl.placeholder = 'Type a message...';
    chatInputEl.setAttribute('autocomplete', 'off');
    inputRow.appendChild(chatInputEl);
    var sendBtn = document.createElement('button');
    sendBtn.className = 'cool-bot-chat-send';
    sendBtn.setAttribute('aria-label', 'Send message');
    sendBtn.innerHTML = '\u27A4';
    inputRow.appendChild(sendBtn);
    body.appendChild(inputRow);
    chatPanel.appendChild(body);
    document.body.appendChild(chatPanel);
    function onSend() {
      var text = chatInputEl.value.trim();
      if (!text) return;
      chatInputEl.value = '';
      handleUserInput(text);
    }
    chatInputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); onSend(); }
    });
    sendBtn.addEventListener('click', onSend);
  }
  function addBotMessage(text) {
    if (!chatMessages) return;
    var msg = document.createElement('div');
    msg.className = 'cool-bot-msg cool-bot-msg-bot';
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function addUserMessage(text) {
    if (!chatMessages) return;
    var msg = document.createElement('div');
    msg.className = 'cool-bot-msg cool-bot-msg-user';
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function addSuggestionChip() {
    if (!chatMessages) return;
    var prev = chatMessages.querySelectorAll('.cool-bot-suggestion-chip');
    for (var s = 0; s < prev.length; s++) { prev[s].remove(); }
    var idx = Math.floor(Math.random() * botQA.length);
    var qText = botQA[idx].q;
    var chip = document.createElement('button');
    chip.className = 'cool-bot-suggestion-chip';
    chip.textContent = '\uD83D\uDCAC ' + qText;
    chip.addEventListener('click', function () {
      var text = qText;
      chatInputEl.value = '';
      handleUserInput(text);
    });
    chatMessages.appendChild(chip);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function handleUserInput(text) {
    addUserMessage(text);
    window.setTimeout(function () {
      var answer = findBestMatch(text);
      if (answer) addBotMessage(answer);
      wave();
      addSuggestionChip();
      if (chatInputEl) chatInputEl.focus();
    }, 400);
  }
  function dockBot() {
    docked = true;
    if (!chatPanel) return;
    var pr = chatPanel.getBoundingClientRect();
    target.x = clamp(pr.right + 30, 120, winW - 120);
    target.y = clamp(pr.top + pr.height / 2, 120, winH - 120);
  }
  function undockBot() {
    docked = false;
  }
  function openChat() {
    if (isMobile) return;
    buildChatPanel();
    if (chatOpen) return;
    chatOpen = true;
    var br = wrap.getBoundingClientRect();
    var pw = 320;
    var ph = 440;
    var pl = br.left - pw - 16;
    var pt = br.top + br.height / 2 - ph / 2;
    if (pl < 12) {
      pl = br.right + 16;
      pt = br.top + br.height / 2 - ph / 2;
    }
    if (pl + pw > winW - 12) {
      pl = clamp(br.left + br.width / 2 - pw / 2, 12, winW - pw - 12);
      pt = br.top - ph - 16;
      if (pt < 12) { pt = br.bottom + 16; }
    }
    pt = clamp(pt, 12, winH - ph - 12);
    pl = clamp(pl, 12, winW - pw - 12);
    chatPanel.style.left = pl + 'px';
    chatPanel.style.top = pt + 'px';
    chatPanel.classList.add('open');
    dockBot();
    if (chatMessages.children.length === 0) {
      addBotMessage("Hey there! \uD83D\uDC4B I'm the Docon+ assistant. Ask me anything about Docon+!");
      addSuggestionChip();
    }
    wave();
    window.setTimeout(function () { if (chatInputEl) chatInputEl.focus(); }, 400);
  }
  function closeChat() {
    chatOpen = false;
    undockBot();
    if (chatPanel) chatPanel.classList.remove('open');
  }
  function toggleChat() {
    if (chatOpen) { closeChat(); } else { openChat(); }
  }
  function onBotTap(e) {
    if (dragMoved) return;
    if (e) e.stopPropagation();
    toggleChat();
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
    if (winW <= MOBILE_BREAK && chatOpen) closeChat();
    else if (chatOpen && docked) dockBot();
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
