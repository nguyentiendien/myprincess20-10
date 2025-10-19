/* ============================
   Lovely 20/10 – Script tối ưu
   ============================ */
"use strict";

// ====== Helper ======
const $ = (sel, ctx = document) => ctx.querySelector(sel);

// ====== DOM refs ======
const btnYes = $('#btn-yes');
const btnNo = $('#btn-no');
const modal = $('#modal');
const modalClose = $('#modal-close');
const btnMore = $('#btn-more');
const toast = $('#toast');
const bgm = $('#bgm');

// ====== Confetti (nhẹ, không thư viện) ======
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let confetti = [];
let rafId = null;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();

function makePiece() {
  const colors = ['#ff5fa2', '#ffb3c7', '#ffd1e0', '#fff176', '#a5d6a7', '#81d4fa'];
  return {
    x: Math.random() * canvas.width,
    y: -10,
    r: Math.random() * 6 + 4,
    c: colors[(Math.random() * colors.length) | 0],
    vx: (Math.random() - 0.5) * 1.6,
    vy: Math.random() * 2 + 1.5,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.2
  };
}
function burst(n = 120) {
  if (!ctx) return;
  for (let i = 0; i < n; i++) confetti.push(makePiece());
  if (!rafId) loop();
}
function loop() {
  rafId = requestAnimationFrame(loop);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.r, -p.r, 2 * p.r, 2 * p.r);
    ctx.restore();
  });
  confetti = confetti.filter(p => p.y < canvas.height + 20);
  if (confetti.length === 0) { cancelAnimationFrame(rafId); rafId = null; }
}

// ====== Toast mini ======
function toastMsg(text, ms = 1800) {
  if (!toast) return;
  toast.textContent = text;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), ms);
}

// ====== Interactions ======
btnYes && btnYes.addEventListener('click', () => {
  if (modal) {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  }
  burst(160);
  toastMsg('Em thật tuyệt! 💗');
  // bgm?.play().catch(()=>{});
});

modalClose && modalClose.addEventListener('click', () => {
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
});

btnMore && btnMore.addEventListener('click', () => {
  burst(220);
  sequenceMessages([
    'Chúc em luôn mỉm cười trên môi nhé! 😊',
    'Mọi nỗ lực của em đều xứng đáng 💪',
    'Hôm nay và những ngày sau thật hạnh phúc nha 🌷'
  ]);
});

// ====== Nút "Chưa đâu" chạy trốn ======
let evadeCount = 0;
if (btnNo) {
  btnNo.classList.add('btn-runaway');

  const evade = () => {
    evadeCount++;
    const dx = (Math.random() * 140 + 60) * (Math.random() > 0.5 ? 1 : -1);
    const dy = (Math.random() * 120 + 40) * (Math.random() > 0.5 ? 1 : -1);
    btnNo.style.transform = `translate(${dx}px, ${dy}px)`;
    if (evadeCount % 2 === 0) toastMsg('Đừng ngại, bấm nút hồng kìa! 🌸', 1600);
  };

  btnNo.addEventListener('mouseenter', evade);
  btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); evade(); }, { passive: false });
}

// ====== Popup ảnh (SweetAlert2) ======
function hasSweetAlert() {
  return typeof Swal !== 'undefined' && Swal && typeof Swal.fire === 'function';
}

/** Chuỗi popup: bấm OK hiện tiếp */
function sequenceMessages(list) {
  let i = 0;
  const show = () => {
    if (!hasSweetAlert()) {
      alert(i < list.length ? list[i++] : '💗 Hết bất ngờ rồi …nhưng không hết thương đâu!');
      if (i < list.length) setTimeout(show, 80);
      return;
    }

    if (i >= list.length) {
      Swal.fire({
        title: '💗 Hết bất ngờ rồi!',
        html: `
          <p style="font-size:17px">…nhưng không hết thương đâu! 💞</p>
          <p style="margin-top:10px;color:#ff4f8a;font-weight:600">
            Chúc em 20/10 thật xinh đẹp và hạnh phúc nha 🌸
          </p>
        `,
         imageUrl: 'https://nguyentiendien.github.io/myprincess20-10/anh11.jpg',
      imageWidth: 280,
      imageHeight: 280,
        confirmButtonText: 'Kết thúc 💖',
        confirmButtonColor: '#ff5fa2',
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: 'rgba(0,0,0,.35)'
      });
      return;
    }

    const text = list[i++];
    Swal.fire({
      title: '💐 Lời chúc của Tiến Diện dành cho em',
      html: `<p style="font-size:18px">${text}</p>
             <p style="margin:6px 0 0;color:#ff4f8a;font-weight:600">
             Bông Hoa Xinh Đẹp Nhất Của Anhhhh 🌸</p>`,
      imageUrl: 'https://nguyentiendien.github.io/myprincess20-10/anh11.jpg',
      imageWidth: 280,
      imageHeight: 280,
      imageAlt: 'Hoa Của Anhhh',
      confirmButtonText: (i < list.length) ? 'Xem tiếp ➜' : 'Kết thúc 💖',
      confirmButtonColor: '#ff5fa2',
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: 'rgba(0,0,0,.35)'
    }).then(() => show());
  };
  show();
}





