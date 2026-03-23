const WL_KEY  = 'murmur_waitlist_count';
const WL_BASE = 11;

function getWaitlistCount() {
  const stored = parseInt(localStorage.getItem(WL_KEY), 10);
  if (!stored || stored < WL_BASE) {
    localStorage.setItem(WL_KEY, WL_BASE);
    return WL_BASE;
  }
  return stored;
}

function animateCount(el, target) {
  const start = Math.max(1, target - 5);
  let current = start;
  el.textContent = current;
  const tick = () => {
    if (current < target) {
      current++;
      el.textContent = current;
      setTimeout(tick, 90);
    }
  };
  setTimeout(tick, 300);
}

document.addEventListener('DOMContentLoaded', () => {

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Scroll reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
    '.benefit-item, .step, .model-card, .faq-item'
  ).forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

});
