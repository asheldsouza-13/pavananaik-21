/**
 * PAVANA NAIK - DEVELOPER PORTFOLIO
 * Vanilla JavaScript (ES6+) Implementation
 * Minimalist, Accessible, and High-Performance
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Management (Light / Dark) ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
  const root = document.documentElement;

  // Default theme is 'light' per design preferences
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('portfolio-theme', 'dark');
      if (themeToggleBtn) themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
      if (themeToggleMobileBtn) themeToggleMobileBtn.setAttribute('aria-label', 'Switch to light theme');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem('portfolio-theme', 'light');
      if (themeToggleBtn) themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
      if (themeToggleMobileBtn) themeToggleMobileBtn.setAttribute('aria-label', 'Switch to dark theme');
    }
  }

  function toggleTheme() {
    const isDark = root.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  }

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);

  // --- Mobile Drawer Navigation ---
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const closeDrawerBtn = document.getElementById('close-drawer');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileToggleBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileToggleBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileDrawer?.classList.contains('open')) {
        closeDrawer();
      }
      closeResumeModal();
    }
  });

  // --- Scroll Spy & Active Nav Highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // --- Project Filtering ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category')?.split(' ') || [];
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 150);
        }
      });
    });
  });

  // --- Copy to Clipboard Utility ---
  const toast = document.getElementById('toast');
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  const copyButtons = document.querySelectorAll('.copy-trigger');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast(`Error copying: ${textToCopy}`);
        });
      }
    });
  });

  // --- Contact Form Handling ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      const name = nameInput?.value.trim();
      const email = emailInput?.value.trim();
      const subject = subjectInput?.value.trim() || 'Portfolio Inquiry';
      const message = messageInput?.value.trim();

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.className = 'form-status error';
          formStatus.textContent = 'Please fill out all required fields.';
        }
        return;
      }

      // Generate mailto link as direct communication action
      const recipient = 'pavanahebri@gmail.com';
      const mailtoSubject = encodeURIComponent(`[Portfolio Contact] ${subject} - From ${name}`);
      const mailtoBody = encodeURIComponent(`Hello Pavana,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSent from your portfolio website.`);
      
      const mailtoUrl = `mailto:${recipient}?subject=${mailtoSubject}&body=${mailtoBody}`;

      if (formStatus) {
        formStatus.className = 'form-status success';
        formStatus.innerHTML = `Opening your default email app to deliver this message directly to <strong>${recipient}</strong>. Thank you, ${name}!`;
      }

      // Open email client
      window.location.href = mailtoUrl;

      // Reset form
      contactForm.reset();
    });
  }

  // --- Resume Modal Logic ---
  const resumeModal = document.getElementById('resume-modal');
  const openResumeButtons = document.querySelectorAll('.open-resume-btn');
  const closeResumeBtn = document.getElementById('close-resume-modal');
  const printResumeBtn = document.getElementById('print-resume-btn');
  const modalBackdrop = document.querySelector('.modal-backdrop');

  function openResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.add('active');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openResumeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  });

  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResumeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeResumeModal);

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Animate skill meters when in view
  const skillMeters = document.querySelectorAll('.meter-fill');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute('data-level-width') || '25%';
          entry.target.style.width = width;
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    skillMeters.forEach(meter => observer.observe(meter));
  } else {
    skillMeters.forEach(meter => {
      meter.style.width = meter.getAttribute('data-level-width') || '25%';
    });
  }
});
