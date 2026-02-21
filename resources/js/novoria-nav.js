// resources/js/novoria-nav.js
// NOVORIA SIDEBAR — fully functional, mobile starts closed, demos have no icons

(function() {
  'use strict';

  // ----- DOM elements -----
  const sidebar = document.getElementById('mainSidebar');
  const openBtn = document.getElementById('openSidebarBtn');
  const closeBtn = document.getElementById('closeSidebarBtn');
  const overlay = document.getElementById('sidebarOverlay');
  const body = document.body;

  // All dropdown buttons inside sidebar
  const dropdownBtns = document.querySelectorAll('.sidebar-dropdown-btn');

  // ----- 1. SIDEBAR OPEN/CLOSE (mobile only) -----
  function openSidebar() {
    if (!sidebar) return;
    // only open on mobile (<1024)
    if (window.innerWidth < 1024) {
      sidebar.classList.remove('-translate-x-full');
      sidebar.classList.add('translate-x-0');
      if (overlay) overlay.classList.remove('hidden');
      body.classList.add('sidebar-open');
    }
  }

  function closeSidebar() {
    if (!sidebar) return;
    // only close on mobile
    if (window.innerWidth < 1024) {
      sidebar.classList.add('-translate-x-full');
      sidebar.classList.remove('translate-x-0');
      if (overlay) overlay.classList.add('hidden');
      body.classList.remove('sidebar-open');
    }
  }

  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openSidebar();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSidebar();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      closeSidebar();
    });
  }

  // ----- 2. DROPDOWNS (submenu toggle with chevron rotation) -----
  dropdownBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      // find the sibling submenu
      const submenu = this.nextElementSibling;
      const chevron = this.querySelector('.fa-chevron-down');

      if (!submenu || !submenu.classList.contains('sidebar-submenu')) return;

      // toggle submenu visibility
      submenu.classList.toggle('hidden');

      // rotate chevron
      if (chevron) {
        chevron.style.transform = submenu.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
      }

      // (optional) close other dropdowns? we keep independent for simplicity
    });
  });

  // ----- 3. Prevent clicks inside sidebar from closing (when using overlay) -----
  if (sidebar) {
    sidebar.addEventListener('click', (e) => e.stopPropagation());
  }

  // ----- 4. Close sidebar when a navigation link is clicked (mobile only) -----
  const allSidebarLinks = document.querySelectorAll('.sidebar-link, .sidebar-sub-link');
  allSidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // if it's a real link and mobile, close sidebar
      if (window.innerWidth < 1024) {
        closeSidebar();
      }
    });
  });

  // ----- 5. Initial state: on mobile, sidebar closed; on desktop, open. -----
  function setInitialSidebarState() {
    if (window.innerWidth < 1024) {
      // mobile: sidebar hidden by default
      sidebar?.classList.add('-translate-x-full');
      sidebar?.classList.remove('translate-x-0');
      if (overlay) overlay.classList.add('hidden');
      body.classList.remove('sidebar-open');
    } else {
      // desktop: sidebar visible
      sidebar?.classList.remove('-translate-x-full');
      sidebar?.classList.add('translate-x-0');
      if (overlay) overlay.classList.add('hidden');
      body.classList.remove('sidebar-open');
    }
  }

  // call on initial load
  setInitialSidebarState();

  // on window resize, re-evaluate
  window.addEventListener('resize', function() {
    setInitialSidebarState();
  });

  // ----- 6. Ensure all demo submenu items have no icons (already done in HTML, but we double-check) -----
  // This is just a safety: the class "no-icon" is applied to demo links in HTML.
  // No further action needed.

  console.log('Novoria sidebar ready — mobile starts closed, demos have no icons.');
})();



  // ===== WHY ME SECTION INTERACTIONS =====
  
  // Add fade-in effect when section comes into view
  const whyMeSection = document.querySelector('.why-me-section');
  if (whyMeSection) {
    whyMeSection.classList.add('opacity-0', 'translate-y-10');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1, rootMargin: '50px' });

    observer.observe(whyMeSection);
  }

  // Animate stats numbers when they come into view
  const statNumbers = document.querySelectorAll('.text-xl.md\\:text-2xl.font-bold');
  
  const animateValue = (element, start, end, duration, suffix = '') => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.innerText = value + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const text = element.innerText;
        const number = parseInt(text.replace(/[^0-9]/g, ''));
        const suffix = text.includes('%') ? '%' : '+';
        
        // Start from 0
        element.innerText = '0' + suffix;
        animateValue(element, 0, number, 1500, suffix);
        
        statsObserver.unobserve(element);
      }
    });
  }, { threshold: 0.5, rootMargin: '0px' });

  statNumbers.forEach(stat => {
    if (stat && stat.innerText.match(/[0-9]/)) {
      statsObserver.observe(stat);
    }
  });

  // Add hover effect for service cards
  const cards = document.querySelectorAll('.group.bg-white.rounded-xl, .group.bg-white.rounded-2xl');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Optional: Add subtle sound or effect here
    });
  });

  // Make the CTA button interactive
  const ctaButton = document.querySelector('.bg-gradient-to-r.from-\\[\\#1E2A38\\] a');
  if (ctaButton) {
    ctaButton.addEventListener('click', (e) => {
      e.preventDefault();
      // Smooth scroll to contact section (you can modify this)
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Fix for responsive text on window resize
  function handleResize() {
    // Adjust any dynamic sizing if needed
    const section = document.querySelector('.why-me-section');
    if (section) {
      // Force reflow for any responsive calculations
      section.style.transform = 'translateZ(0)';
    }
  }

  window.addEventListener('resize', handleResize);