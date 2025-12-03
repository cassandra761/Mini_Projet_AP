// mark active nav link
(function markActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'welcome.html';
  document.querySelectorAll('.site-nav a.headband').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href === path) { a.classList.add('active'); a.setAttribute('aria-current','page'); }
    else { a.classList.remove('active'); a.removeAttribute('aria-current'); }
  });
})();