document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('bg-dark', 'shadow-lg', 'border-dark-5');
      navbar.classList.remove('bg-transparent', 'border-transparent');
    } else {
      navbar.classList.add('bg-transparent', 'border-transparent');
      navbar.classList.remove('bg-dark', 'shadow-lg', 'border-dark-5');
    }
  });

  // --- Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMenu() {
    mobileMenu.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.add('translate-x-full');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));


  // --- 3D Hover Effect for Hero Logo
  const cardContainer = document.getElementById('hero-logo-container');
  const card = document.getElementById('hero-logo-card');

  if (cardContainer && card) {
    cardContainer.addEventListener('mousemove', (e) => {
      const rect = cardContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg
      const rotateY = ((x - centerX) / centerX) * 15;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    cardContainer.addEventListener('mouseleave', () => {
      card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    });

    cardContainer.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s linear';
    });
  }


  // --- Moto Scroll Animation Engine ---
  const dashesInner = document.getElementById('dashesInner');
  const motoRider = document.getElementById('moto-rider');
  const speedTrail = document.getElementById('speedTrail');
  const puffsContainer = document.getElementById('puffs-container');
  const progressBar = document.getElementById('scroll-progress');
  const wheels = document.querySelectorAll('.wheel-spin');

  // Generate road dashes
  if (dashesInner) {
    for (let i = 0; i < 40; i++) {
      const span = document.createElement('span');
      span.className = 'inline-block w-[40px] h-[3px] bg-yellow mr-[30px] rounded-full shrink-0 opacity-60';
      dashesInner.appendChild(span);
    }
  }

  let motoX = 0;
  let targetX = 0;
  let velocitySmoothed = 0;
  let lastDirection = 1;
  const motoWidth = 110;
  const padding = 20;

  let lastTime = performance.now();
  let smokeTimer = 0;

  function createSmokePuff(direction) {
    if (!puffsContainer) return;
    const puff = document.createElement('div');
    const dirClass = direction === 'left' ? 'puff-left' : 'puff-right';
    puff.className = `puff ${dirClass}`;
    // random slight offset
    puff.style.top = `${(Math.random() - 0.5) * 10}px`;
    puffsContainer.appendChild(puff);

    setTimeout(() => {
      if (puff.parentNode) puff.parentNode.removeChild(puff);
    }, 600);
  }

  function renderMoto(time) {
    const dt = time - lastTime;
    lastTime = time;

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docH > 0 ? window.scrollY / docH : 0;
    const vw = window.innerWidth;

    // Target position of moto
    targetX = padding + progress * (vw - motoWidth - padding * 2);

    // Ease towards target
    motoX += (targetX - motoX) * 0.1;

    if (motoRider) {
      motoRider.style.transform = `translateX(${motoX}px)`;

      // Top progress bar update
      if (progressBar) progressBar.style.width = `${progress * 100}%`;

      const currentVelocity = (targetX - motoX);
      const absVel = Math.abs(currentVelocity);

      velocitySmoothed += (absVel - velocitySmoothed) * 0.1;

      const isMoving = velocitySmoothed > 0.5;

      // Wheel spinning
      wheels.forEach(w => {
        w.style.animationPlayState = isMoving ? 'running' : 'paused';
        if (isMoving) {
          w.style.animationDuration = `${Math.max(0.1, 0.4 - velocitySmoothed * 0.02)}s`;
        }
      });

      // Road dashes sliding backwards relative to moto speed
      if (dashesInner) {
        if (isMoving) {
          // just a simple continuous translation effect CSS would be better, but we do it via transform
          const currentTx = parseFloat(dashesInner.dataset.tx || 0);
          let newTx = currentTx - (velocitySmoothed * 2);
          if (newTx <= -70) newTx = 0; // reset loop (40px width + 30px margin)
          dashesInner.style.transform = `translateX(${newTx}px)`;
          dashesInner.dataset.tx = newTx;
        }
      }

      // Logic adjustment for professional physics
      const emojiDiv = document.getElementById('moto-emoji');
      const exhaustWrap = document.getElementById('exhaust-wrap');

      // Determine movement: currentVelocity > 0 means moving RIGHT
      if (absVel > 0.5) {
        lastDirection = currentVelocity > 0 ? -1 : 1; // scaleX(-1) faces right
      }
      const directionScale = lastDirection;
      const facingRight = (directionScale === -1);

      if (emojiDiv) {
        const lean = Math.max(-10, Math.min(10, currentVelocity * 0.3));
        emojiDiv.style.transform = `scaleX(${directionScale}) rotate(${lean}deg) translateY(-2px)`;
      }

      // Move effects to the back of the bike
      if (exhaustWrap) {
        if (facingRight) {
          exhaustWrap.style.left = '-15px';
          exhaustWrap.style.right = 'auto';
        } else {
          exhaustWrap.style.left = 'auto';
          exhaustWrap.style.right = '-15px';
        }
      }

      // Speed trail logic
      if (speedTrail) {
        speedTrail.style.opacity = Math.min(velocitySmoothed / 10, 1).toFixed(2);
        speedTrail.style.width = `${Math.min(100, 35 + velocitySmoothed * 5)}px`;
        if (facingRight) {
          speedTrail.style.left = '-35px';
          speedTrail.style.right = 'auto';
          speedTrail.style.transform = 'scaleX(1)';
        } else {
          speedTrail.style.left = 'auto';
          speedTrail.style.right = '-35px';
          speedTrail.style.transform = 'scaleX(-1)';
        }
      }

      // Smoke puffs logic - always behind
      if (isMoving) {
        smokeTimer += dt;
        if (smokeTimer > Math.max(50, 200 - velocitySmoothed * 10)) {
          createSmokePuff(facingRight ? 'left' : 'right');
          smokeTimer = 0;
        }
      }
    }

    requestAnimationFrame(renderMoto);
  }

  requestAnimationFrame(renderMoto);

});

