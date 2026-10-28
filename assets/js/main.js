/**
 * MYSTICAL VIBRATIONS - INTERACTIVE EXPERIENCE & AMBIENT ANIMATION ENGINE
 * Canvas Particle Dynamics, Book Purchasing & Modern UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initAmbientParticles();
  initBookPurchasing();
  initChecklist();
  initBookingForm();
  initMobileNav();
  initScrollHeader();
});

/* ==========================================================================
   1. PRELOADER CONTROLLER
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('site-preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('loaded');
      document.body.classList.add('page-ready');
    }, 900);
  });

  // Fallback timeout in case of cached or slow external assets
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
      document.body.classList.add('page-ready');
    }
  }, 2500);
}

/* ==========================================================================
   2. AMBIENT PARTICLES (Floating Golden Leaves & Botanical Petals)
   ========================================================================== */
function initAmbientParticles() {
  const canvas = document.getElementById('ambient-particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const leafCount = Math.min(Math.floor(width / 50), 32);
  const particles = [];

  class LeafParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 30;
      this.size = Math.random() * 12 + 8;
      this.speedY = -(Math.random() * 0.45 + 0.25);
      this.speedX = Math.random() * 0.4 - 0.2;
      this.angle = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.opacity = Math.random() * 0.45 + 0.25;
      this.oscillation = Math.random() * 100;
      this.oscillationSpeed = Math.random() * 0.02 + 0.01;
      this.type = Math.random() > 0.45 ? 'leaf' : 'petal';
    }

    update() {
      this.y += this.speedY;
      this.oscillation += this.oscillationSpeed;
      this.x += Math.sin(this.oscillation) * 0.6 + this.speedX;
      this.angle += this.rotationSpeed;

      if (this.y < -40 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'leaf') {
        // Delicate Golden Leaf
        ctx.fillStyle = 'rgba(212, 175, 55, 0.45)';
        ctx.strokeStyle = 'rgba(235, 205, 115, 0.65)';
        ctx.lineWidth = 0.8;

        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.4, this.size * 0.7, this.size * 0.6, 0, this.size);
        ctx.bezierCurveTo(-this.size * 0.7, this.size * 0.6, -this.size * 0.8, -this.size * 0.4, 0, -this.size);
        ctx.fill();
        ctx.stroke();

        // Central leaf vein
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.85);
        ctx.lineTo(0, this.size * 0.85);
        ctx.stroke();
      } else {
        // Ethereal Flower Petal / Stardust Glow
        const gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size);
        gradient.addColorStop(0, 'rgba(255, 245, 215, 0.7)');
        gradient.addColorStop(0.6, 'rgba(212, 175, 55, 0.35)');
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.75, this.size * 1.3, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < leafCount; i++) {
    particles.push(new LeafParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. BOOK PURCHASING ENGINE & INTERACTIVE CART
   ========================================================================== */
function initBookPurchasing() {
  const formatButtons = document.querySelectorAll('.format-option-btn');
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyDisplay = document.getElementById('book-qty');
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  const addToCartLabel = document.getElementById('add-to-cart-label');
  const toast = document.getElementById('cart-toast');
  const toastDesc = document.getElementById('toast-desc');

  let currentPrice = 24.95;
  let currentFormat = 'Signed Hardcover Edition';
  let quantity = 1;
  let toastTimer = null;

  function updateButtonLabel() {
    const total = (currentPrice * quantity).toFixed(2);
    if (addToCartLabel) {
      addToCartLabel.textContent = `Add to Sanctuary Cart — $${total}`;
    }
  }

  formatButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      formatButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentPrice = parseFloat(btn.getAttribute('data-price')) || 24.95;
      currentFormat = btn.getAttribute('data-format') || 'Signed Hardcover Edition';
      updateButtonLabel();
    });
  });

  if (qtyMinus) {
    qtyMinus.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        qtyDisplay.textContent = quantity;
        updateButtonLabel();
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', () => {
      if (quantity < 10) {
        quantity++;
        qtyDisplay.textContent = quantity;
        updateButtonLabel();
      }
    });
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const total = (currentPrice * quantity).toFixed(2);
      if (toast && toastDesc) {
        toastDesc.textContent = `${quantity}x The Moment We Rise (${currentFormat}) added • $${total}`;
        toast.classList.add('active');

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toast.classList.remove('active');
        }, 4500);
      }
    });
  }
}

/* ==========================================================================
   4. SOUND BATH PREPARATION CHECKLIST
   ========================================================================== */
function initChecklist() {
  const checkItems = document.querySelectorAll('.prep-item-checkbox');
  checkItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      const circle = item.querySelector('.custom-check-circle');
      if (item.classList.contains('checked')) {
        circle.innerHTML = '✓';
      } else {
        circle.innerHTML = '';
      }
    });
  });
}

/* ==========================================================================
   5. BOOKING FORM HANDLER
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('booking-portal-form');
  const feedback = document.getElementById('booking-feedback');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value;
    const email = form.querySelector('[name="email"]').value;
    const modality = form.querySelector('[name="modality"]').value;

    if (!name || !email) {
      alert('Please fill out your name and email to proceed.');
      return;
    }

    if (feedback) {
      feedback.style.display = 'block';
      feedback.innerHTML = `
        <strong>Thank You, ${name}!</strong><br>
        Your session inquiry for <em>${modality || 'Holistic Wellness'}</em> has been lovingly received. Cristine Pontillo will review your request and connect with you directly within 24 hours.
      `;
      form.reset();

      setTimeout(() => {
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  });
}

/* ==========================================================================
   6. MOBILE NAVIGATION & SCROLL HEADER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('active');
  });

  const links = drawer.querySelectorAll('a');
  links.forEach(l => {
    l.addEventListener('click', () => {
      drawer.classList.remove('active');
    });
  });
}

function initScrollHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}
