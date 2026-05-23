document.addEventListener('DOMContentLoaded', () => {
    
    /* -------------------------------------------------------------------------- */
    /*  1. NAVBAR SCROLL EFFECT                                                   */
    /* -------------------------------------------------------------------------- */
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* -------------------------------------------------------------------------- */
    /*  2. MOBILE MENU TOGGLE                                                     */
    /* -------------------------------------------------------------------------- */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('burger-active');
        });

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('burger-active');
            });
        });
    }

    /* -------------------------------------------------------------------------- */
    /*  3. SCROLL PROGRESS BAR                                                    */
    /* -------------------------------------------------------------------------- */
    const scrollProgress = document.getElementById('scroll-progress');
    
    window.addEventListener('scroll', () => {
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / height) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = `${scrolled}%`;
        }
    });

    /* -------------------------------------------------------------------------- */
    /*  4. ACTIVE NAV LINK ON SCROLL                                              */
    /* -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    
    const navObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.35 // Trigger when 35% of the section is visible
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                const currentActive = document.querySelector('.nav-link.active');
                const targetLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                
                if (currentActive && targetLink) {
                    currentActive.classList.remove('active');
                    targetLink.classList.add('active');
                }
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    /* -------------------------------------------------------------------------- */
    /*  5. SCROLL ENTRY ANIMATIONS (REVEAL ON SCROLL)                            */
    /* -------------------------------------------------------------------------- */
    const animScrollElements = document.querySelectorAll('.animate-on-scroll');
    
    const entryObserverOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px', // Trigger slightly before element enters view
        threshold: 0.1
    };

    const entryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once it animates, we don't need to observe it anymore
                entryObserver.unobserve(entry.target);
            }
        });
    }, entryObserverOptions);

    animScrollElements.forEach(element => {
        entryObserver.observe(element);
    });

    /* -------------------------------------------------------------------------- */
    /*  6. ANIMATED STATISTICS COUNTERS                                           */
    /* -------------------------------------------------------------------------- */
    const statsStrip = document.querySelector('.stats-strip');
    const statItems = document.querySelectorAll('.stat-item');
    let countersAnimated = false;

    const animateCounters = () => {
        statItems.forEach(item => {
            const numElement = item.querySelector('.stat-number');
            const target = parseInt(item.getAttribute('data-target'), 10);
            const suffix = item.getAttribute('data-suffix') || '';
            
            let start = 0;
            // Scale duration based on number size
            const duration = 2000; // 2 seconds
            const stepTime = Math.max(Math.floor(duration / (target > 1000 ? 100 : target)), 15);
            
            const timer = setInterval(() => {
                if (target > 1000) {
                    // For large numbers (e.g. 90K community), increment in larger blocks
                    start += Math.ceil(target / 40);
                    if (start >= target) {
                        start = target;
                        clearInterval(timer);
                    }
                    // Format output
                    const formatted = (start / 1000).toFixed(0);
                    numElement.textContent = formatted + suffix;
                } else {
                    // For standard smaller counters
                    start += 1;
                    if (start >= target) {
                        start = target;
                        clearInterval(timer);
                    }
                    numElement.textContent = start + suffix;
                }
            }, stepTime);
        });
    };

    if (statsStrip) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    animateCounters();
                    countersAnimated = true;
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of stats strip is in view

        statsObserver.observe(statsStrip);
    }

    /* -------------------------------------------------------------------------- */
    /*  7. CONTACT FORM HANDLER WITH SUCCESS MODAL                                */
    /* -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('portfolio-contact-form');
    const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
    const submitBtnText = submitBtn ? submitBtn.querySelector('#btn-submit-text') : null;
    const successModal = document.getElementById('success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Set loading state on button
            const originalText = submitBtnText.textContent;
            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.opacity = '0.8';
            submitBtnText.textContent = 'Sending Message...';
            
            // Mock server send with timeout
            setTimeout(() => {
                // Show success modal
                if (successModal) {
                    successModal.classList.add('active');
                }
                
                // Reset button state
                submitBtn.style.pointerEvents = 'all';
                submitBtn.style.opacity = '1';
                submitBtnText.textContent = originalText;
                
                // Clear the form fields
                contactForm.reset();
            }, 1500);
        });
    }

    // Modal Close behavior
    if (successModal && modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });

        // Close on clicking outside the modal box
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }

});
