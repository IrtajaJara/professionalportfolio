// ============================================
// EMAILJS CONFIGURATION
// ============================================
const EMAILJS_PUBLIC_KEY = "cBIXq1Acx1RmjbGO6";
const EMAILJS_SERVICE_ID = "service_hwtb6sg";
const EMAILJS_TEMPLATE_ID = "template_j86ztqc";

emailjs.init(EMAILJS_PUBLIC_KEY);

// ============================================
// PRELOADER
// ============================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1000);
});

// ============================================
// DARK MODE
// ============================================
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    if (body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// ============================================
// MOBILE MENU
// ============================================
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });
}
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
});

// ============================================
// ACTIVE NAV LINK
// ============================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============================================
// TYPING EFFECT
// ============================================
const typingElement = document.querySelector('.typing-text');
if (typingElement) {
    const texts = ['Full Stack Developer', 'Software Engineer', 'MERN Stack Expert', 'Cloud Architect', 'VoIP Expert'];
    let textIndex = 0, charIndex = 0, isDeleting = false;
    function typeEffect() {
        const currentText = texts[textIndex];
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
            return;
        }
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        setTimeout(typeEffect, isDeleting ? 80 : 120);
    }
    typeEffect();
}

// ============================================
// COUNTER ANIMATION
// ============================================
const statNumbers = document.querySelectorAll('.stat-number');
const animateNumbers = () => {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const rect = stat.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100 && !stat.classList.contains('animated')) {
            stat.classList.add('animated');
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + '+';
                }
            }, 20);
        }
    });
};
window.addEventListener('scroll', animateNumbers);
animateNumbers();

// ============================================
// CONTACT FORM WITH EMAILJS
// ============================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        if (!name || !email || !message) {
            showToast('❌ Please fill all fields', '#ef4444');
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showToast('❌ Please enter a valid email', '#ef4444');
            return;
        }
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        try {
            const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                from_name: name, 
                from_email: email, 
                message: message, 
                to_email: "irtajajara@gmail.com"
            });
            if (response.status === 200) {
                showToast('✅ Message sent! I will contact you soon.', '#10b981');
                contactForm.reset();
            }
        } catch (error) {
            console.error('Email Error:', error);
            showToast('❌ Failed to send. Please try again.', '#ef4444');
        } finally {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }
    });
}

// ============================================
// FIREBASE AUTHENTICATION (Already Configured)
// ============================================

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const profileModal = document.getElementById('profileModal');
const userIcon = document.getElementById('userIcon');
const userNameSpan = document.getElementById('userName');

let currentUser = null;

function isFirebaseReady() {
    return typeof window.auth !== 'undefined' && window.auth;
}

function initAuthListener() {
    if (!isFirebaseReady()) {
        setTimeout(initAuthListener, 500);
        return;
    }
    
    window.onAuthStateChanged(window.auth, async (user) => {
        if (user) {
            currentUser = user;
            try {
                const userDoc = await window.getDoc(window.doc(window.db, "users", user.uid));
                const userData = userDoc.data();
                loginBtn.style.display = 'none';
                userIcon.style.display = 'flex';
                userNameSpan.textContent = userData?.name?.split(' ')[0] || user.email.split('@')[0];
            } catch (error) {
                loginBtn.style.display = 'none';
                userIcon.style.display = 'flex';
                userNameSpan.textContent = user.email.split('@')[0];
            }
        } else {
            currentUser = null;
            loginBtn.style.display = 'flex';
            userIcon.style.display = 'none';
        }
    });
}

async function signUp(email, password, name) {
    if (!isFirebaseReady()) {
        return { success: false, message: 'Firebase not initialized!' };
    }
    try {
        const userCredential = await window.createUserWithEmailAndPassword(window.auth, email, password);
        const user = userCredential.user;
        await window.setDoc(window.doc(window.db, "users", user.uid), {
            name: name, email: email, createdAt: new Date().toISOString()
        });
        return { success: true, message: 'Account created successfully!' };
    } catch (error) {
        let message = 'Sign up failed!';
        if (error.code === 'auth/email-already-in-use') message = 'Email already registered!';
        else if (error.code === 'auth/weak-password') message = 'Password must be at least 6 characters!';
        return { success: false, message: message };
    }
}

async function signIn(email, password) {
    if (!isFirebaseReady()) {
        return { success: false, message: 'Firebase not initialized!' };
    }
    try {
        await window.signInWithEmailAndPassword(window.auth, email, password);
        return { success: true, message: 'Login successful!' };
    } catch (error) {
        return { success: false, message: 'Invalid email or password!' };
    }
}

async function signOutUser() {
    try {
        await window.signOut(window.auth);
        showToast('👋 Signed out successfully!', '#64748b');
    } catch (error) {
        showToast('❌ Error signing out!', '#ef4444');
    }
}

