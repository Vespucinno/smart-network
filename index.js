/**
 * TJKT Smart Network 30 - Interactive Core Logic
 * Theme: Neobrutalism Style (Tactile Pop Sound & High Contrast UI)
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. WEB AUDIO SYNTHESIZER (NEOBRUTALISM POP SOUNDS)
    // ==========================================
    let soundEnabled = true;
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
    }

    // Warm Tactile Pop Sound Generator for Neobrutalist UI
    function playPop(type = 'click') {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            if (!audioCtx) return;

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const now = audioCtx.currentTime;

            osc.type = 'sine';

            if (type === 'hover') {
                // Quick light pop tone
                osc.frequency.setValueAtTime(540, now);
                osc.frequency.exponentialRampToValueAtTime(280, now + 0.03);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
                osc.start(now);
                osc.stop(now + 0.03);
            } else if (type === 'success') {
                // Cheerful chord chime pop
                osc.frequency.setValueAtTime(660, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'toggle') {
                // Deeper punchy snap
                osc.frequency.setValueAtTime(380, now);
                osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);
                gain.gain.setValueAtTime(0.09, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                osc.start(now);
                osc.stop(now + 0.06);
            } else {
                // Standard tactile button press pop
                osc.frequency.setValueAtTime(480, now);
                osc.frequency.exponentialRampToValueAtTime(240, now + 0.04);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.start(now);
                osc.stop(now + 0.04);
            }

            osc.connect(gain);
            gain.connect(audioCtx.destination);
        } catch (e) {
            // Audio context fallback
        }
    }

    // Toggle Sound Button
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundBtn.classList.toggle('active', soundEnabled);
            soundBtn.innerHTML = soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
            if (soundEnabled) playPop('success');
            showToast(soundEnabled ? 'SUARA NEOBRUTALISM: AKTIF' : 'SUARA: DIBISUKAN');
        });
    }

    // Overdrive Mode Toggle Button
    const overdriveBtn = document.getElementById('overdrive-toggle-btn');
    if (overdriveBtn) {
        overdriveBtn.addEventListener('click', () => {
            document.body.classList.toggle('overdrive-mode');
            const isActive = document.body.classList.contains('overdrive-mode');
            overdriveBtn.classList.toggle('active', isActive);
            playPop('toggle');
            showToast(isActive ? 'TEMA KUNING SUPER POP: AKTIF' : 'TEMA NEOBRUTALISM: STANDAR');
        });
    }

    // Add audio feedback to all interactive buttons
    document.querySelectorAll('.btn, .filter-btn, .tab-btn, .carousel-btn, .hud-btn').forEach(button => {
        button.addEventListener('mouseenter', () => playPop('hover'));
        button.addEventListener('click', () => playPop('click'));
    });

    // ==========================================
    // 2. CURSOR SPOTLIGHT GLOW EFFECT
    // ==========================================
    const spotlight = document.getElementById('cursor-spotlight');
    if (spotlight && window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            spotlight.style.left = `${e.clientX}px`;
            spotlight.style.top = `${e.clientY}px`;
        });
    }

    // ==========================================
    // 3. HEADER & MOBILE NAVIGATION DRAWER
    // ==========================================
    const header = document.getElementById('header');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileBackdrop = document.getElementById('mobile-backdrop');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        highlightActiveNavLink();
    });

    function toggleMobileMenu(open) {
        const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
        mobileDrawer.classList.toggle('open', isOpen);
        mobileBackdrop.classList.toggle('show', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            toggleMobileMenu();
            playPop('toggle');
        });
    }

    if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', () => toggleMobileMenu(false));
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(false));
    });

    // Smooth Scroll Active Link Highlight
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightActiveNavLink() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================
    // 4. ANIMATED STATS COUNTER
    // ==========================================
    const counters = document.querySelectorAll('.counter');
    let counted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 1500;
                    const step = Math.ceil(target / (duration / 16));
                    let current = 0;

                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            counter.innerText = target;
                            clearInterval(timer);
                        } else {
                            counter.innerText = current;
                        }
                    }, 16);
                });
                counted = true;
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // ==========================================
    // 5. SERVICES CATEGORY FILTER & MODAL
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            playPop('click');

            const filter = btn.getAttribute('data-filter');

            serviceCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Service Detail Modal System
    const modal = document.getElementById('service-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalBadge = document.getElementById('modal-badge');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');

    const serviceDetailsData = {
        instalasi: {
            title: 'Instalasi Jaringan High-Speed & Presisi',
            badge: 'LAYANAN // INSTALASI',
            desc: `Layanan instalasi jaringan fisik lengkap dari nol. Tim ahli kami menangani pengabelan rapi (Structured Cabling Cat6/Cat7), pemasangan Rack Server, Switch, Fiber Optik, serta pengujian sinyal menyeluruh.<br><br><strong>Fitur Utama:</strong><br>• Perencanaan Denah & Placement Access Point<br>• Penataan Kabel Standar Industri (ISO/IEC 11801)<br>• Pengujian Kecepatan Throughput 1Gbps / 10Gbps<br>• Garansi Pemeliharaan Fisik 12 Bulan`
        },
        konsultasi: {
            title: 'Konsultasi & Audit Arsitektur Jaringan',
            badge: 'LAYANAN // KONSULTASI',
            desc: `Analisis menyeluruh terhadap kendala jaringan lambat, sering putus (packet loss), atau struktur kurang efisien. Kami membantu mendesain ulang arsitektur topologi Anda agar bebas bottleneck.<br><br><strong>Fitur Utama:</strong><br>• Network Security & Bottleneck Audit<br>• Rekomendasi Alokasi Hardware & Bandwidth<br>• Desain Failover Multi-ISP (Load Balancing)<br>• Dokumentasi Topologi Lengkap & Diagram`
        },
        server: {
            title: 'Konfigurasi Server & Keamanan Berlapis',
            badge: 'LAYANAN // SERVER & CLOUD',
            desc: `Setting server profesional berbasis Linux/Windows Server, MikroTik, Cisco, serta Cloud Infrastructure. Menangani pengkonfigurasian Firewall, VPN Site-to-Site, DNS/DHCP Server, hingga Monitoring System.<br><br><strong>Fitur Utama:</strong><br>• Hardening Firewall & Proteksi Anti-Bruteforce/DDoS<br>• Virtual Private Network (WireGuard / OpenVPN)<br>• Sistem Monitoring Notification Real-Time<br>• Automated Cloud Backup System`
        }
    };

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceKey = btn.getAttribute('data-service');
            const data = serviceDetailsData[serviceKey];
            if (data && modal) {
                modalTitle.innerText = data.title;
                modalBadge.innerText = data.badge;
                modalBody.innerHTML = data.desc;
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
                playPop('success');
            }
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
            playPop('toggle');
        }
    }

    // ==========================================
    // 6. INTERACTIVE NETWORK COST CALCULATOR
    // ==========================================
    const calcServiceSelect = document.getElementById('calc-service-type');
    const calcNodesInput = document.getElementById('calc-nodes');
    const nodesValDisplay = document.getElementById('nodes-val');
    const calcSupportSelect = document.getElementById('calc-support');
    const totalPriceDisplay = document.getElementById('total-price-display');

    function calculateEstimate() {
        if (!calcServiceSelect || !calcNodesInput || !calcSupportSelect || !totalPriceDisplay) return;

        const basePrice = parseInt(calcServiceSelect.value);
        const nodeCount = parseInt(calcNodesInput.value);
        const supportMultiplier = parseFloat(calcSupportSelect.value);

        if (nodesValDisplay) nodesValDisplay.innerText = nodeCount;

        // Formula: (Base + (NodeCount * 150,000)) * SupportMultiplier
        const totalPrice = (basePrice + (nodeCount * 150000)) * supportMultiplier;

        // Format to IDR Rupiah
        const formattedPrice = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(totalPrice);

        totalPriceDisplay.innerText = formattedPrice;
    }

    if (calcNodesInput) {
        calcNodesInput.addEventListener('input', () => {
            calculateEstimate();
            playPop('hover');
        });
    }
    if (calcServiceSelect) {
        calcServiceSelect.addEventListener('change', () => {
            calculateEstimate();
            playPop('click');
        });
    }
    if (calcSupportSelect) {
        calcSupportSelect.addEventListener('change', () => {
            calculateEstimate();
            playPop('click');
        });
    }

    // Initialize calculator output
    calculateEstimate();

    // ==========================================
    // 7. SPECIFICATION TABS & LIVE DIAGNOSTIC SIMULATOR
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            playPop('click');
            const targetTab = document.getElementById(`tab-${btn.getAttribute('data-tab')}`);
            if (targetTab) targetTab.classList.add('active');
        });
    });

    // Diagnostic Console Simulator
    const runDiagBtn = document.getElementById('run-diag-btn');
    const diagConsole = document.getElementById('diag-console');
    const metricPing = document.getElementById('metric-ping');
    const metricJitter = document.getElementById('metric-jitter');
    const metricLoss = document.getElementById('metric-loss');

    if (runDiagBtn && diagConsole) {
        let isTesting = false;

        runDiagBtn.addEventListener('click', () => {
            if (isTesting) return;
            isTesting = true;

            runDiagBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Testing...';
            diagConsole.innerHTML = '[SYSTEM_CHECK] Memulai pengujian jaringan TJKT Gateway (10.0.30.1)...<br>';
            playPop('toggle');

            const steps = [
                { delay: 400, text: '[TEST_PING] Mengirim paket data 64-byte ke node utama...' },
                { delay: 800, text: '[TEST_BANDWIDTH] Menguji kapasitas throughput jaringan...' },
                { delay: 1200, text: '[TEST_KEAMANAN] Memeriksa aturan firewall & insulasi VLAN...' },
                { delay: 1600, text: '[SUKSES] Jaringan super stabil, latensi optimal & siap dipakai!' }
            ];

            steps.forEach(step => {
                setTimeout(() => {
                    diagConsole.innerHTML += `${step.text}<br>`;
                    diagConsole.scrollTop = diagConsole.scrollHeight;
                    playPop('hover');
                }, step.delay);
            });

            setTimeout(() => {
                const randomPing = Math.floor(Math.random() * 3) + 1; // 1-3ms
                const randomJitter = (Math.random() * 0.4 + 0.1).toFixed(1); // 0.1-0.5ms

                if (metricPing) metricPing.innerText = `${randomPing} ms`;
                if (metricJitter) metricJitter.innerText = `${randomJitter} ms`;
                if (metricLoss) metricLoss.innerText = `0%`;

                runDiagBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Test';
                isTesting = false;
                playPop('success');
            }, 2000);
        });
    }

    // ==========================================
    // 8. TESTIMONIAL CAROUSEL SLIDER
    // ==========================================
    const testimonialTrack = document.getElementById('testimonial-track');
    const prevTestiBtn = document.getElementById('prev-testi');
    const nextTestiBtn = document.getElementById('next-testi');
    const dotBtns = document.querySelectorAll('.dot-btn');
    let currentTestiIndex = 0;
    const totalTestimonials = 3;

    function goToTestimonial(index) {
        currentTestiIndex = (index + totalTestimonials) % totalTestimonials;
        if (testimonialTrack) {
            testimonialTrack.style.transform = `translateX(-${currentTestiIndex * 100}%)`;
        }
        dotBtns.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentTestiIndex);
        });
    }

    if (nextTestiBtn) {
        nextTestiBtn.addEventListener('click', () => {
            goToTestimonial(currentTestiIndex + 1);
            playPop('hover');
        });
    }
    if (prevTestiBtn) {
        prevTestiBtn.addEventListener('click', () => {
            goToTestimonial(currentTestiIndex - 1);
            playPop('hover');
        });
    }

    dotBtns.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            goToTestimonial(index);
            playPop('click');
        });
    });

    // Auto-slide carousel every 6 seconds
    setInterval(() => {
        goToTestimonial(currentTestiIndex + 1);
    }, 6000);

    // ==========================================
    // 9. CONTACT FORM SUBMISSION & TOAST
    // ==========================================
    // Web3Forms email relay. Get your access key at https://web3forms.com
    // (enter mumurizky6@gmail.com -> copy the generated key -> paste it below).
    const WEB3FORMS_ACCESS_KEY = '60ab7124-2e40-46d0-af08-45d176260bf9';
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim Pesan...';
                submitBtn.disabled = true;
            }

            try {
                const formData = new FormData();
                formData.append('access_key', WEB3FORMS_ACCESS_KEY);
                formData.append('from_name', nameInput.value);
                formData.append('email', emailInput.value);
                formData.append('message', messageInput.value);
                formData.append('subject', `[TJKT Smart Network] Pesan baru dari ${nameInput.value}`);
                formData.append('replyto', emailInput.value);

                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await res.json();

                if (data.success) {
                    showToast(`Terima kasih ${nameInput.value || 'Anda'}! Pesan berhasil dikirim.`);
                    contactForm.reset();
                    playPop('success');
                } else {
                    // Surface the exact API error so a bad key/missing field is obvious
                    const apiMsg = data.message || data.error || 'Gagal mengirim';
                    console.error('Web3Forms API error:', apiMsg);
                    showToast(`Gagal: ${apiMsg}`);
                    throw new Error(apiMsg);
                }
            } catch (err) {
                console.error('Form submit error:', err);
                showToast('Gagal mengirim pesan. Periksa konsol browser (F12) untuk detail.');
            } finally {
                if (submitBtn) {
                    submitBtn.innerHTML = '<span>Kirim Pesan</span> <i class="fa-solid fa-paper-plane btn-icon"></i>';
                    submitBtn.disabled = false;
                }
            }
        });
    }

    // ==========================================
    // 10. COMMAND-LINE NETWORK WORDLE MINIGAME (NETGUESS)
    // ==========================================
    const gameScreen = document.getElementById('game-screen');
    const gameGrid = document.getElementById('game-grid');
    const gameInput = document.getElementById('game-input');
    const hpFill = document.getElementById('hp-fill');
    const gameWordLen = document.getElementById('game-word-len');
    const gameRestartBtn = document.getElementById('game-restart-btn');
    const gameHintBtn = document.getElementById('game-hint-btn');

    const NETWORDS = [
        'ROUTER', 'MODEM', 'LINUX', 'DEBIAN', 'WIFI', 'CABLE', 'SERVER', 'PACKET',
        'SWITCH', 'DOMAIN', 'PROXY', 'FIBER', 'GATEWAY', 'NETWORK', 'ACCESS',
        'SOCKET', 'UPLINK', 'BROWSER', 'CLOUD', 'APACHE', 'UBUNTU', 'KERNEL',
        'TELNET', 'MIKROTIK', 'FIREWALL', 'PING', 'DNS', 'SSH'
    ];
    const NETWORD_HINTS = {
        'ROUTER': 'Perangkat yang meneruskan paket data antar jaringan',
        'MODEM': 'Modulator-demodulator, jembatan koneksi internet ke rumah',
        'LINUX': 'Sistem operasi open-source favorit para admin server',
        'DEBIAN': 'Distro Linux stabil yang menjadi dasar banyak server',
        'WIFI': 'Teknologi nirkabel untuk menghubungkan perangkat ke internet',
        'CABLE': 'Media fisik penghantar sinyal data pada jaringan',
        'SERVER': 'Komputer pusat yang menyimpan dan melayani data',
        'PACKET': 'Unit kecil data yang dikirim melewati jaringan',
        'SWITCH': 'Perangkat yang menghubungkan banyak perangkat dalam satu LAN',
        'DOMAIN': 'Nama unik alamat website, contohnya .com',
        'PROXY': 'Perantara antara klien dan server di internet',
        'FIBER': 'Jenis kabel berbasis cahaya dengan kecepatan sangat tinggi',
        'GATEWAY': 'Pintu keluar-masuk yang menghubungkan dua jaringan berbeda',
        'NETWORK': 'Kumpulan komputer dan perangkat yang saling terhubung',
        'ACCESS': 'Point yang memancarkan sinyal Wi-Fi (Access ___)',
        'SOCKET': 'Endpoint komunikasi data antara dua program',
        'UPLINK': 'Koneksi menuju jaringan atau provider di hulu',
        'BROWSER': 'Aplikasi yang dipakai untuk menjelajah dunia maya',
        'CLOUD': 'Layanan penyimpanan dan komputasi berbasis internet',
        'APACHE': 'Web server open-source yang sangat populer',
        'UBUNTU': 'Distro Linux ramah pengguna yang berbasis Debian',
        'KERNEL': 'Inti sistem operasi yang mengatur perangkat keras',
        'TELNET': 'Protokol lama untuk mengakses terminal jarak jauh',
        'MIKROTIK': 'Merk router dan sistem operasi router kebanggaan Indonesia',
        'FIREWALL': 'Tembok pertahanan yang menyaring lalu lintas jaringan',
        'PING': 'Perintah untuk menguji konektivitas ke host lain',
        'DNS': 'Penerjemah nama domain menjadi alamat IP',
        'SSH': 'Protokol aman untuk mengendalikan server dari jarak jauh'
    };
    const MAX_GUESSES = 5;

    let secretWord = '';
    let guesses = [];
    let revealedLetters = [];

    function pickSecretWord() {
        return NETWORDS[Math.floor(Math.random() * NETWORDS.length)];
    }

    function logToScreen(text) {
        if (!gameScreen) return;
        gameScreen.innerHTML += `${text}<br>`;
        gameScreen.scrollTop = gameScreen.scrollHeight;
    }

    function buildGrid() {
        if (!gameGrid) return;
        gameGrid.innerHTML = '';
        for (let r = 0; r < MAX_GUESSES; r++) {
            const row = document.createElement('div');
            row.className = 'game-row';
            for (let c = 0; c < secretWord.length; c++) {
                const cell = document.createElement('div');
                cell.className = 'game-cell';
                row.appendChild(cell);
            }
            gameGrid.appendChild(row);
        }
    }

    function updateHp() {
        const remaining = MAX_GUESSES - guesses.length;
        const pct = (remaining / MAX_GUESSES) * 100;
        if (hpFill) {
            hpFill.style.width = `${pct}%`;
            hpFill.classList.toggle('low', remaining <= 2);
        }
        if (gameWordLen) gameWordLen.innerText = `PANJANG KATA: ${secretWord.length} // ${remaining}/5 HP`;
    }

    function checkGuess(guess) {
        const result = guess.split('').map((ch, i) => ch === secretWord[i] ? 'correct' : 'absent');
        const remaining = {};
        for (let i = 0; i < secretWord.length; i++) {
            if (result[i] !== 'correct') {
                remaining[secretWord[i]] = (remaining[secretWord[i]] || 0) + 1;
            }
        }
        for (let i = 0; i < guess.length; i++) {
            if (result[i] !== 'correct' && remaining[guess[i]] > 0) {
                result[i] = 'present';
                remaining[guess[i]]--;
            }
        }
        return result;
    }

    function renderGuess(guessIndex, guess, result) {
        const rows = gameGrid.querySelectorAll('.game-row');
        if (!rows[guessIndex]) return;
        const cells = rows[guessIndex].querySelectorAll('.game-cell');
        guess.split('').forEach((ch, i) => {
            if (cells[i]) {
                cells[i].innerText = ch;
                cells[i].classList.add('filled', result[i]);
            }
        });
    }

    function revealHint() {
        if (!gameInput || gameInput.disabled) return;

        const hintText = NETWORD_HINTS[secretWord];
        if (hintText) {
            logToScreen(`[HINT] CLUE: ${hintText}.`);
        }

        // Reveal one unrevealed letter at its correct position
        const available = [];
        for (let i = 0; i < secretWord.length; i++) {
            if (!revealedLetters[i]) available.push(i);
        }

        if (available.length === 0) {
            logToScreen(`[HINT] SEMUA HURUF SUDAH TERBUKA. SEKARANG TINGGAL DIJAWAB!`);
            playPop('toggle');
            return;
        }

        const idx = available[Math.floor(Math.random() * available.length)];
        revealedLetters[idx] = true;

        const rows = gameGrid.querySelectorAll('.game-row');
        const currentRow = rows[guesses.length];
        if (currentRow) {
            const cells = currentRow.querySelectorAll('.game-cell');
            if (cells[idx]) {
                cells[idx].innerText = secretWord[idx];
                cells[idx].classList.add('filled', 'hint');
            }
        }

        logToScreen(`[HINT] SISTEM MENGUNGKAP HURUF POSISI ${idx + 1}: '${secretWord[idx]}'.`);
        playPop('hover');
    }

    function submitGuess() {
        if (!gameInput || gameInput.disabled) return;
        const guess = gameInput.value.trim().toUpperCase();
        gameInput.value = '';

        if (!/^[A-Z]+$/.test(guess)) {
            logToScreen(`[WARN] INPUT TIDAK VALID: HANYA HURUF A-Z YANG DITERIMA.`);
            playPop('toggle');
            return;
        }
        if (guess.length !== secretWord.length) {
            logToScreen(`[WARN] PANJANG KATA HARUS ${secretWord.length} HURUF (KAMU MENGETIK ${guess.length}).`);
            playPop('toggle');
            return;
        }

        const result = checkGuess(guess);
        guesses.push(guess);
        renderGuess(guesses.length - 1, guess, result);
        updateHp();

        const isWin = result.every(r => r === 'correct');

        if (isWin) {
            logToScreen(`[LEVEL_UP] KATA '${guess}' DITEBAK DENGAN SEMPURNA!`);
            logToScreen(`[RPG] SELAMAT! KAMU DIPROMOSIKAN MENJADI NETWORK ADMIN.`);
            gameInput.disabled = true;
            showToast(`LEVEL UP! '${guess}' berhasil ditebak!`);
            playPop('success');
        } else if (guesses.length >= MAX_GUESSES) {
            logToScreen(`[GAME_OVER] KESEMPATAN HABIS. KATA RAHASIA: '${secretWord}'.`);
            logToScreen(`[RPG] SYSTEM OVERLOAD... MISSION FAILED.`);
            gameInput.disabled = true;
            showToast(`GAME OVER! Kata rahasia: ${secretWord}`);
            playPop('toggle');
        } else {
            logToScreen(`[INFO] TEBAKAN '${guess}' TERPROSES. ${MAX_GUESSES - guesses.length} KESEMPATAN TERSISA.`);
            playPop('click');
        }
    }

    function initGame() {
        secretWord = pickSecretWord();
        guesses = [];
        revealedLetters = new Array(secretWord.length).fill(false);
        if (gameInput) {
            gameInput.disabled = false;
            gameInput.value = '';
            gameInput.maxLength = secretWord.length;
        }
        buildGrid();
        updateHp();
        if (gameScreen) {
            gameScreen.innerHTML = `[SYS_INIT] KATA RAHASIA BARU DIMUAT (${secretWord.length} HURUF).<br>` +
                `[SYS_INIT] TEBAK KATA PERANGKAT JARINGAN SEBELUM 5 KESEMPATAN HABIS.<br>` +
                `[SYS_INIT] RUN: KETIK TEBAKANMU DI BAWAH, LALU TEKAN ENTER.`;
        }
        playPop('success');
    }

    if (gameInput) {
        gameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submitGuess();
        });
    }

    // Only focus the input when the user clicks into the terminal, never on page load
    const gameTerminal = document.querySelector('.game-terminal');
    if (gameTerminal && gameInput) {
        gameTerminal.addEventListener('click', () => {
            if (!gameInput.disabled) gameInput.focus();
        });
    }

    if (gameRestartBtn) {
        gameRestartBtn.addEventListener('click', initGame);
    }

    if (gameHintBtn) {
        gameHintBtn.addEventListener('click', revealHint);
    }

    // Init the minigame on page load
    initGame();

    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        if (toast && toastMessage) {
            toastMessage.innerText = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3500);
        }
    }
});

// ==========================================
// 11. ZAPIER CHATBOT LAUNCHER REPOSITIONING
// ==========================================
// Move the chatbot launcher away from the floating HUD buttons (bottom-right)
// to the bottom-left corner. The launcher lives inside the component's shadow DOM
// as a small fixed-position element, so we watch for it to render and move it.
function repositionChatbotLauncher() {
    const bot = document.querySelector('zapier-interfaces-chatbot-embed');
    if (!bot) return false;

    const root = bot.shadowRoot || bot;
    if (!root) return false;

    // Try known selectors first
    let launcher = root.querySelector('[part="launcher"], .launcher, [class*="launcher"]');
    if (!launcher) {
        // Fallback: find the smallest element positioned at the bottom-right corner
        const candidates = root.querySelectorAll('*');
        for (const el of candidates) {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            const isCorner = style.position === 'fixed' &&
                window.innerWidth - rect.right <= 100 &&
                window.innerHeight - rect.bottom <= 100;
            if (isCorner && rect.width > 0 && rect.width <= 200 && rect.height <= 200) {
                launcher = el;
                break;
            }
        }
    }

    if (!launcher) return false;

    const rect = launcher.getBoundingClientRect();
    if (rect.width > 200 || rect.height > 200) return false;

    launcher.style.position = 'fixed';
    launcher.style.bottom = '24px';
    launcher.style.left = '24px';
    launcher.style.right = 'auto';
    launcher.style.zIndex = '98';
    return true;
}

(function watchChatbotPosition() {
    // Keep re-applying: the component may re-render its shadow DOM later
    setInterval(() => {
        repositionChatbotLauncher();
    }, 500);

    const observer = new MutationObserver(() => {
        repositionChatbotLauncher();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    repositionChatbotLauncher();
})();

// ==========================================
// 12. SCROLL MOTION ENGINE (framer-motion style)
// ==========================================
(function initScrollMotion() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Entrance reveals (while-in-view) ---
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (!prefersReduced && revealEls.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in-view');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-in-view'));
    }

    // --- Scroll-linked fly-up & fade (framer-motion useScroll style) ---
    const flyEls = document.querySelectorAll('[data-fly]');

    if (!prefersReduced && flyEls.length) {
        // Store a fixed reference position (document-space, unaffected by transforms)
        // to avoid a feedback loop where the applied transform skews the math.
        const flyRefs = new Map();

        function measureFlyRefs() {
            // Temporarily reset transforms so measurements reflect natural layout
            flyEls.forEach(el => {
                el.style.transform = '';
                el.style.opacity = '';
            });
            flyEls.forEach(el => {
                const rect = el.getBoundingClientRect();
                flyRefs.set(el, {
                    top: rect.top + window.scrollY,
                    height: rect.height
                });
            });
        }

        measureFlyRefs();

        let flyTicking = false;

        function updateFlyTransforms() {
            flyTicking = false;
            const vh = window.innerHeight;
            const scrollY = window.scrollY;

            flyEls.forEach(el => {
                const ref = flyRefs.get(el);
                if (!ref) return;

                // progress = how far the element's top has scrolled above the
                // viewport top. <= 0 means it hasn't left yet -> fully at rest.
                const progress = (scrollY - ref.top) / vh;
                const clamped = Math.max(0, Math.min(2, progress));

                // Deterministic, scroll-position-based transform (no easing lag,
                // so the element always returns exactly to its resting spot)
                const y = -clamped * 180;
                const fadeOut = clamped * 1.2;
                const opacity = Math.max(0, 1 - fadeOut);

                el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
                el.style.opacity = opacity.toFixed(4);
            });
        }

        window.addEventListener('scroll', () => {
            if (!flyTicking) {
                flyTicking = true;
                requestAnimationFrame(updateFlyTransforms);
            }
        }, { passive: true });

        window.addEventListener('resize', () => {
            measureFlyRefs();
            if (!flyTicking) {
                flyTicking = true;
                requestAnimationFrame(updateFlyTransforms);
            }
        });

        window.addEventListener('load', () => {
            measureFlyRefs();
            updateFlyTransforms();
        });

        updateFlyTransforms();
    }

    // --- Top scroll progress bar ---
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        function updateProgressBar() {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const pct = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
            progressBar.style.width = `${pct}%`;
        }
        window.addEventListener('scroll', updateProgressBar, { passive: true });
        window.addEventListener('resize', updateProgressBar);
        updateProgressBar();
    }

    // ==========================================
    // 13. WEBGL-STYLE NETWORK PARTICLES (hero canvas)
    // ==========================================
    const netCanvas = document.getElementById('net-canvas');
    if (netCanvas && !prefersReduced) {
        const ctx = netCanvas.getContext('2d');
        const hero = document.getElementById('main');
        let particles = [];
        let W = 0;
        let H = 0;
        let rafId = null;
        const mouse = { x: -9999, y: -9999 };

        const PARTICLE_COUNT = 55;
        const LINK_DISTANCE = 130;

        function resizeCanvas() {
            const rect = hero.getBoundingClientRect();
            W = Math.max(rect.width, 320);
            H = Math.max(rect.height, 320);
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            netCanvas.width = W * dpr;
            netCanvas.height = H * dpr;
            netCanvas.style.width = `${W}px`;
            netCanvas.style.height = `${H}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            initParticles();
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.55,
                    vy: (Math.random() - 0.5) * 0.55,
                    r: Math.random() * 2 + 1
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, W, H);

            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;

                // Attract gently toward cursor
                const dxm = mouse.x - p.x;
                const dym = mouse.y - p.y;
                const distM = Math.hypot(dxm, dym);
                if (distM < 180 && distM > 1) {
                    p.x += (dxm / distM) * 0.6;
                    p.y += (dym / distM) * 0.6;
                }

                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
            }

            // Link lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < LINK_DISTANCE) {
                        const alpha = (1 - dist / LINK_DISTANCE) * 0.45;
                        ctx.strokeStyle = `rgba(0, 229, 255, ${alpha.toFixed(3)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            // Nodes
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 214, 0, 0.85)';
                ctx.fill();
            }

            rafId = requestAnimationFrame(drawParticles);
        }

        function stopParticles() {
            if (rafId) cancelAnimationFrame(rafId);
        }

        window.addEventListener('resize', resizeCanvas);

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        hero.addEventListener('mouseleave', () => {
            mouse.x = -9999;
            mouse.y = -9999;
        });

        resizeCanvas();
        drawParticles();
    }
})();

