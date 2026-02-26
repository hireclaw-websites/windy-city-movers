/**
 * Windy City Movers - Main JavaScript
 * Handles mobile navigation, smooth scroll, quote calculator, and form handling
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileNav();
    initSmoothScroll();
    initQuoteCalculator();
    initContactForm();
    initScrollAnimations();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navCta = document.querySelector('.nav-cta');
    
    if (!hamburger) return;
    
    // Create mobile menu overlay
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = navLinks.innerHTML;
    
    // Add mobile menu styles
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
        .mobile-menu {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(26, 26, 26, 0.98);
            z-index: 999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        .mobile-menu.active {
            transform: translateX(0);
        }
        .mobile-menu a {
            color: white;
            font-family: 'Oswald', sans-serif;
            font-size: 1.5rem;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .mobile-menu a:hover {
            color: #B3DDF2;
        }
        .hamburger {
            z-index: 1001;
        }
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    `;
    document.head.appendChild(mobileStyles);
    document.body.appendChild(mobileMenu);
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Smooth Scroll for Navigation Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Quote Calculator
 */
function initQuoteCalculator() {
    const quoteForm = document.getElementById('quoteForm');
    const quoteResult = document.getElementById('quoteResult');
    const estimateRange = document.getElementById('estimateRange');
    
    if (!quoteForm) return;
    
    // Set minimum date to today
    const moveDateInput = document.getElementById('moveDate');
    if (moveDateInput) {
        const today = new Date().toISOString().split('T')[0];
        moveDateInput.setAttribute('min', today);
    }
    
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const moveType = document.getElementById('moveType').value;
        const homeSize = document.getElementById('homeSize').value;
        const services = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value);
        
        // Calculate estimate
        const estimate = calculateEstimate(moveType, homeSize, services);
        
        // Display result
        estimateRange.textContent = `$${estimate.min} - $${estimate.max}`;
        quoteResult.classList.remove('hidden');
        
        // Scroll to result
        quoteResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

/**
 * Calculate Moving Estimate
 */
function calculateEstimate(moveType, homeSize, services) {
    // Base rates by home size
    const baseRates = {
        studio: { min: 300, max: 450 },
        '1bed': { min: 450, max: 650 },
        '2bed': { min: 650, max: 950 },
        '3bed': { min: 950, max: 1400 },
        '4bed': { min: 1400, max: 2000 },
        office: { min: 800, max: 1500 }
    };
    
    // Multipliers by move type
    const moveTypeMultipliers = {
        local: 1,
        longdistance: 2.5,
        commercial: 1.8,
        storage: 0.6
    };
    
    // Service add-ons
    const serviceRates = {
        packing: 250,
        storage: 150,
        supplies: 100,
        specialty: 200
    };
    
    // Get base rate
    let base = baseRates[homeSize] || baseRates['2bed'];
    
    // Apply move type multiplier
    const multiplier = moveTypeMultipliers[moveType] || 1;
    let min = Math.round(base.min * multiplier);
    let max = Math.round(base.max * multiplier);
    
    // Add service costs
    services.forEach(service => {
        if (serviceRates[service]) {
            min += serviceRates[service];
            max += serviceRates[service];
        }
    });
    
    return { min, max };
}

/**
 * Book Move Function (called from quote result)
 */
function bookMove() {
    // Scroll to contact form
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show confirmation message
    showNotification('Thanks! Please fill out the contact form and we\'ll be in touch within 24 hours.', 'success');
}

/**
 * Contact Form Handler
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Validate
        if (!validateContactForm(data)) {
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.backgroundColor = '#22c55e';
            
            showNotification('Thank you! Your message has been sent. We\'ll contact you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button after delay
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        }, 1500);
    });
}

/**
 * Validate Contact Form
 */
function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter your full name');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.phone || !isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Please enter a message (at least 10 characters)');
    }
    
    if (errors.length > 0) {
        showNotification(errors[0], 'error');
        return false;
    }
    
    return true;
}

/**
 * Email validation
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Phone validation
 */
function isValidPhone(phone) {
    return /[\d\s\-\(\)\+]{10,}/.test(phone);
}

/**
 * Show Notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colors[type] || colors.info};
        color: white;
        padding: 16px 32px;
        border-radius: 8px;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    
    // Add animation keyframes if not present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideDown {
                from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.service-card, .testimonial-card, .about-content, .about-image'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Navbar scroll effect
 */
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});