async function showProfile() {
    if (currentUser) {
        try {
            const userDoc = await window.getDoc(window.doc(window.db, "users", currentUser.uid));
            const userData = userDoc.data();
            if (userData) {
                document.getElementById('profileName').textContent = userData.name;
                document.getElementById('profileEmail').textContent = currentUser.email;
                const formattedDate = new Date(userData.createdAt).toLocaleDateString();
                document.getElementById('profileDate').textContent = formattedDate;
                openModal(profileModal);
            }
        } catch (error) {
            showToast('Error loading profile', '#ef4444');
        }
    }
}

// Form Handlers
const loginForm = document.getElementById('loginFormModal');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        if (!email || !password) {
            showToast('❌ Please enter both email and password', '#ef4444');
            return;
        }
        const result = await signIn(email, password);
        if (result.success) {
            showToast('✅ ' + result.message, '#10b981');
            closeModal(loginModal);
            loginForm.reset();
        } else {
            showToast('❌ ' + result.message, '#ef4444');
        }
    });
}

const signupForm = document.getElementById('signupFormModal');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        if (!name || !email || !password || !confirmPassword) {
            showToast('❌ Please fill all fields', '#ef4444');
            return;
        }
        if (password !== confirmPassword) {
            showToast('❌ Passwords do not match', '#ef4444');
            return;
        }
        if (password.length < 6) {
            showToast('❌ Password must be at least 6 characters', '#ef4444');
            return;
        }
        const result = await signUp(email, password, name);
        if (result.success) {
            showToast('🎉 ' + result.message, '#10b981');
            closeModal(signupModal);
            signupForm.reset();
        } else {
            showToast('❌ ' + result.message, '#ef4444');
        }
    });
}

// Sign Out Button
const signOutBtn = document.getElementById('signOutBtn');
if (signOutBtn) {
    signOutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await signOutUser();
    });
}

// Profile Link
const profileLink = document.getElementById('profileLink');
if (profileLink) {
    profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        showProfile();
    });
}

// Modal Functions
function openModal(modal) {
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

document.querySelectorAll('.close, .close-signup, .close-profile').forEach(btn => {
    if (btn) {
        btn.addEventListener('click', () => {
            closeModal(loginModal);
            closeModal(signupModal);
            closeModal(profileModal);
        });
    }
});

document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', () => {
        closeModal(loginModal);
        closeModal(signupModal);
        closeModal(profileModal);
    });
});

const createAccountLink = document.getElementById('createAccount');
if (createAccountLink) {
    createAccountLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(signupModal);
    });
}

const backToLoginLink = document.getElementById('backToLogin');
if (backToLoginLink) {
    backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(signupModal);
        openModal(loginModal);
    });
}

const forgotPasswordLink = document.getElementById('forgotPassword');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('📧 Password reset link sent!', '#0e8fe6');
    });
}

if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(loginModal);
    });
}

const closeProfileBtn = document.getElementById('closeProfileBtn');
if (closeProfileBtn) {
    closeProfileBtn.addEventListener('click', () => {
        closeModal(profileModal);
    });
}

// ============================================
// RESUME DOWNLOAD - GITHUB (NO BILLING)
// ============================================
const downloadResume = document.getElementById('downloadResume');
if (downloadResume) {
    downloadResume.addEventListener('click', (e) => {
        e.preventDefault();
        // GitHub Raw link (apni repository ka link yahan paste karein)
        const resumeUrl = "https://raw.githubusercontent.com/irtajajara/resume/main/Irtaja_Jara_Resume.pdf";
        window.open(resumeUrl, '_blank');
        showToast('✅ Resume is opening in new tab!', '#10b981');
    });
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (backToTop) {
        backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    }
});
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// PROGRESS BARS
// ============================================
const progressBars = document.querySelectorAll('.progress');
const animateProgress = () => {
    progressBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100 && !bar.classList.contains('animated')) {
            bar.classList.add('animated');
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => { bar.style.width = width; }, 200);
        }
    });
};
window.addEventListener('scroll', animateProgress);
animateProgress();

// ============================================
// SCROLL REVEAL
// ============================================
const revealElements = document.querySelectorAll('.service-card, .stat-card, .info-card, .about-text, .tech-category, .experience-card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });
revealElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(40px)';
    element.style.transition = `all 0.6s ease ${index * 0.05}s`;
    observer.observe(element);
});

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '' && href !== '#home' && !href.includes('http')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// ============================================
// TOAST FUNCTION
// ============================================
function showToast(message, color) {
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = message;
    toast.style.cssText = `
        position: fixed; bottom: 100px; right: 30px; background: ${color}; color: white;
        padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 500;
        z-index: 10000; animation: slideInToast 0.3s ease; box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutToast 0.3s ease';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideInToast {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutToast {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(toastStyle);

// ============================================
// INITIALIZE
// ============================================
initAuthListener();

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (loginModal && loginModal.style.display === 'block') closeModal(loginModal);
        if (signupModal && signupModal.style.display === 'block') closeModal(signupModal);
        if (profileModal && profileModal.style.display === 'block') closeModal(profileModal);
    }
});