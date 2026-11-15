/**
 * Absoora Residence - Shared Frontend Scripts
 */

// Format Rupiah helpers
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number).replace('IDR', 'Rp').trim();
}

function formatJuta(number) {
  const juta = number / 1000000;
  return 'Rp ' + juta.toFixed(2).replace('.', ',') + ' Juta';
}

// Lightbox Data & Logic
const galleryImages = [
  {
    src: 'assets/images/hero-front.jpg',
    title: 'Tampak Depan Eksklusif (Daytime)',
    caption: 'Fasad modern tropis 2 lantai berkarakter dengan ornamen terracotta & gerbang besi minimalis.'
  },
  {
    src: 'assets/images/living-room.jpg',
    title: 'Ruang Tamu & Living Room Utama',
    caption: 'Ruang tengah lapang dengan ceiling tinggi 4.2m, pencahayaan alami optimal, dan split level.'
  },
  {
    src: 'assets/images/living-room-wide.jpg',
    title: 'Living Area & TV Wall',
    caption: 'Aksen panel kayu hangat dan konektivitas visual langsung menuju lantai 2.'
  },
  {
    src: 'assets/images/dining-room.jpg',
    title: 'Ruang Makan Keluarga (Dining Room)',
    caption: 'Dekat dengan patio terbuka dan terhubung langsung dengan area pantry / dapur bersih.'
  },
  {
    src: 'assets/images/kitchen.jpg',
    title: 'Area Dapur Bersih (Kitchen)',
    caption: 'Layout efisien dengan bukaan sirkulasi udara bebas asap dan bau.'
  },
  {
    src: 'assets/images/second-floor.jpg',
    title: 'Selasar & Void Lantai 2',
    caption: 'Balkon koridor modern dengan railing baja hitam elegan menuju kamar tidur.'
  },
  {
    src: 'assets/images/hero-night.jpg',
    title: 'Fasad Malam Hari (Night Ambience)',
    caption: 'Tata cahaya warm white yang menghadirkan nuansa hangat, mewah, dan berkelas.'
  },
  {
    src: 'assets/images/facade-angle.jpg',
    title: 'Perspektif Jalan (Side Angle View)',
    caption: 'Kavling luas dengan carport lapang dan penghijauan terawat.'
  }
];

let currentLightboxIndex = 0;

