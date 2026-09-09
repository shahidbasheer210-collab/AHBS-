(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealTargets = document.querySelectorAll(
        '.content-block, .features-grid, .services-list, .service-item, .industry-item, .why-card, .execution-timeline, .commitment-section, .contact-cards-container, .contact-form-section, .disciplines-section, .brand-closing-box, .image-container, .footer'
    );

    document.documentElement.classList.add('js-ready');

    revealTargets.forEach((element, index) => {
        element.dataset.reveal = 'soft';
        element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 420)}ms`);
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealTargets.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px' });

    revealTargets.forEach((element) => revealObserver.observe(element));

    if (!window.matchMedia('(pointer: fine)').matches) {
        return;
    }

    const glow = document.createElement('span');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    let frameId;
    let pointerX = -120;
    let pointerY = -120;

    window.addEventListener('pointermove', (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;

        if (frameId) {
            return;
        }

        frameId = requestAnimationFrame(() => {
            glow.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
            glow.classList.add('is-active');
            frameId = undefined;
        });
    }, { passive: true });

    document.addEventListener('mouseleave', () => glow.classList.remove('is-active'));
})();