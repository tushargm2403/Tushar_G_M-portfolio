document.addEventListener('DOMContentLoaded', () => {

    // --- Dark/Light Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved user preference, if any, on load of the website
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // --- Scroll Events (Header, Progress Bar, Back to Top) ---
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Progress Bar
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = `${scrollPx / winHeightPx * 100}%`;
        scrollProgress.style.width = scrolled;

        // Back to Top Button
        if (window.scrollY > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }

        // Active Nav Link Update
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Intersection Observer for Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const skillBars = document.querySelectorAll('.progress');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // --- Special Observer for Skill Progress Bars ---
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
                skillsObserver.unobserve(bar);
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(bar => {
        skillsObserver.observe(bar);
    });

    // --- Typing Animation (using TypewriterJS) ---
    const typedTextElement = document.getElementById('typed-text');
    if (typedTextElement && typeof Typewriter !== 'undefined') {
        new Typewriter(typedTextElement, {
            strings: [
                'Business Analytics',
                'Data Science',
                'Business Intelligence'
            ],
            autoStart: true,
            loop: true,
            delay: 75,
            deleteSpeed: 50,
            cursor: '' // using custom css cursor
        });
    }

    // --- Form Submission Handling ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // We keep this to prevent page reload, but handle sending via Fetch
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;

            // 1. Change button to loading state
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            const data = new FormData(contactForm);

            try {
                // 2. Actually send the data to Formspree
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // 3. Formspree Success
                    submitBtn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
                    submitBtn.style.background = '#22c55e'; // Success green
                    contactForm.reset();
                } else {
                    // Formspree returned an error
                    submitBtn.innerHTML = 'Error! Try Again <i class="fas fa-times"></i>';
                    submitBtn.style.background = '#ef4444'; // Error red
                }
            } catch (error) {
                // Network error
                submitBtn.innerHTML = 'Error! Try Again <i class="fas fa-times"></i>';
                submitBtn.style.background = '#ef4444'; // Error red
            }

            // 4. Reset button back to normal after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });
    }

    // --- Project Modals ---
    const projectModal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalContent = document.getElementById('modal-content');
    const viewProjectBtns = document.querySelectorAll('.view-project-btn');

    const projectDetails = {
        'bcg': {
            title: 'BCG Strategy Consulting Simulation',
            desc: 'A comprehensive profitability analysis for a telecom client. This simulation involved breaking down revenue streams, identifying cost-saving opportunities, and presenting strategic recommendations to improve the bottom line in a highly competitive market.',
            tags: ['Profitability Analysis', 'Telecom Strategy', 'Excel', 'Consulting Frameworks']
        },
        'powerbi': {
            title: 'Power BI Text Analysis',
            desc: 'An advanced emotional analytics dashboard developed using Power BI. Extracted insights from large datasets of text to visualize sentiment, track emotional trends, and interpret user feedback for data-driven product improvements.',
            tags: ['Sentiment Visualization', 'Emotional Analytics', 'Power BI', 'DAX']
        },
        'tata': {
            title: 'TATA Data Visualization Simulation',
            desc: 'Built interactive executive dashboards and established a client questioning framework. Modeled business scenarios to provide clarity to stakeholders and facilitate high-level strategic decision-making.',
            tags: ['Executive Dashboards', 'Framework Design', 'Tableau', 'Data Storytelling']
        }
    };

    if (viewProjectBtns && projectModal) {
        viewProjectBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = btn.getAttribute('data-project');
                const project = projectDetails[projectId];

                if (project) {
                    const tagsHtml = project.tags.map(tag => `<span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; background: var(--bg-main); color: var(--accent); border-radius: 4px; font-weight: 500;">${tag}</span>`).join('');
                    modalContent.innerHTML = `
                        <div class="modal-content-inner">
                            <h3>${project.title}</h3>
                            <div class="project-tags" style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem;">
                                ${tagsHtml}
                            </div>
                            <p>${project.desc}</p>
                            <button class="btn btn-outline" onclick="document.getElementById('project-modal').classList.remove('active')">Close</button>
                        </div>
                    `;
                    projectModal.classList.add('active');
                }
            });
        });

        modalClose.addEventListener('click', () => {
            projectModal.classList.remove('active');
        });

        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('active');
            }
        });
    }
