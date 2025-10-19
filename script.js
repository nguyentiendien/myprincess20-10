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

// ====== Confetti (nhẹ, tự viết, không lib) ======
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confetti = [];
let rafId = null;

function resizeCanvas() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
addEventListener('resize', resizeCanvas);
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

// ====== Interactions ======
btnYes?.addEventListener('click', () => {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    burst(160);
    toastMsg('Em thật tuyệt! 💗');
    // bgm.play().catch(()=>{}); // Bật nếu có file nhạc
});

modalClose?.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
});

btnMore?.addEventListener('click', () => {
    burst(220);
    sequenceMessages([
        'Chúc em luôn mỉm cười trên môi nhé ! 😋',
        'Mọi nỗ lực của em đều xứng đáng 💪',
        'Chúc em một ngày 20/10 tràn ngập niềm vui! Anh Yêu Bé Nhắm ✨'
    ]);
});

function toastMsg(text, ms = 1800) {
    toast.textContent = text;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), ms);
}

// Nút "Chưa đâu" chạy trốn
let evadeCount = 0;
btnNo?.classList.add('btn-runaway');
btnNo?.addEventListener('mouseenter', () => {
    evadeCount++;
    const dx = (Math.random() * 140 + 60) * (Math.random() > .5 ? 1 : -1);
    const dy = (Math.random() * 120 + 40) * (Math.random() > .5 ? 1 : -1);
    btnNo.style.transform = `translate(${dx}px, ${dy}px)`;
    if (evadeCount % 2 === 0) toastMsg('Đừng ngại, bấm nút hồng kìa! 🌸', 1600);
});

// ====== Popup ảnh (SweetAlert2) thay cho alert() ======
function sequenceMessages(list) {
    let i = 0;
    const show = () => {
        if (i >= list.length) {
            Swal.fire({
                title: '💗 Hết bất ngờ rồi',
                text: '…nhưng không hết thương đâu!',
                confirmButtonColor: '#ff5fa2'
            });
            return;
        }
        const text = list[i++];
        Swal.fire({
            title: '💐 Lời chúc của Tiến Diện dành cho em',
            text,
            imageUrl: 'NewFolder1/anh11.jpg',   // Đổi đường dẫn ảnh nếu bạn muốn
            imageWidth: 280,
            imageHeight: 280,
            imageAlt: 'Hoa Cụa Anhhh',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ff5fa2',
            backdrop: `rgba(0,0,0,.35)`
        }).then(() => setTimeout(show, 80));
    };
    show();
}
