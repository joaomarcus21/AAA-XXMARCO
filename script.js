/* ═══════════════════════════════════════════════
   AAA XX-MARÇO · script.js
   ═══════════════════════════════════════════════ */

/* ── HAMBURGUER ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── NAVEGAÇÃO ── */
const btnBack = document.getElementById('btnBack');

function showSection(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
  btnBack.classList.toggle('visible', id !== 'hero');
}

function showSectionMobile(id) {
  closeMobileMenu();
  showSection(id);
}

/* ── CAROUSEL ── */
let current = 0;
const total = 3;

const track = document.getElementById('carouselTrack');
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const slideNum = document.getElementById('slideNum');

function goToSlide(n) {
  slides[current].classList.remove('is-active');
  dots[current].classList.remove('active');
  current = (n + total) % total;
  slides[current].classList.add('is-active');
  dots[current].classList.add('active');
  track.style.transform = `translateX(-${current * 33.333}%)`;
  slideNum.textContent = current + 1;
}

function nextSlide() { goToSlide(current + 1); }
function prevSlide() { goToSlide(current - 1); }

document.getElementById('nextBtn').addEventListener('click', nextSlide);
document.getElementById('prevBtn').addEventListener('click', prevSlide);

/* Swipe touch no carousel */
let touchStartX = 0;
const carousel = document.getElementById('mainCarousel');
carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
carousel.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
});

/* Teclado */
document.addEventListener('keydown', e => {
  if (document.getElementById('hero').classList.contains('active')) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft')  prevSlide();
  }
  if (lightbox.classList.contains('open')) {
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowRight')  lbNavigate(1);
    if (e.key === 'ArrowLeft')   lbNavigate(-1);
  }
});

/* ── GALERIA ── */
const galItems = [
  { img: 'pessoas.jpeg',     label: 'Galera da AAA' },
  { img: 'titulos.jpeg',     label: 'Campeões Gerais' },
  { img: 'trofeus.jpeg',     label: 'Troféus CopaCEF' },
  { img: 'trofeus2026.jpeg', label: 'Troféus 2026' },
  { img: 'premios.jpeg',     label: 'Prêmios CopaCEF 2025' },
  { img: 'copacef.jpeg',     label: 'CopaCEF – Jogos Internos' },
  { img: 'fifa.jpeg',        label: 'Campeão FIFA' },
  { img: 'mvp.jpeg',         label: 'MVP – Maior Pontuador Vôlei' },
  { img: 'levantador.jpeg',  label: 'Melhor Levantador Vôlei' },
  { img: 'craque.jpeg',      label: 'Craque do Ano – Futebol 7' },
  { img: 'goleiros.jpeg',    label: 'Melhor Goleiro – Futebol 7' },
];

const gg = document.getElementById('galeriaGrid');

function createPlaceholder(label) {
  const d = document.createElement('div');
  d.className = 'gal-item';
  d.style.cursor = 'default';
  d.innerHTML = `
    <div class="gal-placeholder">
      <span style="font-size:2rem;opacity:0.3">📷</span>
      <span style="font-size:0.65rem;color:rgba(255,255,255,0.2);letter-spacing:1px;text-align:center;padding:0 4px;">${label}</span>
    </div>`;
  return d;
}

galItems.forEach((g, idx) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'gal-item';
  wrapper.innerHTML = `
    <div class="gal-item-inner">
      <img src="${g.img}" alt="${g.label}" style="width:100%;height:100%;object-fit:cover;">
      <div class="gal-overlay"><span class="gal-zoom-icon">⊕</span></div>
    </div>`;
  const img = wrapper.querySelector('img');
  img.onerror = () => wrapper.replaceWith(createPlaceholder(g.label));
  wrapper.addEventListener('click', () => openLightbox(g.img, g.label, idx));
  gg.appendChild(wrapper);
});

/* ── LIGHTBOX ── */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
const lbNum     = document.getElementById('lbNum');
const lbTotal   = document.getElementById('lbTotal');
let lbCurrentIdx = 0;
lbTotal.textContent = galItems.length;

function openLightbox(src, label, idx) {
  lbCurrentIdx = idx;
  lbImg.src    = src;
  lbImg.alt    = label;
  lbCaption.textContent = label;
  lbNum.textContent = idx + 1;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lbImg.src = '';
}

function lbNavigate(dir) {
  lbCurrentIdx = (lbCurrentIdx + dir + galItems.length) % galItems.length;
  const g = galItems[lbCurrentIdx];
  lbImg.src = g.img;
  lbImg.alt = g.label;
  lbCaption.textContent = g.label;
  lbNum.textContent = lbCurrentIdx + 1;
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => lbNavigate(-1));
document.getElementById('lbNext').addEventListener('click', () => lbNavigate(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

/* Swipe touch no lightbox */
let lbTouchX = 0;
lightbox.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const diff = lbTouchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) lbNavigate(diff > 0 ? 1 : -1);
});

/* ── LOJA ── */
const IG_LOJA = 'lojinhatleticafacef';

