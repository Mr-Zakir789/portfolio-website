document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('main-header');
    const headerHeight = header ? header.offsetHeight : 70; // Use actual height or fallback

    // --- Smooth Scrolling for Nav Links ---
    const navLinks = document.querySelectorAll('.nav-link');
    const navMenu = document.querySelector('.nav-links');
    const hamburgerButton = document.getElementById('hamburger-button');
    const hamburgerIcon = hamburgerButton ? hamburgerButton.querySelector('i') : null;
        // --- Achievement Sliders Logic ---
        const achievementCarousels = document.querySelectorAll('.achievement-carousel-track');

        achievementCarousels.forEach(track => {
            const slides = Array.from(track.children);
            if (slides.length === 0) return; // Skip if no slides
    
            let slideWidth = slides[0].getBoundingClientRect().width;
            let currentIndex = 0;
            const intervalTime = 3000; // 3 seconds
            let slideInterval;
            const carouselContainer = track.closest('.achievement-carousel-container'); // Get parent container
    
            // Function to move to the next slide for THIS specific track
            const moveToNextSlide = () => {
                currentIndex++;
                if (currentIndex >= slides.length) {
                    currentIndex = 0; // Loop back
                }
                track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            };
    
            // Function to update slide width for THIS track
            const updateSlideWidth = () => {
                if (slides.length > 0) {
                    slideWidth = slides[0].getBoundingClientRect().width;
                    // Adjust position without transition during resize
                    track.style.transition = 'none';
                    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
                    // Re-enable transition after a short delay
                    setTimeout(() => {
                        track.style.transition = 'transform 0.5s ease-in-out';
                    }, 50);
                }
            };
    
            // Function to start the interval for THIS track
            const startCarousel = () => {
                clearInterval(slideInterval); // Clear existing interval if any
                slideInterval = setInterval(moveToNextSlide, intervalTime);
            };
    
            // Initial setup
            updateSlideWidth(); // Set initial position correctly
            startCarousel(); // Start the automatic scrolling
    
            // Optional: Pause on hover for THIS carousel
            if (carouselContainer) {
                carouselContainer.addEventListener('mouseenter', () => {
                    clearInterval(slideInterval);
                });
                carouselContainer.addEventListener('mouseleave', () => {
                    startCarousel(); // Restart interval
                });
            }
    
            // Recalculate slide width on window resize for THIS track
            // Note: A single resize listener handles all carousels by calling updateSlideWidth
            // which uses the correct 'slides' and 'track' from its closure.
            // We only need to add the listener once, but define updateSlideWidth per carousel.
            // A more optimized approach might use a single listener calling updates for all,
            // but this is simpler for demonstration.
            window.addEventListener('resize', updateSlideWidth);
    
        }); // End forEach achievementCarousels
    
    

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });

                    // Close mobile menu if open
                    if (navMenu && navMenu.classList.contains('active') && hamburgerButton && hamburgerIcon) {
                        navMenu.classList.remove('active');
                        hamburgerIcon.classList.replace('fa-times', 'fa-bars');
                        hamburgerButton.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    });

    // --- Active Nav Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('main section[id]');
    function setActiveLink() {
        let currentSectionId = 'hero';
        const scrollY = window.pageYOffset;
        const viewportHeight = window.innerHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                 currentSectionId = section.getAttribute('id');
            }
        });

         if ((scrollY + viewportHeight) >= document.body.offsetHeight - 100) {
            const lastSection = sections[sections.length - 1];
            if (lastSection) {
                 currentSectionId = lastSection.getAttribute('id');
            }
         }
         else if (scrollY < sections[0].offsetTop - headerHeight - 50) {
             currentSectionId = 'hero';
         }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', setActiveLink);
    setActiveLink(); // Initial call

    // --- Hamburger Menu Toggle ---
    if (hamburgerButton && navMenu && hamburgerIcon) {
        hamburgerButton.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isActive = navMenu.classList.contains('active');
            hamburgerButton.setAttribute('aria-expanded', isActive);
            hamburgerIcon.classList.replace(isActive ? 'fa-bars' : 'fa-times', isActive ? 'fa-times' : 'fa-bars');
        });
    }

    // --- Update Footer Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Tabbed Interface Logic ---
    const tabButtons = document.querySelectorAll('#experience-work .tab-button');
    const tabContents = document.querySelectorAll('#experience-work .tab-content');
    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTabId = button.getAttribute('data-tab');
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                const targetContent = document.getElementById(`tab-${targetTabId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // --- Carousel Logic Removed ---
    // No carousel in the restructured Interests & Recognition section.

    // --- Intersection Observer for Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if ("IntersectionObserver" in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -15% 0px',
            threshold: 0.1
        };
        const observerCallback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        };
        const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        animatedElements.forEach(el => scrollObserver.observe(el));
    } else {
        animatedElements.forEach(el => el.classList.add('is-visible')); // Fallback
    }

    // --- Contact Form Logic Removed ---

    // --- Initial Hero Animations Handled by CSS ---

}); // End DOMContentLoaded