// --- LIVE ANALYTICS FLASHLIGHT ENGINE ---
    const canvas = document.getElementById('analytics-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let timeOffset = 0;

        // Make canvas fit the screen
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        // 1. Update the Flashlight position
        document.addEventListener('mousemove', (e) => {
            canvas.style.setProperty('--mouse-x', `${e.clientX}px`);
            canvas.style.setProperty('--mouse-y', `${e.clientY}px`);
        });

        // 2. Generate random "Data Metrics" that will float around
        const metrics = Array.from({ length: 40 }).map(() => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            value: Math.random() * 100,
            label: ['ACC', 'RMSE', 'LOSS', 'VAL', 'PRED', 'F1-SCORE'][Math.floor(Math.random() * 6)],
            speed: 0.2 + Math.random() * 0.5
        }));

        // 3. The Animation Loop
        function drawLiveAnalytics() {
            ctx.clearRect(0, 0, width, height);
            timeOffset += 1; // Controls the speed of the moving graphs

            // --- Draw Background Grid ---
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let x = 0; x < width; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
            for(let y = 0; y < height; y += 40) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
            ctx.stroke();

            // --- Draw Moving Line Graph 1 (Cyan) ---
            ctx.strokeStyle = '#00d2ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for(let x = 0; x < width; x += 10) {
                // Complex math to make it look like a real fluctuating data trend
                let y = (height * 0.4) + Math.sin((x + timeOffset) * 0.01) * 60 + Math.sin((x + timeOffset * 2) * 0.03) * 20;
                if(x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // --- Draw Moving Line Graph 2 (Blue) ---
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for(let x = 0; x < width; x += 15) {
                let y = (height * 0.6) + Math.cos((x - timeOffset * 0.8) * 0.008) * 80 + Math.sin(x * 0.05) * 10;
                if(x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // --- Draw Ticking Data Metrics ---
            ctx.font = '11px "Courier New", monospace';
            metrics.forEach(m => {
                // Randomly tick the numbers up and down slightly
                if(Math.random() > 0.8) m.value += (Math.random() - 0.5) * 2;
                
                // Slowly drift the numbers to the left
                m.x -= m.speed;
                if (m.x < -100) m.x = width + 50; // Loop back to the right side

                // Draw the text
                ctx.fillStyle = '#00d2ff';
                ctx.fillText(`${m.label}: ${m.value.toFixed(2)}`, m.x, m.y);
                
                // Draw a small node dot next to the text
                ctx.fillStyle = '#3b82f6';
                ctx.beginPath();
                ctx.arc(m.x - 10, m.y - 4, 2, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(drawLiveAnalytics);
        }
        
        drawLiveAnalytics();
    }
// --- Fix: Make Back-to-Top Button Work ---
    const topBtn = document.getElementById('back-to-top');
    if (topBtn) {
        topBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Stops the default jumpy behavior
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Glides smoothly to the top
            });
        });
    }

// --- HUD Language Ring Animation ---
    const langRings = document.querySelectorAll('.ring-progress');
    
    if ('IntersectionObserver' in window) {
        const langObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const circle = entry.target;
                    const target = parseInt(circle.getAttribute('data-target'));
                    const circumference = 251.2; // 2 * pi * r (r is 40)
                    
                    // 1. Animate the glowing line
                    const offset = circumference - (target / 100) * circumference;
                    circle.style.strokeDashoffset = offset;
                    
                    // 2. Animate the number counting up
                    const percentText = circle.closest('.lang-ring-container').querySelector('.lang-percent');
                    let current = 0;
                    const speed = 20; // Lower is faster
                    const increment = target / (1500 / speed); // Syncs roughly with 1.5s CSS animation
                    
                    const updateCounter = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            percentText.innerText = target;
                            clearInterval(updateCounter);
                        } else {
                            percentText.innerText = Math.ceil(current);
                        }
                    }, speed);
                    
                    langObserver.unobserve(circle); // Only animate once!
                }
            });
        }, { threshold: 0.5 }); // Triggers when the card is 50% visible

        langRings.forEach(ring => langObserver.observe(ring));
    }
});
