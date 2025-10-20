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

        const messages = {
            en: [
                'Hi — I\'m the assistant. This site showcases Dr. Manisha Choure\'s services in Obstetrics & Gynecology.',
                'Use the top navigation to jump to About, Services, Experience, or Contact sections.',
                'To book a consultation, go to the Contact section and send a message or use the email provided.'
            ],
            mr: [
                'नमस्कार — मी सहाय्यक आहे. हे संकेतस्थळ डॉ. मनीषा चौरे यांच्या प्रसूती व स्त्रीरोग सेवा दर्शवते.',
                'माहिती, सेवा, अनुभव किंवा संपर्क विभागांमध्ये जाण्यासाठी वरील नेव्हिगेशन वापरा.',
                'सल्ला-मसलतीसाठी, संपर्क विभागात जा आणि संदेश पाठवा किंवा दिलेला ईमेल वापरा.'
            ]
        };

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
            // Get current language and corresponding messages
            const currentLang = localStorage.getItem('siteLang') || 'en';
            const currentMessages = messages[currentLang];
            // start typing current message
            typeText(currentMessages[msgIndex], () => {
                // advance index for next open
                msgIndex = (msgIndex + 1) % currentMessages.length;
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

// Experience section: swap text for video on hover
document.addEventListener('DOMContentLoaded', function () {
    var expItems = document.querySelectorAll('.timeline-item');
    expItems.forEach(function(item) {
        var text = item.querySelector('.exp-text');
        var video = item.querySelector('.exp-video');
        if (!text || !video) return;
        item.addEventListener('mouseenter', function() {
            // Hide all videos/texts except for this item
            expItems.forEach(function(other) {
                var otherText = other.querySelector('.exp-text');
                var otherVideo = other.querySelector('.exp-video');
                if (other !== item) {
                    if (otherVideo) { otherVideo.pause(); otherVideo.style.display = 'none'; }
                    if (otherText) { otherText.style.display = 'block'; }
                }
            });
            text.style.display = 'none';
            video.style.display = 'block';
            video.currentTime = 0;
            video.play();
        });
        item.addEventListener('mouseleave', function() {
            video.pause();
            video.style.display = 'none';
            text.style.display = 'block';
        });
    });
});

// Language toggle logic
document.addEventListener('DOMContentLoaded', function () {
    const langToggle = document.getElementById('langToggle');
    if (!langToggle) return;

    // English and Marathi translations for major site text
    const translations = {
        en: {
            nav: ["Home", "About", "Services", "Experience", "Reviews", "Contact"],
            heroTitle: "Dr. Manisha Choure",
            heroSubtitle: "Consultant, Obstetrics & Gynecology",
            heroDesc: "Dedicated and compassionate Consultant in the Department of Obstetrics and Gynecology at Vishwaraj Hospital, Loni Kalbhor, Pune.<br>Committed to women’s health and well-being, providing comprehensive care across all stages of life — from adolescence to motherhood and menopause.<br>Blending modern medical expertise with personalized attention for every patient.",
            heroBtn1: "Book Appointment",
            heroBtn2: "Learn More",
            aboutHeader: "About Dr. Manisha Choure",
            aboutSub: "Dedicated to women’s health and well-being at every stage of life",
            aboutProf: "Professional Background",
            aboutP1: "Dr. Manisha Choure is a Consultant in Obstetrics and Gynecology at Vishwaraj Hospital, Loni Kalbhor, Pune. She is known for her compassionate approach and commitment to providing the highest quality of care to women from adolescence through menopause.",
            aboutP2: "Her expertise covers antenatal and postnatal care, high-risk pregnancy management, gynecological consultations, infertility evaluation, and minimally invasive surgery. She believes in blending modern medical science with personalized attention for every patient.",
            cred1: "MBBS, DGO",
            cred2: "Consultant, Vishwaraj Hospital",
            cred3: "Specialist in Obstetrics & Gynecology",
            stat1: "Years Experience",
            stat2: "Deliveries & Surgeries",
            stat3: "Patient Satisfaction",
            stat4: "Emergency Support",
            servicesHeader: "Services",
            servicesSub: "Comprehensive care for women’s health at every stage",
            serv1: ["Antenatal & Postnatal Care", "Complete pregnancy check-ups, fetal monitoring, and post-delivery support for mother and baby."],
            serv2: ["Normal & High-Risk Pregnancy", "Expert management for both routine and complex pregnancies, ensuring safety for mother and child."],
            serv3: ["Gynecological Consultations", "Diagnosis and treatment for menstrual irregularities, PCOS, infections, and hormonal issues."],
            serv4: ["Infertility Evaluation & Treatment", "Guidance and management for couples seeking to conceive, with a sensitive and supportive approach."],
            serv5: ["Laparoscopic & Minimally Invasive Surgery", "Safe and effective procedures for a range of gynecological conditions, promoting faster recovery."],
            serv6: ["Adolescent & Menopausal Health", "Counseling and management for changing hormonal needs, from teenage years to menopause."],
            expHeader: "Experience",
            expSub: "Extensive clinical experience in obstetrics and gynecology",
            exp1: ["Consultant, Obstetrics & Gynecology", "Vishwaraj Hospital, Loni Kalbhor, Pune", "Present", "Managing both routine and high-risk pregnancies, gynecological surgeries, and emergency cases with a patient-first philosophy. Combines advanced medical technology with compassionate, evidence-based care."],
            exp2: ["Senior Resident, OBGY", "Reputed Hospitals, Pune", "2015 - 2022", "Handled numerous deliveries, complex surgical procedures, and provided emergency care. Recognized for patient-centered approach and clinical excellence."],
            exp3: ["Medical Officer", "Government Health Services", "2012 - 2015", "Served in rural and urban healthcare settings, delivering essential women’s health services and community outreach."],
            contactHeader: "Contact",
            contactSub: "Get in touch or schedule your consultation",
            contact1: ["Hospital", "Vishwaraj Hospital, Loni Kalbhor, Pune"],
            contact2: ["Email", "manishachoure2024@gmail.com"],
            contact3: ["Consultation", "Available by appointment"],
            contact4: ["Timings", "As per hospital schedule"],
            formLabels: ["Full Name", "Email Address", "Phone Number", "Subject", "Select a subject", "Schedule Consultation", "Follow-up Appointment", "General Question", "Urgent Medical Question", "Message", "Send Message"],
            footerTitle: "Dr. Manisha Choure",
            footerDesc: "Empowering women’s health with compassion, expertise, and modern care.",
            quickLinks: "Quick Links",
            quickLinksList: ["Home", "About", "Services", "Contact"],
            servLinks: "Services",
            servLinksList: ["Antenatal & Postnatal Care", "High-Risk Pregnancy", "Gynecological Consultations", "Infertility Treatment"],
            contactInfo: "Contact Info",
            contactInfoList: ["Vishwaraj Hospital, Loni Kalbhor, Pune", "manishachoure2024@gmail.com"],
            copyright: "© 2025 Dr. Manisha Choure. All rights reserved.",
            welcomeTitle: "Welcome to Dr. Manisha Choure's Clinic",
            welcomeMsg: "Welcome — we're glad you're here. Explore services, book an appointment, or contact us for questions."
        },
        mr: {
            nav: ["मुख्यपृष्ठ", "माहिती", "सेवा", "अनुभव", "रुग्ण अभिप्राय", "संपर्क"],
            heroTitle: "डॉ. मनीषा चौरे",
            heroSubtitle: "सल्लागार, प्रसूती व स्त्रीरोग",
            heroDesc: "विष्वराज हॉस्पिटल, लोणी काळभोर, पुणे येथे प्रसूती व स्त्रीरोग विभागातील समर्पित आणि सहानुभूतीपूर्ण सल्लागार.<br>महिलांच्या आरोग्यासाठी आणि कल्याणासाठी वचनबद्ध, किशोरवयीन ते मातृत्व आणि रजोनिवृत्तीपर्यंत सर्व टप्प्यांवर व्यापक काळजी.<br>प्रत्येक रुग्णासाठी वैयक्तिक लक्षासह आधुनिक वैद्यकीय कौशल्याचा संगम.",
            heroBtn1: "अपॉइंटमेंट बुक करा",
            heroBtn2: "अधिक जाणून घ्या",
            aboutHeader: "डॉ. मनीषा चौरे यांची माहिती",
            aboutSub: "प्रत्येक टप्प्यावर महिलांच्या आरोग्यासाठी समर्पित",
            aboutProf: "व्यावसायिक पार्श्वभूमी",
            aboutP1: "डॉ. मनीषा चौरे या विष्वराज हॉस्पिटल, लोणी काळभोर, पुणे येथे प्रसूती व स्त्रीरोग विभागातील सल्लागार आहेत. किशोरवयीन ते रजोनिवृत्तीपर्यंत महिलांना उच्च दर्जाची काळजी देण्याच्या वचनबद्धतेसाठी प्रसिद्ध आहेत.",
            aboutP2: "त्यांचा अनुभव गर्भधारणेपूर्व व नंतरची काळजी, उच्च-जोखमीची गर्भधारणा, स्त्रीरोग सल्लामसलत, वंध्यत्व मूल्यांकन आणि मिनिमली इनवेसिव्ह शस्त्रक्रिया यामध्ये आहे. प्रत्येक रुग्णासाठी वैयक्तिक लक्षासह आधुनिक वैद्यकीय विज्ञानाचा संगम मानतात.",
            cred1: "MBBS, DGO",
            cred2: "सल्लागार, विष्वराज हॉस्पिटल",
            cred3: "प्रसूती व स्त्रीरोग विशेषज्ञ",
            stat1: "वर्षांचा अनुभव",
            stat2: "डिलिव्हरी व शस्त्रक्रिया",
            stat3: "रुग्ण समाधान",
            stat4: "२४/७ आपत्कालीन सेवा",
            servicesHeader: "सेवा",
            servicesSub: "प्रत्येक टप्प्यावर महिलांच्या आरोग्यासाठी व्यापक काळजी",
            serv1: ["गर्भधारणेपूर्व व नंतरची काळजी", "पूर्ण गर्भधारणा तपासणी, भ्रूण निरीक्षण आणि प्रसूतीनंतर आई व बाळासाठी सहाय्य."],
            serv2: ["सामान्य व उच्च-जोखमीची गर्भधारणा", "सर्वसाधारण व गुंतागुंतीच्या गर्भधारणेचे तज्ज्ञ व्यवस्थापन, आई व बाळासाठी सुरक्षितता."],
            serv3: ["स्त्रीरोग सल्लामसलत", "मासिक पाळीतील अनियमितता, PCOS, संसर्ग व हार्मोनल समस्या यांचे निदान व उपचार."],
            serv4: ["वंध्यत्व मूल्यांकन व उपचार", "गर्भधारणेची इच्छा असलेल्या जोडप्यांसाठी मार्गदर्शन व व्यवस्थापन, संवेदनशील व सहानुभूतीपूर्ण दृष्टिकोन."],
            serv5: ["लॅपरोस्कोपिक व मिनिमली इनवेसिव्ह शस्त्रक्रिया", "स्त्रीरोगाच्या विविध स्थितीसाठी सुरक्षित व प्रभावी शस्त्रक्रिया, जलद पुनर्प्राप्तीसाठी."],
            serv6: ["किशोरवयीन व रजोनिवृत्ती आरोग्य", "किशोरवयीन ते रजोनिवृत्तीपर्यंत बदलत्या हार्मोनल गरजांसाठी सल्ला व व्यवस्थापन."],
            expHeader: "अनुभव",
            expSub: "प्रसूती व स्त्रीरोग क्षेत्रातील व्यापक अनुभव",
            exp1: ["सल्लागार, प्रसूती व स्त्रीरोग", "विष्वराज हॉस्पिटल, लोणी काळभोर, पुणे", "सद्यस्थिती", "सामान्य व उच्च-जोखमीच्या गर्भधारणा, स्त्रीरोग शस्त्रक्रिया व आपत्कालीन प्रकरणांचे व्यवस्थापन. आधुनिक वैद्यकीय तंत्रज्ञानासह सहानुभूतीपूर्ण, पुराव्यावर आधारित काळजी."],
            exp2: ["वरिष्ठ निवासी, OBGY", "प्रसिद्ध हॉस्पिटल्स, पुणे", "२०१५ - २०२२", "अनेक डिलिव्हरी, गुंतागुंतीच्या शस्त्रक्रिया व आपत्कालीन सेवा हाताळल्या. रुग्ण-केंद्रित दृष्टिकोन व उत्कृष्टतेसाठी ओळख."],
            exp3: ["वैद्यकीय अधिकारी", "शासकीय आरोग्य सेवा", "२०१२ - २०१५", "ग्रामीण व शहरी आरोग्य क्षेत्रात सेवा दिली, महिलांच्या आरोग्य सेवा व समुदाय पोहोच."],
            contactHeader: "संपर्क",
            contactSub: "संपर्क साधा किंवा आपली भेट निश्चित करा",
            contact1: ["हॉस्पिटल", "विष्वराज हॉस्पिटल, लोणी काळभोर, पुणे"],
            contact2: ["ईमेल", "manishachoure2024@gmail.com"],
            contact3: ["सल्लामसलत", "अपॉइंटमेंटद्वारे उपलब्ध"],
            contact4: ["वेळ", "हॉस्पिटल वेळापत्रकानुसार"],
            formLabels: ["पूर्ण नाव", "ईमेल पत्ता", "फोन नंबर", "विषय", "विषय निवडा", "अपॉइंटमेंट निश्चित करा", "फॉलो-अप अपॉइंटमेंट", "सामान्य प्रश्न", "तातडीचा वैद्यकीय प्रश्न", "संदेश", "संदेश पाठवा"],
            footerTitle: "डॉ. मनीषा चौरे",
            footerDesc: "सहानुभूती, कौशल्य व आधुनिक काळजीसह महिलांच्या आरोग्यासाठी समर्पित.",
            quickLinks: "द्रुत दुवे",
            quickLinksList: ["मुख्यपृष्ठ", "माहिती", "सेवा", "संपर्क"],
            servLinks: "सेवा",
            servLinksList: ["गर्भधारणेपूर्व व नंतरची काळजी", "उच्च-जोखमीची गर्भधारणा", "स्त्रीरोग सल्लामसलत", "वंध्यत्व उपचार"],
            contactInfo: "संपर्क माहिती",
            contactInfoList: ["विष्वराज हॉस्पिटल, लोणी काळभोर, पुणे", "manishachoure2024@gmail.com"],
            copyright: "© २०२५ डॉ. मनीषा चौरे. सर्व हक्क राखीव.",
            welcomeTitle: "डॉ. मनीषा चौरे यांच्या क्लिनिकमध्ये स्वागत आहे",
            welcomeMsg: "स्वागत आहे — आम्ही आनंदी आहोत की आपण येथे आहात. सेवा एक्सप्लोर करा, अपॉइंटमेंट बुक करा किंवा प्रश्नांसाठी संपर्क साधा."
        }
    };

    // Add reviews translations
    translations.en.reviewsHeader = "Patient Reviews";
    translations.en.reviewsSub = "Real experiences from patients — hover a review to watch a short video.";
    translations.en.review1Text = '"Dr. Choure provided exceptional care during my pregnancy. The whole team was supportive and professional."';
    translations.en.review1Author = '— Sneha P.';
    translations.en.review2Text = '"I felt heard and well taken care of. The surgery went smoothly and I recovered quickly."';
    translations.en.review2Author = '— Priya K.';
    translations.en.review3Text = '"Professional, compassionate, and very knowledgeable. Highly recommend for women\'s health."';
    translations.en.review3Author = '— Anjali R.';

    translations.mr.reviewsHeader = "रुग्ण अभिप्राय";
    translations.mr.reviewsSub = "रुग्णांचे प्रत्यक्ष अनुभव — एका रिव्ह्यूवर होवर करा आणि संक्षिप्त व्हिडिओ पहा.";
    translations.mr.review1Text = '"माझ्या गर्भधारणेदरम्यान डॉ. चौरे यांनी उत्तम काळजी घेतली. संपूर्ण टीम समर्थक आणि व्यावसायिक होती."';
    translations.mr.review1Author = '— Sneha P.';
    translations.mr.review2Text = '"मला ऐकण्यात आले आणि मला चांगली काळजी मिळाली. शस्त्रक्रिया सुरळीत झाली आणि मी लवकर बरे झाले."';
    translations.mr.review2Author = '— Priya K.';
    translations.mr.review3Text = '"व्यावसायिक, सहानुभूतीपूर्ण आणि अत्यंत ज्ञानसम्पन्न. महिला आरोग्यासाठी अत्यंत शिफारसीय."';
    translations.mr.review3Author = '— Anjali R.';

    // Helper to set text content or innerHTML
    function setText(selector, value, html=false) {
        const el = document.querySelector(selector);
        if (el) html ? el.innerHTML = value : el.textContent = value;
    }

    function setAllText(lang) {
        const t = translations[lang];
        // Navbar
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((el, i) => { if (t.nav[i]) el.textContent = t.nav[i]; });
        // Hero
        setText('.hero-title', t.heroTitle);
        setText('.hero-subtitle', t.heroSubtitle);
        setText('.hero-description', t.heroDesc, true);
        setText('.btn-primary', t.heroBtn1);
        setText('.btn-secondary', t.heroBtn2);
        // About
        setText('#about .section-header h2', t.aboutHeader);
        setText('#about .section-header p', t.aboutSub);
        setText('.about-text h3', t.aboutProf);
        setText('.about-text p:nth-of-type(1)', t.aboutP1);
        setText('.about-text p:nth-of-type(2)', t.aboutP2);
        const creds = document.querySelectorAll('.credential-item span');
        creds.forEach((el, i) => { if (t[`cred${i+1}`]) el.textContent = t[`cred${i+1}`]; });
        // Stats
        const stats = document.querySelectorAll('.stat-item p');
        stats.forEach((el, i) => { if (t[`stat${i+1}`]) el.textContent = t[`stat${i+1}`]; });
        // About stats numbers (keep numbers, just update label)
        // Services
        setText('#services .section-header h2', t.servicesHeader);
        setText('#services .section-header p', t.servicesSub);
        const servCards = document.querySelectorAll('.service-card');
        servCards.forEach((card, i) => {
            const h3 = card.querySelector('h3');
            const p = card.querySelector('p');
            if (t[`serv${i+1}`]) {
                h3.textContent = t[`serv${i+1}`][0];
                p.textContent = t[`serv${i+1}`][1];
            }
        });
        // Experience
        setText('#experience .section-header h2', t.expHeader);
        setText('#experience .section-header p', t.expSub);
        const expItems = document.querySelectorAll('.timeline-item');
        expItems.forEach((item, i) => {
            const h3 = item.querySelector('h3');
            const h4 = item.querySelector('h4');
            const date = item.querySelector('.timeline-date');
            const text = item.querySelector('.exp-text');
            if (t[`exp${i+1}`]) {
                h3.textContent = t[`exp${i+1}`][0];
                h4.textContent = t[`exp${i+1}`][1];
                date.textContent = t[`exp${i+1}`][2];
                text.textContent = t[`exp${i+1}`][3];
            }
        });
        // Contact
        setText('#contact .section-header h2', t.contactHeader);
        setText('#contact .section-header p', t.contactSub);
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach((item, i) => {
            const h3 = item.querySelector('h3');
            const p = item.querySelector('p');
            if (t[`contact${i+1}`]) {
                h3.textContent = t[`contact${i+1}`][0];
                p.textContent = t[`contact${i+1}`][1];
            }
        });
        // Contact form labels
        const formLabels = t.formLabels;
        const form = document.getElementById('contactForm');
        if (form) {
            const labels = form.querySelectorAll('label');
            labels.forEach((el, i) => { if (formLabels[i]) el.textContent = formLabels[i]; });
            const selects = form.querySelectorAll('select');
            selects.forEach((sel) => {
                const opts = sel.querySelectorAll('option');
                opts.forEach((opt, i) => { if (formLabels[4+i]) opt.textContent = formLabels[4+i]; });
            });
            const btn = form.querySelector('button[type="submit"]');
            if (btn) btn.textContent = formLabels[10];
        }
        // Footer
        setText('.footer-section h3', t.footerTitle);
        setText('.footer-section p', t.footerDesc);
        setText('.footer-section h4', t.quickLinks);
        const quickLinks = document.querySelectorAll('.footer-section ul:nth-of-type(1) li a');
        quickLinks.forEach((el, i) => { if (t.quickLinksList[i]) el.textContent = t.quickLinksList[i]; });
        setText('.footer-section:nth-of-type(2) h4', t.servLinks);
        const servLinks = document.querySelectorAll('.footer-section:nth-of-type(2) ul li a');
        servLinks.forEach((el, i) => { if (t.servLinksList[i]) el.textContent = t.servLinksList[i]; });
        setText('.footer-section:nth-of-type(3) h4', t.contactInfo);
        const contactInfoPs = document.querySelectorAll('.footer-section:nth-of-type(3) p');
        contactInfoPs.forEach((el, i) => { if (t.contactInfoList[i]) el.textContent = t.contactInfoList[i]; });
        setText('.footer-bottom p', t.copyright);
        // Welcome modal
        setText('#welcomeTitle', t.welcomeTitle);
        setText('#welcomeModal .welcome-modal__dialog p', t.welcomeMsg);
        // Reviews section
        setText('#reviews .section-header h2', t.reviewsHeader);
        setText('#reviews .section-header p', t.reviewsSub);
        const reviewItems = document.querySelectorAll('.review-item');
        if (reviewItems && reviewItems.length >= 3) {
            const r1 = reviewItems[0].querySelector('.review-text p');
            const a1 = reviewItems[0].querySelector('.review-author');
            const r2 = reviewItems[1].querySelector('.review-text p');
            const a2 = reviewItems[1].querySelector('.review-author');
            const r3 = reviewItems[2].querySelector('.review-text p');
            const a3 = reviewItems[2].querySelector('.review-author');
            if (r1) r1.textContent = t.review1Text || r1.textContent;
            if (a1) a1.textContent = t.review1Author || a1.textContent;
            if (r2) r2.textContent = t.review2Text || r2.textContent;
            if (a2) a2.textContent = t.review2Author || a2.textContent;
            if (r3) r3.textContent = t.review3Text || r3.textContent;
            if (a3) a3.textContent = t.review3Author || a3.textContent;
        }
        // Toggle button text
        langToggle.textContent = lang === 'en' ? 'मराठी' : 'English';
    }

    // Detect language from localStorage or default to English
    let currentLang = localStorage.getItem('siteLang') || 'en';
    setAllText(currentLang);

    langToggle.addEventListener('click', function () {
        currentLang = currentLang === 'en' ? 'mr' : 'en';
        localStorage.setItem('siteLang', currentLang);
        setAllText(currentLang);
    });
});

// Patient reviews: hover to play video
document.addEventListener('DOMContentLoaded', function () {
    try {
        const reviewItems = document.querySelectorAll('.review-item');
        if (!reviewItems || reviewItems.length === 0) return;

        reviewItems.forEach(item => {
            const video = item.querySelector('.review-video');
            const text = item.querySelector('.review-text');
            if (!video || !text) return;

            // Ensure videos don't autoplay sound
            video.muted = true;

            function enter() {
                item.classList.add('playing');
                text.style.opacity = '0';
                video.style.display = 'block';
                // try to play, ignore promise rejection in some browsers
                const p = video.play();
                if (p && p.catch) p.catch(() => {});
            }

            function leave() {
                item.classList.remove('playing');
                text.style.opacity = '';
                try { video.pause(); video.currentTime = 0; } catch (e) {}
                video.style.display = 'none';
            }

            item.addEventListener('mouseenter', enter);
            item.addEventListener('focus', enter);
            item.addEventListener('mouseleave', leave);
            item.addEventListener('blur', leave);
            // touch support: tap toggles play/pause
            item.addEventListener('click', (e) => {
                if (video.style.display === 'block') leave(); else enter();
            });
        });
    } catch (err) { console.error('Reviews init error', err); }
});