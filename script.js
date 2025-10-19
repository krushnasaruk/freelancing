// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual public key
})();

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Send email using EmailJS (you'll need to set up EmailJS account)
    // Replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', and 'YOUR_PUBLIC_KEY' with actual values
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formObject, 'YOUR_PUBLIC_KEY')
        .then(() => {
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        })
        .catch((error) => {
            showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .timeline-item, .contact-item, .stat-item');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e53e3e';
            isValid = false;
        } else {
            input.style.borderColor = '#e2e8f0';
        }
    });
    
    // Email validation
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailInput.style.borderColor = '#e53e3e';
            isValid = false;
        }
    }
    
    return isValid;
}

// Add real-time validation
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.style.borderColor = '#e53e3e';
            } else {
                input.style.borderColor = '#e2e8f0';
            }
        });
        
        input.addEventListener('input', () => {
            if (input.style.borderColor === 'rgb(229, 62, 62)') {
                input.style.borderColor = '#e2e8f0';
            }
        });
    });
});

// Smooth reveal animation for stats
function animateStats() {
    const stats = document.querySelectorAll('.stat-item h3');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/\D/g, ''));
        const suffix = stat.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + suffix;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current) + suffix;
            }
        }, 30);
    });
}

// Trigger stats animation when about section is visible
const aboutSection = document.querySelector('.about');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (aboutSection) {
    statsObserver.observe(aboutSection);
}