function openLightbox(index) {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;
  currentLightboxIndex = (index >= 0 && index < galleryImages.length) ? index : 0;
  updateLightboxContent();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function nextLightbox() {
  currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
  updateLightboxContent();
}

function prevLightbox() {
  currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
  updateLightboxContent();
}

function updateLightboxContent() {
  const imgEl = document.getElementById('lightbox-image');
  const titleEl = document.getElementById('lightbox-title');
  const captionEl = document.getElementById('lightbox-caption');
  const counterEl = document.getElementById('lightbox-counter');

  const item = galleryImages[currentLightboxIndex];
  if (imgEl) imgEl.src = item.src;
  if (titleEl) titleEl.textContent = item.title;
  if (captionEl) captionEl.textContent = item.caption;
  if (counterEl) counterEl.textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
}

// Global Key listener for lightbox
window.addEventListener('keydown', (e) => {
  const modal = document.getElementById('lightbox-modal');
  if (!modal || !modal.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextLightbox();
  if (e.key === 'ArrowLeft') prevLightbox();
});

// Click outside stage to close lightbox
document.addEventListener('click', (e) => {
  const modal = document.getElementById('lightbox-modal');
  if (modal && modal.classList.contains('active') && e.target === modal) {
    closeLightbox();
  }
});

// Interactive KPR Calculator
function initKprCalculator() {
  const dpSlider = document.getElementById('dp-slider');
  const tenorSlider = document.getElementById('tenor-slider');
  if (!dpSlider || !tenorSlider) return;

  const dpValues = [10, 15, 20, 25, 30];
  const tenorValues = [5, 10, 15, 20];
  const price = 777000000;
  const flatRate = 0.0675; // 6.75% flat per year

  function updateSliderFill(slider, min, max, value) {
    const percent = ((value - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, #15803d 0%, #15803d ${percent}%, #e2e8f0 ${percent}%, #e2e8f0 100%)`;
  }

  function calculate() {
    let dpPercent = parseInt(dpSlider.value, 10);
    // snap to nearest in dpValues
    dpPercent = dpValues.reduce((prev, curr) => Math.abs(curr - dpPercent) < Math.abs(prev - dpPercent) ? curr : prev);
    dpSlider.value = dpPercent;
    updateSliderFill(dpSlider, 10, 30, dpPercent);

    let tenorYears = parseInt(tenorSlider.value, 10);
    // snap to nearest in tenorValues
    tenorYears = tenorValues.reduce((prev, curr) => Math.abs(curr - tenorYears) < Math.abs(prev - tenorYears) ? curr : prev);
    tenorSlider.value = tenorYears;
    updateSliderFill(tenorSlider, 5, 20, tenorYears);

    // Update active state of pill buttons
    document.querySelectorAll('.dp-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.val, 10) === dpPercent);
    });
    document.querySelectorAll('.tenor-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.val, 10) === tenorYears);
    });

    const dpAmount = price * (dpPercent / 100);
    const loanPrincipal = price - dpAmount;
    const totalInterest = loanPrincipal * flatRate * tenorYears;
    const totalLoanPayable = loanPrincipal + totalInterest;
    const monthlyInstallment = totalLoanPayable / (tenorYears * 12);

    // Update UI elements
    const dpPercentDisplay = document.getElementById('calc-dp-percent');
    const dpNominalDisplay = document.getElementById('calc-dp-nominal');
    const tenorDisplay = document.getElementById('calc-tenor-display');
    const tenorMonthDisplay = document.getElementById('calc-tenor-months');
    const monthlyDisplay = document.getElementById('calc-monthly-installment');
    const summaryDpDisplay = document.getElementById('summary-dp-nominal');
    const summaryLoanDisplay = document.getElementById('summary-loan-principal');

    if (dpPercentDisplay) dpPercentDisplay.textContent = `${dpPercent}%`;
    if (dpNominalDisplay) dpNominalDisplay.textContent = formatRupiah(dpAmount);
    if (tenorDisplay) tenorDisplay.textContent = `${tenorYears} Tahun`;
    if (tenorMonthDisplay) tenorMonthDisplay.textContent = `(${tenorYears * 12} Bulan)`;
    if (monthlyDisplay) monthlyDisplay.textContent = `${formatJuta(monthlyInstallment)} / bulan`;
    if (summaryDpDisplay) summaryDpDisplay.textContent = formatRupiah(dpAmount);
    if (summaryLoanDisplay) summaryLoanDisplay.textContent = formatRupiah(loanPrincipal);

    // Update WhatsApp Consultation CTA Link
    const waBtn = document.getElementById('wa-kpr-consult-btn');
    if (waBtn) {
      const cicilanStr = `${formatJuta(monthlyInstallment)}/bulan`;
      const dpStr = `DP ${dpPercent}% (${formatRupiah(dpAmount)})`;
      const tenorStr = `${tenorYears} Tahun`;
      const textMsg = `Halo kak, saya ingin konsultasikan tentang Rumah Tipe 90 dari Absoora Residence dengan Simulasi KPR ${dpStr}, Tenor: ${tenorStr}, Estimasi Cicilan: ${cicilanStr}. apakah boleh?`;
      waBtn.href = `https://wa.me/6287890518616?text=${encodeURIComponent(textMsg)}`;
      waBtn.target = '_blank';
      waBtn.rel = 'noopener noreferrer';
    }
  }

  dpSlider.addEventListener('input', calculate);
  tenorSlider.addEventListener('input', calculate);

  // Quick button clicks
  document.querySelectorAll('.dp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      dpSlider.value = btn.dataset.val;
      calculate();
    });
  });

  document.querySelectorAll('.tenor-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tenorSlider.value = btn.dataset.val;
      calculate();
    });
  });

  // Initial calculation
  calculate();
}

// Mobile Nav Toggle
function initMobileNav() {
  const toggleBtn = document.getElementById('nav-toggle-btn');
  const navMenu = document.getElementById('nav-menu-list');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('nav-open');
    toggleBtn.classList.toggle('active');
  });
}

// Contact Form Handler for Lokasi Kontak
function initContactForm() {
  const form = document.getElementById('contact-booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('input-name')?.value || '').trim();
    const phone = (document.getElementById('input-phone')?.value || '').trim();
    const unit = (document.getElementById('input-unit')?.value || 'Tipe 90 Eksklusif').trim();
    const visitTime = (document.getElementById('input-time')?.value || '').trim();
    const notes = (document.getElementById('input-notes')?.value || '').trim();

    let text = `Halo kak, Saya ingin reservasi kunjungan show unit Absoora Residence:\n`;
    text += `- Nama: ${name || '-'}\n`;
    text += `- No. WhatsApp: ${phone || '-'}\n`;
    text += `- Unit Minat: ${unit}\n`;
    text += `- Rencana Waktu: ${visitTime || '-'}\n`;
    if (notes) text += `- Catatan: ${notes}\n`;

    const targetUrl = `https://api.whatsapp.com/send/?phone=6287890518616&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  });
}

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initKprCalculator();
  initContactForm();
});
