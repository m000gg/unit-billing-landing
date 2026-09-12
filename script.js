document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        lucide.createIcons();
    }
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = Math.min(i * 60, 240);
                    setTimeout(() => el.classList.add('is-visible'), delay);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach((el) => observer.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    const categories = {
        admin: {
            url: 'unit-billing.local/admin',
            images: [
                './screenshots/admin-1.png',
                './screenshots/admin-2.png',
                './screenshots/admin-3.png',
                './screenshots/admin-4.png',
                './screenshots/admin-5.png',
                './screenshots/admin-6.png',
            ],
        },
        client: {
            url: 'unit-billing.local/client',
            images: [
                './screenshots/client-1.png',
                './screenshots/client-2.png',
                './screenshots/client-3.png',
            ],
        },
    };

    const track = document.getElementById('carousel-track');
    const dotsWrap = document.getElementById('carousel-dots');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const showcaseUrl = document.getElementById('showcase-url');
    const showcaseBody = document.getElementById('showcase-body');
    const tabButtons = document.querySelectorAll('.toggle-btn');

    let currentCategory = 'admin';
    let currentIndex = 0;

    function buildSlides(categoryKey) {
        const { images } = categories[categoryKey];

        track.innerHTML = '';
        dotsWrap.innerHTML = '';

        images.forEach((src, i) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';

            const img = document.createElement('img');
            img.src = src;
            img.alt = `${categoryKey === 'admin' ? 'Admin dashboard' : 'Client portal'} screenshot ${i + 1}`;
            img.loading = i === 0 ? 'eager' : 'lazy';

            const fallback = document.createElement('div');
            fallback.className = 'carousel-fallback hidden';
            fallback.innerHTML = `
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="opacity-30">
          <rect x="3" y="4" width="18" height="14" rx="2"></rect>
          <path d="M3 15l4.5-4.5a2 2 0 0 1 2.8 0L15 15"></path>
          <circle cx="16" cy="9" r="1.5"></circle>
        </svg>
        <p>Drop <span class="font-mono text-white/60">${src.split('/').pop()}</span> into <span class="font-mono text-white/60">/screenshots</span></p>
      `;

            img.addEventListener('load', () => img.classList.add('is-loaded'));
            img.addEventListener('error', () => {
                img.classList.add('hidden');
                fallback.classList.remove('hidden');
            });

            slide.appendChild(img);
            slide.appendChild(fallback);
            track.appendChild(slide);
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot' + (i === 0 ? ' is-active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsWrap.appendChild(dot);
        });
    }

    function updateTrackPosition() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        const dots = dotsWrap.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentIndex));
    }

    function goToSlide(index) {
        const total = categories[currentCategory].images.length;
        currentIndex = (index + total) % total;
        updateTrackPosition();
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    function switchCategory(categoryKey) {
        currentCategory = categoryKey;
        currentIndex = 0;
        buildSlides(categoryKey);
        updateTrackPosition();
        if (showcaseUrl) showcaseUrl.textContent = categories[categoryKey].url;
    }

    if (track && dotsWrap && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        tabButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                tabButtons.forEach((b) => {
                    b.classList.remove('is-active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('is-active');
                btn.setAttribute('aria-pressed', 'true');
                switchCategory(btn.dataset.view);
            });
        });
        let isHoveringShowcase = false;
        if (showcaseBody) {
            showcaseBody.addEventListener('mouseenter', () => { isHoveringShowcase = true; });
            showcaseBody.addEventListener('mouseleave', () => { isHoveringShowcase = false; });
        }
        document.addEventListener('keydown', (e) => {
            if (!isHoveringShowcase) return;
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });

        switchCategory('admin');
    }

    const copyBtn = document.getElementById('copy-btn');
    const copyLabel = document.getElementById('copy-label');

    const commandText = [
        'git clone https://github.com/m000gg/unit-billing.git',
        'cd unit-billing',
        'mvn spring-boot:run',
    ].join('\n');

    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(commandText);
            } catch (err) {
                const textarea = document.createElement('textarea');
                textarea.value = commandText;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }

            copyBtn.classList.add('copied');
            if (copyLabel) copyLabel.textContent = 'Copied';

            const icon = copyBtn.querySelector('i');
            if (icon) icon.setAttribute('data-lucide', 'check');
            if (window.lucide) lucide.createIcons();

            setTimeout(() => {
                copyBtn.classList.remove('copied');
                if (copyLabel) copyLabel.textContent = 'Copy';
                const icon2 = copyBtn.querySelector('i');
                if (icon2) icon2.setAttribute('data-lucide', 'copy');
                if (window.lucide) lucide.createIcons();
            }, 1800);
        });
    }

});