// Add hover effects for service cards
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add click-to-call functionality for phone numbers
document.addEventListener('DOMContentLoaded', () => {
    const phoneNumbers = document.querySelectorAll('a[href^="tel:"]');
    phoneNumbers.forEach(phone => {
        phone.addEventListener('click', (e) => {
            if (!confirm('Do you want to call this number?')) {
                e.preventDefault();
            }
        });
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Close notifications
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }
});

// Performance optimization: Lazy load images (if any are added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Welcome modal: show on first visit, then re-show after 3 refreshes (uses localStorage with cookie fallback)
document.addEventListener('DOMContentLoaded', function () {
    try {
        const modal = document.getElementById('welcomeModal');
        if (!modal) return;

        const EVER_KEY = 'welcome_ever_shown_v1';
        const COUNT_KEY = 'welcome_refresh_count_v1';
        const closeBtn = document.getElementById('welcomeClose');

        // helper storage with cookie fallback
        function storageGet(key) {
            try { return localStorage.getItem(key); } catch (e) {
                // cookie fallback
                const name = key + '=';
                const ca = document.cookie.split(';');
                for (let i = 0; i < ca.length; i++) {
                    let c = ca[i].trim();
                    if (c.indexOf(name) === 0) return decodeURIComponent(c.substring(name.length));
                }
                return null;
            }
        }
        function storageSet(key, value) {
            try { localStorage.setItem(key, value); } catch (e) {
                // cookie fallback (1 year)
                const d = new Date(); d.setTime(d.getTime() + (365*24*60*60*1000));
                document.cookie = key + '=' + encodeURIComponent(value) + ';path=/;expires=' + d.toUTCString();
            }
        }

        function showModal() {
            modal.setAttribute('aria-hidden', 'false');
            modal._timeout = setTimeout(hideModal, 3200);
        }

        function hideModal() {
            modal.setAttribute('aria-hidden', 'true');
            if (modal._timeout) { clearTimeout(modal._timeout); modal._timeout = null; }
            // After user sees modal, reset/clear counters so we don't show until threshold again
            try { storageSet(COUNT_KEY, '0'); } catch (e) { /* ignore */ }
        }

        // Get current state
        const everShown = storageGet(EVER_KEY);
        let count = parseInt(storageGet(COUNT_KEY) || '0', 10) || 0;

        if (!everShown) {
            // First visit: show immediately and mark as shown
            setTimeout(() => {
                showModal();
                try { storageSet(EVER_KEY, '1'); storageSet(COUNT_KEY, '0'); } catch (e) { /* ignore */ }
            }, 600);
        } else {
            // Increment refresh count and show when reaching threshold (3)
            count = count + 1;
            if (count >= 3) {
                setTimeout(() => { showModal(); }, 600);
                count = 0; // reset after showing
            }
            try { storageSet(COUNT_KEY, String(count)); } catch (e) { /* ignore */ }
        }

        if (closeBtn) closeBtn.addEventListener('click', hideModal);
        const backdrop = modal.querySelector('.welcome-modal__backdrop');
        if (backdrop) backdrop.addEventListener('click', hideModal);
    } catch (err) {
        console.error('Welcome modal error', err);
    }
});

// Site assistant bot: click avatar to open a short typed explanation
document.addEventListener('DOMContentLoaded', function () {
    try {
        const toggle = document.getElementById('siteBotToggle');
        const bubble = document.getElementById('siteBotBubble');
        const content = document.getElementById('siteBotContent');
        const closeBtn = document.getElementById('siteBotClose');
        if (!toggle || !bubble || !content) return;

        const messages = [
            'Hi — I\'m the assistant. This site showcases Dr. Manisha Choure\'s services in Obstetrics & Gynecology.',
            'Use the top navigation to jump to About, Services, Experience, or Contact sections.',
            'To book a consultation, go to the Contact section and send a message or use the email provided.'
        ];

        let msgIndex = 0;
        let typing = false;
        let clickCooldown = false;

        const HINT_KEY = 'sitebot_hint_shown_v1';
        const hintEl = document.getElementById('siteBotHint');

        // show hint only once (per localStorage), auto-hide after 6s
        (function showHintOnce() {
            try {
                const shown = (localStorage.getItem(HINT_KEY) === '1');
                if (hintEl && !shown) {
                    hintEl.style.opacity = '1';
                    setTimeout(() => {
                        hintEl.style.transition = 'opacity 400ms ease';
                        hintEl.style.opacity = '0';
                        try { localStorage.setItem(HINT_KEY, '1'); } catch (e) {}
                    }, 6000);
                } else if (hintEl) {
                    hintEl.style.display = 'none';
                }
            } catch (e) { if (hintEl) hintEl.style.display = 'none'; }
        })();

        function typeText(text, cb) {
            content.classList.add('typing');
            content.textContent = '';
            let i = 0;
            typing = true;
            const speed = 28; // ms per char
            const t = setInterval(() => {
                content.textContent += text.charAt(i);
                i++;
                if (i >= text.length) {
                    clearInterval(t);
                    content.classList.remove('typing');
                    typing = false;
                    if (cb) setTimeout(cb, 900);
                }
            }, speed);
        }

        function openBubble() {
            if (clickCooldown || typing) return; // prevent spam
            clickCooldown = true;
            toggle.classList.add('cooldown');
            setTimeout(() => { clickCooldown = false; toggle.classList.remove('cooldown'); }, 900);

            bubble.hidden = false;
            bubble.setAttribute('aria-hidden', 'false');
            // start typing current message
            typeText(messages[msgIndex], () => {
                // advance index for next open
                msgIndex = (msgIndex + 1) % messages.length;
            });
        }

        function closeBubble() {
            bubble.hidden = true;
            bubble.setAttribute('aria-hidden', 'true');
            content.textContent = '';
        }

        toggle.addEventListener('click', () => {
            if (clickCooldown) return; // ignore rapid clicks
            if (bubble.hidden) openBubble(); else closeBubble();
        });
        if (closeBtn) closeBtn.addEventListener('click', closeBubble);

        // small entrance animation on first load: pulse then bob will continue
        toggle.animate([{ transform: 'scale(0.95)' }, { transform: 'scale(1)' }], { duration: 380, easing: 'ease-out' });
    } catch (e) {
        console.error('Site bot init error', e);
    }
});