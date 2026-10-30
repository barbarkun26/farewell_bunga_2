/* ==========================================================================
   GREAT HONOR GRADUATION PORTAL — CINTA RATU BUNGA PERMATAHATI
   Interactive Animation, Audio Chime, Lightbox & Cinema Engine
   ========================================================================== */

(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. SCROLL PROGRESS FALLBACK (Modern Web Guidance Compliant)
  // ---------------------------------------------------------------------------
  if (!CSS.supports('animation-timeline', 'scroll()')) {
    const progress = document.querySelector('#progress');
    if (progress) {
      window.addEventListener('scroll', () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const progressPercentage = scrollable > 0 ? scrolled / scrollable : 0;
        progress.style.transform = `scaleX(${Math.min(1, Math.max(0, progressPercentage))})`;
      }, { passive: true });
    }
  }

  // ---------------------------------------------------------------------------
  // 2. WEB AUDIO SYNTHESIZER (CEREMONIAL CHIMES & FANFARE)
  // ---------------------------------------------------------------------------
  let soundEnabled = true;
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function playSparkleChime(type = 'fanfare') {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = type === 'fanfare'
      ? [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      : [659.25, 880.0, 1174.66];        // E5, A5, D6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.075);

      gain.gain.setValueAtTime(0.001, now + idx * 0.075);
      gain.gain.exponentialRampToValueAtTime(0.11, now + idx * 0.075 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.075 + 0.48);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.075);
      osc.stop(now + idx * 0.075 + 0.5);
    });
  }

  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundIconLabel = document.getElementById('sound-icon-label');
  if (soundToggleBtn && soundIconLabel) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundIconLabel.textContent = soundEnabled ? '🔊' : '🔇';
      if (soundEnabled) playSparkleChime('sparkle');
    });
  }

  // ---------------------------------------------------------------------------
  // 3. CONFETTI CANNON ENGINE (BSI TEAL, GOLD & ROSE)
  // ---------------------------------------------------------------------------
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  let confettiPieces = [];
  let confettiAnimId = null;

  function resizeConfettiCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resizeConfettiCanvas();
  window.addEventListener('resize', resizeConfettiCanvas, { passive: true });

  const CONFETTI_COLORS = ['#00A39D', '#19D3CB', '#F8AD3C', '#FFE19C', '#FF6B8B', '#FFFFFF'];

  function launchConfetti(count = 85) {
    if (!confettiCtx || !confettiCanvas) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    for (let i = 0; i < count; i++) {
      const fromLeft = i % 2 === 0;
      confettiPieces.push({
        x: fromLeft ? window.innerWidth * 0.15 : window.innerWidth * 0.85,
        y: window.innerHeight * 0.65,
        vx: (fromLeft ? 1 : -1) * (Math.random() * 11 + 4) + (Math.random() - 0.5) * 4,
        vy: -(Math.random() * 15 + 9),
        size: Math.random() * 8 + 5,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.34,
        drag: 0.988,
        alpha: 1
      });
    }

    if (!confettiAnimId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    if (!confettiCtx || !confettiCanvas) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiPieces.forEach((p) => {
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      if (p.y > confettiCanvas.height * 0.8) {
        p.alpha -= 0.025;
      }

      confettiCtx.save();
      confettiCtx.globalAlpha = Math.max(0, p.alpha);
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      confettiCtx.restore();
    });

    confettiPieces = confettiPieces.filter((p) => p.alpha > 0 && p.y < confettiCanvas.height + 40);

    if (confettiPieces.length > 0) {
      confettiAnimId = requestAnimationFrame(animateConfetti);
    } else {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiAnimId = null;
    }
  }

  // Trigger confetti on Salute button
  const celebrateBtn = document.getElementById('celebrate-trigger');
  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
      launchConfetti(100);
      playSparkleChime('fanfare');
    });
  }

  // Bouquet counter button
  const bouquetBtn = document.getElementById('hero-bouquet-btn');
  const bouquetCounter = document.getElementById('bouquet-counter');
  let bouquetCount = Number(localStorage.getItem('crb_bouquet_count') || 30);
  if (bouquetCounter) bouquetCounter.textContent = String(bouquetCount);

  if (bouquetBtn && bouquetCounter) {
    bouquetBtn.addEventListener('click', () => {
      bouquetCount += 1;
      localStorage.setItem('crb_bouquet_count', String(bouquetCount));
      bouquetCounter.textContent = String(bouquetCount);
      launchConfetti(55);
      playSparkleChime('sparkle');
    });
  }

  // Stamp Great Honor Seal interactive button
  const stampHonorBtn = document.getElementById('stamp-honor-btn');
  const sealStatusText = document.getElementById('seal-status-text');
  if (stampHonorBtn) {
    stampHonorBtn.addEventListener('click', () => {
      stampHonorBtn.classList.remove('stamped');
      void stampHonorBtn.offsetWidth; // Reflow to restart animation
      stampHonorBtn.classList.add('stamped');
      if (sealStatusText) {
        sealStatusText.innerHTML = 'HONOR SEALED<br/>30 OKT 2026';
      }
      launchConfetti(80);
      playSparkleChime('fanfare');
    });
  }

  // Gentle celebratory welcome burst after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      launchConfetti(65);
    }, 650);
  });

  // ---------------------------------------------------------------------------
  // 4. FUTURISTIC BSI STARDUST BACKGROUND CANVAS (#cosmos-canvas)
  // ---------------------------------------------------------------------------
  const cosmosCanvas = document.getElementById('cosmos-canvas');
  const cosmosCtx = cosmosCanvas ? cosmosCanvas.getContext('2d') : null;
  let stars = [];

  function initCosmos() {
    if (!cosmosCanvas || !cosmosCtx) return;
    cosmosCanvas.width = window.innerWidth;
    cosmosCanvas.height = window.innerHeight;

    const count = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 22000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * cosmosCanvas.width,
      y: Math.random() * cosmosCanvas.height,
      r: Math.random() * 2.1 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.08),
      alpha: Math.random() * 0.65 + 0.2,
      isGold: Math.random() > 0.45
    }));
  }

  function renderCosmos() {
    if (!cosmosCanvas || !cosmosCtx) return;
    cosmosCtx.clearRect(0, 0, cosmosCanvas.width, cosmosCanvas.height);

    for (const s of stars) {
      s.x += s.vx;
      s.y += s.vy;
      if (s.y < -10) s.y = cosmosCanvas.height + 10;
      if (s.x < -10) s.x = cosmosCanvas.width + 10;
      if (s.x > cosmosCanvas.width + 10) s.x = -10;

      cosmosCtx.beginPath();
      cosmosCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      cosmosCtx.fillStyle = s.isGold
        ? `rgba(248, 173, 60, ${s.alpha})`
        : `rgba(25, 211, 203, ${s.alpha})`;
      cosmosCtx.fill();
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      requestAnimationFrame(renderCosmos);
    }
  }

  initCosmos();
  renderCosmos();
  window.addEventListener('resize', initCosmos, { passive: true });

  // ---------------------------------------------------------------------------
  // 5. SECTION REVEAL OBSERVER & ACTIVE HUD NAVIGATION
  // ---------------------------------------------------------------------------
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  // Track active section in HUD nav
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.hud-link');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
          });
        }
      });
    },
    { threshold: 0.28 }
  );
  sections.forEach((sec) => sectionObserver.observe(sec));

  // ---------------------------------------------------------------------------
  // 6. 3D INTERACTIVE PERSPECTIVE TILT & HOLOGRAPHIC GLARE
  // ---------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('.tilt-card');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (canHover) {
    tiltCards.forEach((card) => {
      const maxTilt = Number(card.getAttribute('data-tilt-max') || 6);

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const pctX = (x / rect.width) * 100;
        const pctY = (y / rect.height) * 100;

        const rotateY = ((x / rect.width) - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - (y / rect.height)) * maxTilt * 2;

        card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
        card.style.setProperty('--glare-x', `${pctX.toFixed(1)}%`);
        card.style.setProperty('--glare-y', `${pctY.toFixed(1)}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 7. GIANT GALLERY VIEW MODE SWITCHER & LIGHTBOX (<dialog closedby="any">)
  // ---------------------------------------------------------------------------
  const galleryGrid = document.getElementById('monumental-gallery-grid');
  const viewModeBtns = document.querySelectorAll('.view-mode-btn');

  viewModeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-gallery-mode');
      viewModeBtns.forEach((b) => b.classList.toggle('active', b === btn));
      if (galleryGrid && mode) {
        galleryGrid.setAttribute('data-mode', mode);
      }
      playSparkleChime('sparkle');
    });
  });

  // Photo Archive Metadata for Full-Screen Lightbox
  const PHOTO_ARCHIVES = [
    {
      src: './Assets/asset1.jpeg',
      badge: 'ARCHIVE 01 / 06 • THE GREAT HONOR DESK',
      title: 'Happy Internship Farewell — Policy Procedure Group (PPG)',
      caption: 'Momen perpisahan bersama tim PPG lengkap dengan Trofi Bintang Emas “GREAT HONOR”, Certificate of Appreciation BSI, dan buket mawar untuk Cinta Ratu Bunga Permatahati.'
    },
    {
      src: './Assets/asset2.jpeg',
      badge: 'ARCHIVE 02 / 06 • SUNSHINE OF PPG',
      title: 'Terima Kasih untuk Segala Proses, Ilmu, dan Cerita Berharga!',
      caption: 'Kebersamaan hangat tim PPG Bank Syariah Indonesia bersama plakat “Thank You for Your Dedication” dan buket bunga matahari.'
    },
    {
      src: './Assets/asset3.jpeg',
      badge: 'ARCHIVE 03 / 06 • SOVEREIGN GRADUATE',
      title: 'Learn, Grow, Make an Impact — Jumat, 30 Oktober 2026',
      caption: 'Potret anggun Cinta Ratu Bunga Permatahati mengenakan selempang Internship Farewell di depan gedung Bank Syariah Indonesia.'
    },
    {
      src: './Assets/asset4.jpeg',
      badge: 'ARCHIVE 04 / 06 • MARVELOUS HERO EDITION',
      title: '“Real Heroes Also Start as Interns” — Not the End, Just a New Mission!',
      caption: 'Edisi spesial pahlawan PPG bersama Tony Stark & Bucky Barnes: Strategy, Compliance, Process, Impact — Same Team, Different Chapter, Still Marvelous!'
    },
    {
      src: './Assets/asset5.jpeg',
      badge: 'ARCHIVE 05 / 06 • BREAKING NEWS SQUAD',
      title: 'The Daily Paper — Photoplace × Kopikina Squad PPG',
      caption: 'Empat pose seru penuh tawa bersama sahabat-sahabat Policy Procedure Group (PPG).'
    },
    {
      src: './Assets/asset6.jpeg',
      badge: 'ARCHIVE 06 / 06 • SPECIAL ENCORE MEMORY',
      title: 'Momen Spesial Kebersamaan Keluarga Besar PPG — BSI',
      caption: 'Bingkai kenangan istimewa perjalanan Cinta Ratu Bunga Permatahati bersama Policy Procedure Group (PPG) Bank Syariah Indonesia.'
    }
  ];

  // Smart Auto-Resolver for Card 6 (tries asset6.jpeg, asset6.jpg, asset6.png, asset6.webp, or fallback)
  const asset6Img = document.getElementById('asset6-img');
  const ASSET6_CANDIDATES = [
    './Assets/asset6.jpeg',
    './Assets/asset6.jpg',
    './Assets/asset6.png',
    './Assets/asset6.webp',
    './Assets/Asset6.jpeg',
    './Assets/Asset6.jpg',
    './Assets/foto6.jpeg',
    './Assets/foto6.jpg'
  ];
  let candidateIdx = 0;

  if (asset6Img) {
    // Check if user previously selected a custom photo in browser storage
    const savedCustomPhoto = localStorage.getItem('crb_custom_asset6');
    if (savedCustomPhoto) {
      asset6Img.src = savedCustomPhoto;
      PHOTO_ARCHIVES[5].src = savedCustomPhoto;
    }

    asset6Img.addEventListener('error', () => {
      candidateIdx += 1;
      if (candidateIdx < ASSET6_CANDIDATES.length) {
        const nextCandidate = ASSET6_CANDIDATES[candidateIdx];
        asset6Img.src = nextCandidate;
        PHOTO_ARCHIVES[5].src = nextCandidate;
      } else {
        const fallback = asset6Img.getAttribute('data-fallback-src') || './Assets/asset1.jpeg';
        if (asset6Img.src !== fallback) {
          asset6Img.src = fallback;
          PHOTO_ARCHIVES[5].src = fallback;
        }
      }
    });
  }

  // Allow instant custom photo selection on Card 6
  const customPhotoInput = document.getElementById('custom-photo-upload');
  if (customPhotoInput && asset6Img) {
    customPhotoInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = String(reader.result || '');
        if (resultUrl) {
          asset6Img.src = resultUrl;
          PHOTO_ARCHIVES[5].src = resultUrl;
          try {
            localStorage.setItem('crb_custom_asset6', resultUrl);
          } catch (_) {}
          launchConfetti(60);
          playSparkleChime('fanfare');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  const dialog = document.getElementById('photo-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxBadge = document.getElementById('lightbox-badge');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let currentPhotoIndex = 0;

  function updateLightboxContent(index) {
    currentPhotoIndex = (index + PHOTO_ARCHIVES.length) % PHOTO_ARCHIVES.length;
    const item = PHOTO_ARCHIVES[currentPhotoIndex];
    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.title;
    }
    if (lightboxBadge) lightboxBadge.textContent = item.badge;
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxCaption) lightboxCaption.textContent = item.caption;
  }

  function openLightbox(index) {
    if (!dialog) return;
    updateLightboxContent(index);
    dialog.showModal();
    playSparkleChime('sparkle');
  }

  document.querySelectorAll('[data-open-lightbox]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const idx = Number(trigger.getAttribute('data-open-lightbox') || 0);
      openLightbox(idx);
    });
  });

  document.querySelectorAll('.giant-photo').forEach((img, idx) => {
    img.addEventListener('click', () => openLightbox(idx));
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => updateLightboxContent(currentPhotoIndex - 1));
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => updateLightboxContent(currentPhotoIndex + 1));
  }

  window.addEventListener('keydown', (e) => {
    if (!dialog || !dialog.open) return;
    if (e.key === 'ArrowLeft') updateLightboxContent(currentPhotoIndex - 1);
    if (e.key === 'ArrowRight') updateLightboxContent(currentPhotoIndex + 1);
  });

  // MANDATORY Fallback for browsers without <dialog closedby> support (Modern Web Guidance)
  if (dialog && !('closedBy' in HTMLDialogElement.prototype)) {
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (isDialogContent) return;
      dialog.close();
    });
  }

  // ---------------------------------------------------------------------------
  // 8. FUTURISTIC CINEMA VIDEO PLAYER & LIVE EMOJI REACTIONS
  // ---------------------------------------------------------------------------
  const video = document.getElementById('farewell-video');
  const bigPlayOverlay = document.getElementById('big-play-overlay');
  const customPlayBtn = document.getElementById('custom-play-btn');
  const customPlayIcon = document.getElementById('custom-play-icon');
  const customPlayLabel = document.getElementById('custom-play-label');
  const customReplayBtn = document.getElementById('custom-replay-btn');
  const customMuteBtn = document.getElementById('custom-mute-btn');
  const customMuteIcon = document.getElementById('custom-mute-icon');
  const theaterModeBtn = document.getElementById('theater-mode-btn');
  const fullscreenVideoBtn = document.getElementById('fullscreen-video-btn');
  const cinemaStage = document.getElementById('cinema-stage');
  const videoStatusDot = document.getElementById('video-status-dot');
  const videoStatusText = document.getElementById('video-status-text');
  const videoTimecode = document.getElementById('video-timecode');
  const reactionsLayer = document.getElementById('video-reactions-layer');

  function formatTime(sec) {
    if (!Number.isFinite(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function syncVideoUI() {
    if (!video) return;
    const isPlaying = !video.paused && !video.ended;

    if (bigPlayOverlay) {
      bigPlayOverlay.classList.toggle('hidden', isPlaying);
    }
    if (cinemaStage) {
      cinemaStage.classList.toggle('is-playing', isPlaying);
    }
    if (videoStatusDot) {
      videoStatusDot.classList.toggle('live', isPlaying);
    }
    if (videoStatusText) {
      videoStatusText.textContent = isPlaying
        ? 'NOW PLAYING // PPG FAREWELL TRIBUTE'
        : video.ended
          ? 'SCREENING COMPLETE // GREAT HONOR'
          : 'READY TO PLAY // MASTER ARCHIVE';
    }
    if (customPlayIcon) {
      customPlayIcon.textContent = isPlaying ? '⏸' : '▶';
    }
    if (customPlayLabel) {
      customPlayLabel.textContent = isPlaying ? 'Pause Video' : 'Play Video';
    }
  }

  function togglePlayVideo() {
    if (!video) return;
    if (video.paused || video.ended) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  if (video) {
    video.addEventListener('play', syncVideoUI);
    video.addEventListener('pause', syncVideoUI);
    video.addEventListener('ended', () => {
      syncVideoUI();
      launchConfetti(95);
      playSparkleChime('fanfare');
    });
    video.addEventListener('timeupdate', () => {
      if (videoTimecode) {
        videoTimecode.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
      }
    });
    video.addEventListener('loadedmetadata', () => {
      if (videoTimecode) {
        videoTimecode.textContent = `${formatTime(0)} / ${formatTime(video.duration)}`;
      }
    });
  }

  if (bigPlayOverlay) {
    bigPlayOverlay.addEventListener('click', togglePlayVideo);
  }
  if (customPlayBtn) {
    customPlayBtn.addEventListener('click', togglePlayVideo);
  }
  if (customReplayBtn && video) {
    customReplayBtn.addEventListener('click', () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });
  }
  if (customMuteBtn && video) {
    customMuteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (customMuteIcon) {
        customMuteIcon.textContent = video.muted ? '🔇 Muted' : '🔊 Sound On';
      }
    });
  }
  if (theaterModeBtn && cinemaStage) {
    theaterModeBtn.addEventListener('click', () => {
      cinemaStage.classList.toggle('glow-boost');
      playSparkleChime('sparkle');
    });
  }
  if (fullscreenVideoBtn && video) {
    fullscreenVideoBtn.addEventListener('click', () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      }
    });
  }

  // Floating Emoji Reactions over Video
  function spawnVideoReaction(emoji) {
    if (!reactionsLayer) return;
    for (let i = 0; i < 4; i++) {
      const span = document.createElement('span');
      span.className = 'floating-video-emoji';
      span.textContent = emoji;
      span.style.left = `${15 + Math.random() * 70}%`;
      span.style.animationDelay = `${i * 0.12}s`;
      reactionsLayer.appendChild(span);
      setTimeout(() => span.remove(), 2600);
    }
  }

  document.querySelectorAll('.react-emoji-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const emoji = btn.getAttribute('data-emoji') || '🌟';
      spawnVideoReaction(emoji);
      playSparkleChime('sparkle');
    });
  });

  // ---------------------------------------------------------------------------
  // 9. INTERACTIVE PPG WISH COMPOSER & SHARE LINK
  // ---------------------------------------------------------------------------
  const wishForm = document.getElementById('wish-form');
  const wishSender = document.getElementById('wish-sender');
  const wishMessage = document.getElementById('wish-message');
  const tributeWall = document.getElementById('tribute-wall');

  function appendWishCard(sender, message, animate = true) {
    if (!tributeWall) return;
    const article = document.createElement('article');
    article.className = 'tribute-note-card note-gold reveal-item is-visible';

    const pin = document.createElement('div');
    pin.className = 'note-pin';
    pin.setAttribute('aria-hidden', 'true');
    pin.textContent = '✨';

    const quote = document.createElement('p');
    quote.className = 'note-quote';
    quote.textContent = `“${message}”`;

    const footer = document.createElement('div');
    footer.className = 'note-footer';

    const strong = document.createElement('strong');
    strong.textContent = `— ${sender}`;

    const sub = document.createElement('span');
    sub.textContent = 'Live Tribute • PPG Graduation Wall';

    footer.appendChild(strong);
    footer.appendChild(sub);

    article.appendChild(pin);
    article.appendChild(quote);
    article.appendChild(footer);
    tributeWall.appendChild(article);

    if (animate) {
      article.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Load saved wishes from localStorage
  try {
    const savedWishes = JSON.parse(localStorage.getItem('crb_ppg_wishes') || '[]');
    if (Array.isArray(savedWishes)) {
      savedWishes.forEach((w) => {
        if (w && w.sender && w.message) {
          appendWishCard(w.sender, w.message, false);
        }
      });
    }
  } catch (_) {}

  document.querySelectorAll('.quick-wish-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-wish');
      if (wishMessage && preset) {
        wishMessage.value = preset;
        wishMessage.focus();
      }
    });
  });

  if (wishForm && wishSender && wishMessage) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sender = wishSender.value.trim();
      const message = wishMessage.value.trim();
      if (!sender || !message) return;

      appendWishCard(sender, message, true);
      try {
        const saved = JSON.parse(localStorage.getItem('crb_ppg_wishes') || '[]');
        saved.push({ sender, message });
        localStorage.setItem('crb_ppg_wishes', JSON.stringify(saved));
      } catch (_) {}

      wishSender.value = '';
      wishMessage.value = '';
      launchConfetti(75);
      playSparkleChime('fanfare');
    });
  }

  // Share Link Copy Button
  const copyShareBtn = document.getElementById('copy-share-link');
  const copyLinkText = document.getElementById('copy-link-text');
  if (copyShareBtn && copyLinkText) {
    copyShareBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copyLinkText.textContent = '✅ Link Berhasil Disalin! Siap Dibagikan';
      } catch (_) {
        copyLinkText.textContent = '✨ Silakan Salin URL dari Address Bar Browser';
      }
      playSparkleChime('sparkle');
      setTimeout(() => {
        copyLinkText.textContent = 'Salin Link Halaman Ini untuk Dibagikan';
      }, 3200);
    });
  }
})();