function igDirect(nomeProduto, preco) {
  const msg = encodeURIComponent(`Olá! Tenho interesse em comprar: ${nomeProduto} (${preco}) 🛒`);
  window.open(`https://ig.me/m/${IG_LOJA}?text=${msg}`, '_blank');
}

const produtos = [
  { img: 'bandana1.jpeg',          name: 'Bandana Viking',                  price: 'R$ 38,00',  tag: 'Destaque' },
  { img: 'mochila.jpeg',           name: 'Mochila AAA XX-Março',            price: 'R$ 32,00',  tag: 'Destaque' },
  { img: 'blusavinking2026.jpeg',  name: 'Blusa Viking 2026',               price: 'R$ 55,00',  tag: '2026' },
  { img: 'blusajeysermasc.jpeg',   name: 'Jersey Futebol Americano Masc.',  price: 'R$ 140,90', tag: 'Edição Limitada' },
  { img: 'blusajeyser.jpeg',       name: 'Jersey Futebol Americano Fem.',   price: 'R$ 140,90', tag: 'Edição Limitada' },
  { img: 'sambamas.jpeg',          name: 'Samba-Cançao Masc.',              price: 'R$ 54,90',  tag: 'Edição Limitada' },
  { img: 'sambafem.jpeg',          name: 'Samba-Cançao Fem.',               price: 'R$ 54,90',  tag: 'Edição Limitada' },
  { img: 'caneca1.jpeg',           name: 'Caneca Oficial 750ml',            price: 'R$ 37,00',  tag: '' },
  { img: 'blusa2025.jpeg',         name: 'Camiseta Oficial XX-Março',       price: ' ̶R̶$̶ ̶5̶5̶,̶0̶0̶', tag: 'Esgotado' },
  { img: 'blusablack.jpeg',        name: 'Camiseta Viking Black',           price: ' ̶R̶$̶ ̶6̶5̶,̶0̶0̶', tag: 'Esgotado' },
];

const lg = document.getElementById('lojaGrid');
produtos.forEach(p => {
  const card = document.createElement('div');
  card.className = 'produto';
  card.innerHTML = `
    <div class="produto-img">
      ${p.tag ? `<div class="produto-tag">${p.tag}</div>` : ''}
      <img src="${p.img}" alt="${p.name}" loading="lazy">
    </div>
    <div class="produto-info">
      <div class="produto-name">${p.name}</div>
      <div class="produto-price">${p.price}</div>
      <button class="btn-comprar">Comprar via Instagram</button>
    </div>`;
  card.querySelector('.btn-comprar').addEventListener('click', () => igDirect(p.name, p.price));
  lg.appendChild(card);
});

/* ── TIME ── */
const membros = [
  { foto: 'guilherme.png',      emoji: '⚔',  name: 'Guilherme', role: 'Presidente' },
  { foto: 'sarah.png',          emoji: '🛡',  name: 'Sarah',     role: 'Vice-Presidente' },
  { foto: 'sabrina.png',        emoji: '🏆',  name: 'Sabrina',   role: 'Dir. Geral' },
  { foto: 'kamila.png',         emoji: '💰',  name: 'Kamila',    role: 'Dir. Financeiro' },
  { foto: 'beatriz.png',        emoji: '📣',  name: 'Beatriz',   role: 'Dir. Marketing' },
  { foto: 'luciano.png',        emoji: '🏐',  name: 'Luciano',   role: 'Dir. Vôlei' },
  { foto: 'kaylayne.png',       emoji: '🏐',  name: 'Kaylayne',  role: 'Dir. Esportivo' },
  { foto: 'rodolfo.png',        emoji: '⛹️', name: 'Rodolfo',   role: 'Dir. Basquete' },
  { foto: 'victorbasquete.png', emoji: '⛹️', name: 'Victor',    role: 'Dir. Basquete' },
  { foto: 'paulo.png',          emoji: '⚽',  name: 'Paulo',     role: 'Dir. Futebol' },
  { foto: 'matheusfutebol.png', emoji: '⚽',  name: 'Matheus',   role: 'Dir. Futebol' },
  { foto: 'anaeventos.png',     emoji: '🎉',  name: 'Ana',       role: 'Dir. Eventos' },
  { foto: 'arthur.png',         emoji: '🏅',  name: 'Arthur',    role: 'Dir. Tenis de mesa' },
  { foto: 'mathesutecnico.png', emoji: '🔧',  name: 'Matheus',   role: 'Técnico' },
  { foto: 'bela.png',           emoji: '🏐',  name: 'Bela',      role: 'Dir. Vôlei' },
];

const tg = document.getElementById('timeGrid');
membros.forEach((m, i) => {
  const div = document.createElement('div');
  div.className = 'membro';
  div.innerHTML = `
    <div class="membro-avatar">
      <img src="${m.foto}" alt="${m.name}">
      <span class="membro-num">#${String(i + 1).padStart(2, '0')}</span>
    </div>
    <div class="membro-name">${m.name}</div>
    <div class="membro-role">${m.role}</div>`;
  const img = div.querySelector('img');
  img.onerror = () => {
    const ph = document.createElement('div');
    ph.className = 'membro-avatar-placeholder';
    ph.textContent = m.emoji;
    img.replaceWith(ph);
  };
  tg.appendChild(div);
});