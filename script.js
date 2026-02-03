// ====== Footer Year ======
document.getElementById("year").textContent = new Date().getFullYear();

// ====== Background Scroll Animation Setup ======
const canvas = document.getElementById("animCanvas");
const ctx = canvas.getContext("2d");

const frameCount = 240;

function currentFrame(index) {
  const frameNumber = String(index).padStart(3, "0");
  return `images/ezgif-frame-${frameNumber}.jpg`;
}

const images = [];
let firstFrameReady = false;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);

  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();

function drawCover(img) {
  const cw = window.innerWidth;
  const ch = window.innerHeight;

  ctx.clearRect(0, 0, cw, ch);

  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  const scale = Math.max(cw / iw, ch / ih);
  const sw = iw * scale;
  const sh = ih * scale;

  const dx = (cw - sw) / 2;
  const dy = (ch - sh) / 2;

  ctx.drawImage(img, dx, dy, sw, sh);
}

let rafPending = false;
let latestFrame = 1;

function requestDraw(frame) {
  latestFrame = frame;
  if (rafPending) return;

  rafPending = true;
  requestAnimationFrame(() => {
    rafPending = false;
    const img = images[latestFrame];
    if (!img || !img.complete) return;
    drawCover(img);
  });
}

// preload
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images[i] = img;

  img.onload = () => {
    if (!firstFrameReady && i === 1) {
      firstFrameReady = true;
      requestDraw(1);
    }
  };
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function handleScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? clamp(scrollTop / docHeight, 0, 1) : 0;

  const frameIndex = Math.floor(progress * (frameCount - 1)) + 1;
  requestDraw(frameIndex);
}

window.addEventListener("scroll", handleScroll, { passive: true });

window.addEventListener("resize", () => {
  resizeCanvas();
  requestDraw(latestFrame);
});

handleScroll();
