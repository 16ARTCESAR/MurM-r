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

const MODELS = {
  starter: {
    name: 'MurMûr Starter',
    desc: '6 bacs — Pour commencer à cultiver chez vous dès aujourd\'hui, sans prise de tête.',
    price: '299 €',
    img: 'https://images.squarespace-cdn.com/content/v1/698b23e59cb1c46717336fae/86e8915d-5234-4e6c-8d2d-0164257caf0a/C2057623-31A8-496C-9D2B-FEC3C4EBA4BC.png',
  },
  standard: {
    name: 'MurMûr Standard',
    desc: '9 bacs — La vraie expérience potager, sans quitter votre appartement.',
    price: '499 €',
    img: 'https://images.squarespace-cdn.com/content/v1/698b23e59cb1c46717336fae/0b062a38-324f-4e89-84af-35bf0128a1d4/70E2B5FA-E317-42F0-BB9D-864DC70AE071.png',
  },
  facade: {
    name: 'MurMûr Façade',
    desc: '12 bacs — Transformez votre façade entière en jardin productif et spectaculaire.',
    price: '699 €',
    img: 'https://images.squarespace-cdn.com/content/v1/698b23e59cb1c46717336fae/30a3a9f9-6990-43a6-9b99-25c97955107a/2B83458D-D9B2-400A-A91A-4F7DCDA638EA.png',
  },
};

const VALID_KEYS = ['starter', 'standard', 'facade'];

function setModel(key) {
  if (!VALID_KEYS.includes(key)) key = 'standard';
  const m = MODELS[key];

  document.getElementById('model-img').src = m.img;
  document.getElementById('model-img').alt = m.name;
  document.getElementById('model-name').textContent = m.name;
  document.getElementById('model-desc').textContent = m.desc;
  document.getElementById('model-price').textContent = m.price;
  document.getElementById('form-modele').value = key;
  document.getElementById('form-modele-select').value = key;

  // Sync selector buttons
  document.querySelectorAll('.selector-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.model === key);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Read ?model= param from URL
  const params = new URLSearchParams(window.location.search);
  const rawParam = params.get('model') || 'standard';
  const modelParam = VALID_KEYS.includes(rawParam) ? rawParam : 'standard';
  setModel(modelParam);

  // Waitlist counter
  const countEl = document.getElementById('waitlist-count');
  if (countEl) animateCount(countEl, getWaitlistCount());

  // Selector buttons
  document.querySelectorAll('.selector-btn').forEach(btn => {
    btn.addEventListener('click', () => setModel(btn.dataset.model));
  });

  // Form select sync → update model card
  document.getElementById('form-modele-select').addEventListener('change', function () {
    setModel(this.value);
  });

  // Form submit → send to Formspree then show confirmation
  document.getElementById('reserve-form').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const btn = document.getElementById('btn-reserve');
    btn.disabled = true;
    btn.textContent = 'Envoi en cours…';

    const data = new FormData(form);
    try {
      const res = await fetch('https://formspree.io/f/xlgpalov', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.reset();
        // Incrémenter le compteur de file d'attente
        const newCount = getWaitlistCount() + 1;
        localStorage.setItem(WL_KEY, newCount);
        if (countEl) countEl.textContent = newCount;
        document.getElementById('confirm-overlay').classList.add('show');
      } else {
        btn.textContent = 'Erreur — réessayez';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Erreur réseau — réessayez';
      btn.disabled = false;
    }
  });

  // Close overlay on background click
  document.getElementById('confirm-overlay').addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('show');
  });
});
