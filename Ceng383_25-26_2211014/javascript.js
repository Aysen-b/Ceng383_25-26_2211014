// =========================
// 1) Açıklama değiştir
// =========================
let descChanged = false;
document.getElementById("btnChangeDesc").addEventListener("click", () => {
  const p = document.getElementById("descText");
  p.textContent = descChanged ? "Sayfa açıldı ✅" : "Butona bastın ✅ Açıklama değişti!";
  descChanged = !descChanged;
});


// =========================
// 2) Tabloyu isme göre sırala (A-Z / Z-A)
// =========================
let nameAsc = true;
document.getElementById("btnSortByName").addEventListener("click", () => {
  const tbody = document.getElementById("studentBody");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  rows.sort((a, b) => {
    const nameA = a.children[1].textContent.trim();
    const nameB = b.children[1].textContent.trim();
    return nameAsc ? nameA.localeCompare(nameB, "tr") : nameB.localeCompare(nameA, "tr");
  });

  tbody.innerHTML = "";
  rows.forEach((row, i) => {
    row.children[0].textContent = String(i + 1);
    tbody.appendChild(row);
  });

  nameAsc = !nameAsc;
});


// =========================
// 3) Foto değiştir (1-4)
// =========================
const photos = ["img/1.jpg", "img/2.jpg", "img/3.jpg", "img/4.jpg"];
let photoIndex = 0;

document.getElementById("btnChangePhoto").addEventListener("click", () => {
  photoIndex = (photoIndex + 1) % photos.length;
  document.getElementById("photo").src = photos[photoIndex];
});


// =========================
// 4) Mouse Glow Box: gecikmeli takip + parçacık izi
// =========================
const box = document.getElementById("glowBox");
const core = document.getElementById("glowCore");
const canvas = document.getElementById("trailCanvas");
const ctx = canvas.getContext("2d");

// Canvas’ı kutuya göre ayarla
function resizeCanvasToBox() {
  const rect = box.getBoundingClientRect();
  canvas.width = Math.floor(rect.width);
  canvas.height = Math.floor(rect.height);
}
resizeCanvasToBox();
window.addEventListener("resize", resizeCanvasToBox);

// Smooth follow için hedef ve mevcut konum
let targetX = -9999, targetY = -9999;
let curX = -9999, curY = -9999;
let inside = false;

// Trail parçacıkları
const particles = [];
const MAX_PARTICLES = 80;

function addParticle(x, y) {
  particles.push({
    x, y,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    life: 1.0
  });
  if (particles.length > MAX_PARTICLES) particles.shift();
}

// Mouse kutunun içindeyken hedefi güncelle
box.addEventListener("mousemove", (e) => {
  const rect = box.getBoundingClientRect();
  targetX = e.clientX - rect.left;
  targetY = e.clientY - rect.top;
  inside = true;
  core.style.opacity = "1";
});

box.addEventListener("mouseenter", () => {
  inside = true;
  core.style.opacity = "1";
});

box.addEventListener("mouseleave", () => {
  inside = false;
  core.style.opacity = "0";
});

// Animasyon döngüsü
function animate() {
  // Trail'i yumuşakça soldur (iz efekti)
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Smooth follow: mevcut konumu hedefe yaklaştır (gecikmeli takip)
  if (inside) {
    // 0.18 -> takip hızını ayarlar (küçültürsen daha gecikmeli)
    curX += (targetX - curX) * 0.18;
    curY += (targetY - curY) * 0.18;

    // Neon core'u mouse merkezine koy
    const coreSize = 140;
    core.style.transform = `translate(${curX - coreSize / 2}px, ${curY - coreSize / 2}px)`;

    // Parçacık ekle
    addParticle(curX, curY);
  }

  // Parçacıkları çiz
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= 0.02;
    p.x += p.vx;
    p.y += p.vy;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    // Neon parçacık
    const r = 6 + (1 - p.life) * 10;
    const alpha = 0.35 * p.life;

    ctx.beginPath();
    ctx.fillStyle = `rgba(0,180,255,${alpha})`;
    ctx.shadowColor = "rgba(0,180,255,0.9)";
    ctx.shadowBlur = 20;
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // shadow sıfırla (performans + diğer çizimler etkilenmesin)
  ctx.shadowBlur = 0;

  requestAnimationFrame(animate);
}

animate();