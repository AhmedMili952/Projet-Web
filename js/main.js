/**
 * EFREI - Département Informatique
 * XTI205-CYB | JavaScript Principal
 */

/* ============================================
   HEADER SCROLL EFFECT
   ============================================ */
(function () {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
})();

/* ============================================
   HAMBURGER MENU
   ============================================ */
(function () {
    const burger = document.getElementById('hamburger');
    const nav = document.getElementById('headerNav');
    if (!burger || !nav) return;

    burger.addEventListener('click', function () {
        const isOpen = nav.classList.toggle('open');
        burger.classList.toggle('open', isOpen);
        burger.setAttribute('aria-expanded', isOpen.toString());
    });

    // Fermer au clic sur un lien
    nav.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('open');
            burger.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
        });
    });
})();

/* ============================================
   REVEAL ON SCROLL (IntersectionObserver)
   ============================================ */
(function () {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    elements.forEach(function (el) {
        observer.observe(el);
    });
})();

/* ============================================
   COMPTEUR ANIMÉ (stats)
   ============================================ */
(function () {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'), 10);
            const duration = 1600;
            const start = performance.now();

            function step(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Easing: ease-out cubic
                const ease = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(ease * target).toLocaleString('fr-FR');
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }

            requestAnimationFrame(step);
            observer.unobserve(el);
        });
    }, { threshold: 0.3 });

    counters.forEach(function (counter) {
        observer.observe(counter);
    });
})();

/* ============================================
   CARROUSEL TÉMOIGNAGES
   ============================================ */
(function () {
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.carousel-dot');
    if (!track || !dots.length) return;

    const slides = track.querySelectorAll('.carousel-slide');
    let current = 0;
    let timer;

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        track.scrollTo({ left: slides[current].offsetLeft, behavior: 'smooth' });
        dots.forEach(function (d, i) {
            d.classList.toggle('active', i === current);
        });
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            clearInterval(timer);
            goTo(i);
            startTimer();
        });
    });

    function startTimer() {
        timer = setInterval(function () {
            goTo(current + 1);
        }, 4000);
    }

    startTimer();
})();

/* ============================================
   FILTRE AGENDA (page équipe)
   ============================================ */
function filtrerJour(jour) {
    const rows = document.querySelectorAll('#agendaTable tbody tr');
    rows.forEach(function (row) {
        if (jour === 'tous') {
            row.style.display = '';
        } else {
            row.style.display = (row.getAttribute('data-jour') === jour) ? '' : 'none';
        }
    });
}

/* ============================================
   FILTRE ACTUALITÉS
   ============================================ */
function filtrerActu(categorie, btn) {
    const cards = document.querySelectorAll('#actuGrid .news-card');
    cards.forEach(function (card) {
        if (categorie === 'tous' || card.getAttribute('data-categorie') === categorie) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });

    // Mettre à jour l'apparence des boutons
    if (btn) {
        document.querySelectorAll('#actuGrid').forEach(function () {});
        btn.style.background = 'var(--bleu-efrei)';
        btn.style.color = 'white';
    }
}

/* ============================================
   VALIDATION FORMULAIRE CONTACT
   ============================================ */
(function () {
    const form = document.getElementById('contactForm');
    if (!form) return;

    function showError(id, show) {
        const el = document.getElementById('err-' + id);
        if (el) el.style.display = show ? 'block' : 'none';
    }

    function setInvalid(el, invalid) {
        el.style.borderColor = invalid ? '#dc2626' : 'var(--gris-moyen)';
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;

        const prenom = form.querySelector('#prenom');
        const nom = form.querySelector('#nom');
        const email = form.querySelector('#email');
        const sujet = form.querySelector('#sujet');
        const message = form.querySelector('#message');

        // Prénom
        if (!prenom.value.trim()) {
            showError('prenom', true); setInvalid(prenom, true); valid = false;
        } else {
            showError('prenom', false); setInvalid(prenom, false);
        }

        // Nom
        if (!nom.value.trim()) {
            showError('nom', true); setInvalid(nom, true); valid = false;
        } else {
            showError('nom', false); setInvalid(nom, false);
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            showError('email', true); setInvalid(email, true); valid = false;
        } else {
            showError('email', false); setInvalid(email, false);
        }

        // Sujet
        if (!sujet.value) {
            showError('sujet', true); setInvalid(sujet, true); valid = false;
        } else {
            showError('sujet', false); setInvalid(sujet, false);
        }

        // Message
        if (!message.value.trim()) {
            showError('message', true); setInvalid(message, true); valid = false;
        } else {
            showError('message', false); setInvalid(message, false);
        }

        if (valid) {
            form.style.display = 'none';
            const success = document.getElementById('formSuccess');
            if (success) success.style.display = 'block';
        }
    });

    // Validation en temps réel
    form.querySelectorAll('.form-control').forEach(function (el) {
        el.addEventListener('input', function () {
            setInvalid(el, false);
            const id = el.id;
            showError(id, false);
        });
    });
})();