// --- FORM HANDLING ---
window.submitForm = function () {
  const prenom = document.getElementById('prenom').value.trim();
  const nom = document.getElementById('nom').value.trim();
  const tel = document.getElementById('telephone').value.trim();
  const ville = document.getElementById('ville').value.trim();
  const permis = document.getElementById('permis').value;
  const moto = document.getElementById('moto').value.trim() || "Non spécifiée";

  if (!prenom || !nom || !tel || !ville || !permis) {
    alert('Merci de remplir tous les champs obligatoires (*).');
    return;
  }

  const checks = ['chk_moto', 'chk_cg', 'chk_assur', 'chk_casque'];
  const allChecked = checks.every(id => document.getElementById(id).checked);

  if (!allChecked) {
    alert("Tu dois confirmer que tu disposes de tous les équipements requis (Moto, Carte Grise, Assurance, Casque). La sécurité avant tout.");
    return;
  }

  // --- WhatsApp Redirect Logic ---
  const WHATSAPP_NUMBER = "221774101505";
  const message = `Bonjour LCIS Motards !
Je souhaite soumettre ma candidature :
- *Nom* : ${prenom} ${nom}
- *Téléphone* : ${tel}
- *Ville* : ${ville}
- *Permis* : ${permis}
- *Moto* : ${moto}

À très bientôt sur la route !`;

  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  // Open WhatsApp in new tab
  window.open(waUrl, '_blank');

  // Show internal success state
  document.getElementById('formContent').classList.add('hidden');
  document.getElementById('formSuccess').classList.remove('hidden');
  document.getElementById('formSuccess').classList.add('flex');
}

window.resetForm = function () {
  document.getElementById('prenom').value = '';
  document.getElementById('nom').value = '';
  document.getElementById('telephone').value = '';
  document.getElementById('ville').value = '';
  document.getElementById('permis').value = '';
  document.getElementById('moto').value = '';

  ['chk_moto', 'chk_cg', 'chk_assur', 'chk_casque'].forEach(id => {
    document.getElementById(id).checked = false;
  });

  document.getElementById('formSuccess').classList.add('hidden');
  document.getElementById('formSuccess').classList.remove('flex');
  document.getElementById('formContent').classList.remove('hidden');
}
