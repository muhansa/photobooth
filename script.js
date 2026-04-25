const video = document.getElementById('video');
const strip = document.getElementById('mainStrip');
const flash = document.getElementById('flash');
const snapBtn = document.getElementById('snapBtn');
let photosCount = 0;
let currentFilter = 'none';

// Aktifkan Kamera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(s => video.srcObject = s)
    .catch(err => alert("Kamera tidak ditemukan!"));

function setFilter(f, btn) {
    currentFilter = f;
    video.style.filter = f;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function takePhoto() {
    if (photosCount >= 4) return alert("Strip penuh! Silakan Reset.");
    
    let count = 3;
    const snapBtn = document.getElementById('snapBtn');
    const countdownEl = document.getElementById('countdown');
    const flash = document.getElementById('flash');

    snapBtn.disabled = true;
    
    // TAMPILKAN elemen countdown
    countdownEl.style.display = 'block'; 
    countdownEl.innerText = count;

    const timer = setInterval(() => {
        count--;
        
        if (count > 0) {
            countdownEl.innerText = count;
        } else if (count === 0) {
            clearInterval(timer);
            countdownEl.innerText = ""; // Opsional: ganti angka 0 jadi ikon kamera
            
            // Efek Flash
            flash.classList.add('flash-active');
            
            setTimeout(() => {
                flash.classList.remove('flash-active');
                countdownEl.style.display = 'none'; // SEMBUNYIKAN setelah memotret
                capture();
                snapBtn.disabled = false;
            }, 500);
        }
    }, 1000);
}
function capture() {
    photosCount++;
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    ctx.filter = currentFilter;
    ctx.translate(640, 0); ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, 640, 480);
    
    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/png');
    
    const slot = document.getElementById('slot-' + photosCount);
    slot.innerHTML = '';
    slot.appendChild(img);
    
    snapBtn.disabled = false;
    document.getElementById('sessionInfo').innerText = photosCount < 4 ? `Foto ke-${photosCount+1}` : "Selesai!";
}

function changeColor(bgColor, textColor) {
    const strip = document.getElementById('mainStrip');
    const brandText = document.querySelector('.mhs-text');
    
    strip.style.backgroundColor = bgColor;
    if (brandText) brandText.style.color = textColor; // Mengubah warna teks mhsbooth
}

function changeShape(radius) {
    document.querySelectorAll('.strip-frame').forEach(f => f.style.borderRadius = radius);
}

function setLayout(layout) {
    strip.className = 'strip-container mx-auto shadow-sm ' + layout;
}

async function savePhoto() {
    if (photosCount === 0) return alert("Ambil foto dulu!");
    const canvas = await html2canvas(strip, { scale: 3 });
    const link = document.createElement('a');
    link.download = 'mhsbooth-result.png';
    link.href = canvas.toDataURL();
    link.click();
}

function resetAll() {
    photosCount = 0;
    document.querySelectorAll('.strip-frame').forEach(s => s.innerHTML = "");
    document.getElementById('sessionInfo').innerText = "Siap memotret Foto ke-1";
    snapBtn.disabled = false;
}

function kirimWA() {
    // 1. Ambil data dari input
    const nama = document.getElementById('nama').value;
    const email = document.getElementById('email').value;
    const pesan = document.getElementById('pesan').value;
    
    // 2. Nomor WhatsApp kamu (Gunakan kode negara 62 tanpa tanda +)
    const nomorWA = "62881024691491"; 

    // 3. Validasi sederhana agar tidak kirim pesan kosong
    if (nama === "" || pesan === "") {
        alert("Mohon isi nama dan pesan Anda terlebih dahulu!");
        return;
    }

    // 4. Susun format pesan agar rapi saat masuk ke WA
    const teksPesan = `*Kritik %26 Saran MHSBOOTH*%0A%0A` +
                      `*Nama:* ${nama}%0A` +
                      `*Email:* ${email}%0A` +
                      `*Pesan:* ${pesan}`;

    // 5. Buka tab baru menuju WhatsApp
    const url = `https://wa.me/${nomorWA}?text=${teksPesan}`;
    window.open(url, '_blank');
}