/* ============================================
   CONFETTIS ENGINE (from scratch, no library)
   ============================================ */

(function () {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId = null;
    let running = false;

    // Resize canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Couleurs EFREI + fête
    const COLORS = [
        '#002B5C', '#004EA2', '#00B4D8', '#0096c7',
        '#F5A623', '#FFD700', '#FF6B6B', '#A8E6CF',
        '#FFFFFF', '#C3E6FF'
    ];

    // Formes disponibles
    const SHAPES = ['circle', 'rect', 'triangle', 'star'];

    function randomBetween(a, b) {
        return a + Math.random() * (b - a);
    }

    function createParticle() {
        const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const size = randomBetween(6, 14);
        return {
            x: randomBetween(0, canvas.width),
            y: randomBetween(-80, -10),
            size: size,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            shape: shape,
            speedX: randomBetween(-3, 3),
            speedY: randomBetween(3, 7),
            rotation: randomBetween(0, Math.PI * 2),
            rotationSpeed: randomBetween(-0.12, 0.12),
            opacity: 1,
            wobble: randomBetween(0, Math.PI * 2),
            wobbleSpeed: randomBetween(0.05, 0.12),
            gravity: randomBetween(0.05, 0.12),
            lifespan: randomBetween(200, 340),
            age: 0
        };
    }

    function drawParticle(p) {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        switch (p.shape) {
            case 'circle':
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'rect':
                ctx.fillRect(-p.size / 2, -p.size * 0.3, p.size, p.size * 0.6);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -p.size / 2);
                ctx.lineTo(p.size / 2, p.size / 2);
                ctx.lineTo(-p.size / 2, p.size / 2);
                ctx.closePath();
                ctx.fill();
                break;
            case 'star':
                drawStar(ctx, 0, 0, 5, p.size * 0.5, p.size * 0.22);
                break;
        }
        ctx.restore();
    }

    function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
        let rot = Math.PI / 2 * 3;
        const step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerR);
        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
            rot += step;
            ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerR);
        ctx.closePath();
        ctx.fill();
    }

    function updateParticle(p) {
        p.age++;
        p.wobble += p.wobbleSpeed;
        p.speedY += p.gravity;
        p.x += p.speedX + Math.sin(p.wobble) * 1.2;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Fade out at end of lifespan
        if (p.age > p.lifespan * 0.7) {
            p.opacity = 1 - (p.age - p.lifespan * 0.7) / (p.lifespan * 0.3);
        }

        return p.age < p.lifespan && p.y < canvas.height + 40;
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(updateParticle);
        particles.forEach(drawParticle);

        if (particles.length > 0 || running) {
            animId = requestAnimationFrame(loop);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            animId = null;
        }
    }

    let spawnCount = 0;
    let spawnMax = 0;
    let spawnInterval = null;

    window.launchConfetti = function () {
        // Cancel previous
        clearInterval(spawnInterval);
        if (animId) cancelAnimationFrame(animId);
        particles = [];
        running = true;

        spawnCount = 0;
        spawnMax = 160; // nombre total de confettis

        spawnInterval = setInterval(function () {
            // Burst de plusieurs à la fois
            const burst = Math.floor(randomBetween(4, 10));
            for (let i = 0; i < burst; i++) {
                particles.push(createParticle());
            }
            spawnCount += burst;
            if (spawnCount >= spawnMax) {
                clearInterval(spawnInterval);
                running = false;
            }
        }, 40);

        loop();
    };
})();

/* ============================================
   MODAL MEILLEURE ÉCOLE + CONFETTIS
   ============================================ */

(function () {
    const btn = document.getElementById('meilleureBtn');
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');
    if (!btn || !overlay) return;

    function openModal() {
        overlay.removeAttribute('hidden');
        // Force reflow pour déclencher la transition CSS
        void overlay.offsetWidth;
        overlay.classList.add('open');
        closeBtn.focus();

        // Lance les confettis !
        if (typeof window.launchConfetti === 'function') {
            window.launchConfetti();
        }
    }

    function closeModal() {
        overlay.setAttribute('hidden', '');
    }

    btn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    // Fermer en cliquant sur le fond
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
    });

    // Fermer avec Échap
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) {
            closeModal();
        }
    });
})();

/* ============================================
   FAQ ACCORDION
   ============================================ */
(function () {
    const questions = document.querySelectorAll('.faq-question');
    if (!questions.length) return;

    questions.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const answer = btn.nextElementSibling;
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            // Fermer tous les autres
            questions.forEach(function (other) {
                if (other !== btn) {
                    other.setAttribute('aria-expanded', 'false');
                    other.nextElementSibling.classList.remove('open');
                }
            });

            // Toggle celui-ci
            btn.setAttribute('aria-expanded', (!isOpen).toString());
            answer.classList.toggle('open', !isOpen);
        });
    });
})();
