(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealTargets = document.querySelectorAll(
        '.content-block, .features-grid, .services-list, .service-item, .industry-item, .why-card, .execution-timeline, .commitment-section, .contact-cards-container, .contact-form-section, .disciplines-section, .brand-closing-box, .image-container, .footer'
    );

    document.documentElement.classList.add('js-ready');
    document.body.classList.add('page-ready');

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

    document.querySelectorAll('a[href]').forEach((link) => {
        const url = new URL(link.href, window.location.href);
        const isSamePage = url.origin === window.location.origin && url.pathname === window.location.pathname;

        if (isSamePage && url.hash) {
            link.addEventListener('click', (event) => {
                const target = document.querySelector(url.hash);

                if (!target) {
                    return;
                }

                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                window.history.pushState(null, '', url.hash);
            });
            return;
        }

        if (url.origin !== window.location.origin || link.target === '_blank' || link.hasAttribute('download')) {
            return;
        }

        link.addEventListener('click', (event) => {
            if (reduceMotion || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            event.preventDefault();
            document.body.classList.add('page-leaving');

            window.setTimeout(() => {
                window.location.href = link.href;
            }, 260);
        });
    });

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