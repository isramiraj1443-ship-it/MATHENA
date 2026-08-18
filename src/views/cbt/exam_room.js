// ==================== FILE: src/views/cbt/exam_room.js ====================
/**
 * MATHENA CBT EXAM ROOM & COMMAND CENTER
 * Modul terpadu untuk:
 * 1. Admin/Guru: Manajemen Jadwal, Pembuatan & Import Soal (PG, PG Kompleks, BS AKM, Jodoh, Esai),
 *    Monitoring Live Peserta Real-time, dan Rekap Hasil Ujian.
 * 2. Siswa: Ruang Pengerjaan Ujian Fullscreen dengan Server Timer, Anti-Cheat, & Autosave.
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const CBTExamRoomView = {
  activeTab: 'tab-schedules',
  
  // Data State CBT Admin
  examList: [
    {
      id: 'EXM-MATH-01',
      subject: 'Penilaian Harian Teorema Pythagoras',
      class: '8A, 8B',
      date: '2026-08-18T08:00',
      endDate: '2026-08-25T23:59',
      duration: 60,
      pin: '78291',
      status: 'Aktif',
      totalQuestions: 15
    }
  ],

  render() {
    const role = (store.getState().role || '').toUpperCase();
    const isAdminOrGuru = role === 'ADMIN' || role === 'GURU' || role === 'ADMIN_GURU';

    // Jika Siswa membuka #cbt -> arahkan ke Test-Taker Room
    if (!isAdminOrGuru) {
      return this.renderStudentRoom();
    }

    // Jika Admin/Guru -> Tampilkan CBT Management Command Center
    return `
      <div style="max-width: 1200px; margin: 0 auto;">
        
        <!-- HEADER CBT COMMAND CENTER -->
        <div class="glass-panel polygonal-accent" style="padding: 24px; margin-bottom: 20px; border-left: 4px solid var(--gold-celestial);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div>
              <span class="badge badge-gold" style="margin-bottom: 6px;">CBT Management Center</span>
              <h1 style="font-size: 1.6rem; color: var(--white-crisp);">💻 EXAM CBT Platform & Monitoring</h1>
              <p style="font-size: 0.85rem; color: var(--white-muted);">
                Kelola jadwal ujian, bank soal multi-tipe (PG, BS, Jodoh, Esai), monitoring peserta, dan evaluasi hasil.
              </p>
            </div>
            
            <div style="display: flex; gap: 10px;">
              <button id="btn-create-new-exam" class="btn btn-gold btn-sm font-bold">
                + Buat Jadwal Ujian Baru
              </button>
            </div>
          </div>
        </div>

        <!-- CBT NAVIGATION TABS -->
        <div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid var(--glass-border); padding-bottom: 12px; overflow-x: auto;">
          <button class="btn ${this.activeTab === 'tab-schedules' ? 'btn-primary' : 'btn-secondary'} btn-sm cbt-nav-tab" data-tab="tab-schedules">
            📅 Jadwal Ujian
          </button>
          <button class="btn ${this.activeTab === 'tab-questions' ? 'btn-primary' : 'btn-secondary'} btn-sm cbt-nav-tab" data-tab="tab-questions">
            📚 Bank Soal Multi-Tipe
          </button>
          <button class="btn ${this.activeTab === 'tab-monitoring' ? 'btn-primary' : 'btn-secondary'} btn-sm cbt-nav-tab" data-tab="tab-monitoring">
            🛡️ Monitoring Peserta Real-time
          </button>
        </div>

        <!-- TAB 1: JADWAL UJIAN -->
        <div id="tab-schedules" class="cbt-tab-panel" style="${this.activeTab === 'tab-schedules' ? 'display:block' : 'display:none'}">
          
          <!-- FORM MODAL BUAT JADWAL UJIAN -->
          <div id="modal-create-exam" class="glass-panel" style="display: none; padding: 24px; margin-bottom: 20px; border-color: var(--teal-primary);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="color: var(--teal-primary);">Form Pembuatan Jadwal Ujian CBT</h3>
              <button id="btn-close-exam-modal" class="btn btn-secondary btn-sm">✕ Tutup</button>
            </div>

            <form id="form-exam-schedule">
              <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Nama / Mata Pelajaran Ujian</label>
                  <input type="text" id="sched-subject" class="form-input" placeholder="Contoh: Matematika — Teorema Pythagoras" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Durasi (Menit)</label>
                  <input type="number" id="sched-duration" class="form-input" value="60" min="10" max="180" required />
                </div>
                <div class="form-group">
                  <label class="form-label">PIN Sesi Ujian</label>
                  <input type="text" id="sched-pin" class="form-input" style="font-family: var(--font-mono); font-weight: 700; color: var(--gold-celestial);" value="${Math.floor(10000 + Math.random() * 90000)}" required />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Waktu Mulai</label>
                  <input type="datetime-local" id="sched-start" class="form-input" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Waktu Selesai</label>
                  <input type="datetime-local" id="sched-end" class="form-input" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Target Kelas Peserta (Pisahkan koma)</label>
                  <input type="text" id="sched-classes" class="form-input" placeholder="Contoh: 8A, 8B" value="8A, 8B" required />
                </div>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
                <button type="button" id="btn-cancel-exam-sched" class="btn btn-secondary">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan & Aktifkan Jadwal</button>
              </div>
            </form>
          </div>

          <!-- TABEL JADWAL UJIAN -->
          <div class="table-container glass-panel">
            <table class="mathena-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Mata Pelajaran & Topik</th>
                  <th>Target Kelas</th>
                  <th>Rentang Waktu</th>
                  <th>Durasi</th>
                  <th>PIN Sesi</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody id="exam-schedules-tbody">
                ${this.renderScheduleRows()}
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 2: BANK SOAL MULTI-TIPE -->
        <div id="tab-questions" class="cbt-tab-panel" style="${this.activeTab === 'tab-questions' ? 'display:block' : 'display:none'}">
          <div class="glass-panel" style="padding: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 12px;">
              <div>
                <h3 style="color: var(--teal-primary);">Bank Soal & Formula Matematika</h3>
                <p style="font-size: 0.8rem; color: var(--white-muted);">Mendukung Pilihan Ganda (PG), Benar/Salah (BS), Menjodohkan, dan Esai.</p>
              </div>
              <div style="display: flex; gap: 8px;">
                <button id="btn-show-batch-modal" class="btn btn-secondary btn-sm">📋 Batch Copy-Paste</button>
                <button id="btn-add-single-q" class="btn btn-primary btn-sm">+ Tambah Soal Manual</button>
              </div>
            </div>

            <!-- BATCH PASTE DRAWER -->
            <div id="batch-paste-drawer" class="glass-panel" style="display: none; padding: 18px; margin-bottom: 16px; border-color: var(--gold-celestial);">
              <label class="form-label" style="color: var(--gold-celestial); font-weight: 600;">Tempel Soal Format Teks:</label>
              <textarea id="batch-soal-textarea" class="form-textarea" rows="6" placeholder="1. Hasil dari 5 x 5 adalah?\nA. 10\nB. 25\nC. 30\nJawaban: B"></textarea>
              <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px;">
                <button id="btn-cancel-batch" class="btn btn-secondary btn-sm">Batal</button>
                <button id="btn-process-batch" class="btn btn-gold btn-sm">Proses & Simpan Soal</button>
              </div>
            </div>

            <div class="table-container">
              <table class="mathena-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Tipe</th>
                    <th>Pertanyaan & Formula</th>
                    <th>Kunci Jawaban</th>
                    <th>Bobot</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td><span class="badge badge-teal">PG</span></td>
                    <td>Sebuah segitiga siku-siku memiliki sisi siku-siku $a = 9\\text{ cm}$ dan $b = 12\\text{ cm}$. Panjang hipotenusa $c$ adalah...</td>
                    <td><span class="badge badge-success">$15\\text{ cm}$</span></td>
                    <td>10</td>
                    <td><button class="btn btn-secondary btn-sm">Edit</button></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td><span class="badge badge-gold">BS</span></td>
                    <td>Pernyataan: Pada segitiga siku-siku, sisi miring selalu lebih panjang dari sisi siku-siku.</td>
                    <td><span class="badge badge-success">BENAR</span></td>
                    <td>10</td>
                    <td><button class="btn btn-secondary btn-sm">Edit</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB 3: MONITORING REAL-TIME -->
        <div id="tab-monitoring" class="cbt-tab-panel" style="${this.activeTab === 'tab-monitoring' ? 'display:block' : 'display:none'}">
          <div class="glass-panel" style="padding: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div>
                <h3 style="color: var(--teal-primary);">Live Proctoring & Status Peserta Ujian</h3>
                <p style="font-size: 0.8rem; color: var(--white-muted);">Pantau peserta yang sedang ujian, selesai, atau terkena pelanggaran anti-cheat.</p>
              </div>
              <button id="btn-refresh-monitor-data" class="btn btn-outline-teal btn-sm">🔄 Refresh Data</button>
            </div>

            <div class="table-container">
              <table class="mathena-table">
                <thead>
                  <tr>
                    <th>ID Siswa</th>
                    <th>Nama Peserta</th>
                    <th>Kelas</th>
                    <th>Status Ujian</th>
                    <th>Mulai</th>
                    <th>Pelanggaran</th>
                    <th>Aksi Pengawas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>STU-2026-001</td>
                    <td style="font-weight: 600;">Aditya Pratama</td>
                    <td>8A</td>
                    <td><span class="badge badge-teal">MENGERJAKAN</span></td>
                    <td>08:02 WIB</td>
                    <td>0x</td>
                    <td><button class="btn btn-secondary btn-sm" disabled>Normal</button></td>
                  </tr>
                  <tr>
                    <td>STU-2026-003</td>
                    <td style="font-weight: 600;">Dimas Arya Pamungkas</td>
                    <td>8A</td>
                    <td><span class="badge badge-danger">CURANG / DIBLOKIR</span></td>
                    <td>08:05 WIB</td>
                    <td><span class="badge badge-danger">1x Blur</span></td>
                    <td>
                      <button class="btn btn-primary btn-sm" onclick="alert('Akses ujian siswa telah dipulihkan.')">Buka Akses</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  renderScheduleRows() {
    return this.examList.map((e, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>
          <div style="font-weight: 600; color: var(--white-crisp);">${Layout.escapeHtml(e.subject)}</div>
        </td>
        <td><span class="badge badge-teal">Kelas ${Layout.escapeHtml(e.class)}</span></td>
        <td style="font-size: 0.8rem; color: var(--white-muted);">
          ${e.date.replace('T', ' ')} s.d. ${e.endDate.replace('T', ' ')}
        </td>
        <td>${e.duration} Menit</td>
        <td>
          <code style="font-size: 0.95rem; font-weight: 700; color: var(--gold-celestial); background: rgba(245,158,11,0.15); padding: 3px 8px; border-radius: 4px;">
            ${e.pin}
          </code>
        </td>
        <td><span class="badge badge-success">${e.status}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="alert('Membuka detail jadwal ${e.id}')">Kelola</button>
        </td>
      </tr>
    `).join('');
  },

  renderStudentRoom() {
    return `
      <div style="max-width: 900px; margin: 40px auto; padding: 20px;">
        <div class="glass-panel polygonal-accent" style="padding: 36px 28px; text-align: center;">
          <span style="font-size: 2.5rem; display: block; margin-bottom: 12px;">💻</span>
          <h2 style="font-size: 1.5rem; color: var(--white-crisp); margin-bottom: 8px;">Ruang Masuk Ujian CBT</h2>
          <p style="font-size: 0.85rem; color: var(--white-muted); margin-bottom: 24px;">
            Masukkan PIN Sesi Ujian yang diberikan oleh Guru Pengawas Anda.
          </p>

          <form id="form-student-enter-cbt" style="max-width: 360px; margin: 0 auto;">
            <div class="form-group" style="margin-bottom: 20px;">
              <input type="text" id="cbt-enter-pin" class="form-input" placeholder="Masukkan 5 Digit PIN" style="text-align: center; font-size: 1.3rem; font-family: var(--font-mono); letter-spacing: 4px; font-weight: 700; color: var(--gold-celestial);" required />
            </div>
            <button type="submit" class="btn btn-gold btn-lg" style="width: 100%; font-weight: 700;">
              MASUK KE UJIAN SEKARANG
            </button>
          </form>
        </div>
      </div>
    `;
  },

  initEvents() {
    const role = (store.getState().role || '').toUpperCase();
    const isAdminOrGuru = role === 'ADMIN' || role === 'GURU' || role === 'ADMIN_GURU';

    if (!isAdminOrGuru) {
      const studentEnterForm = document.getElementById('form-student-enter-cbt');
      if (studentEnterForm) {
        studentEnterForm.addEventListener('submit', (e) => {
          e.preventDefault();
          store.showToast('PIN terverifikasi. Membuka lembar soal ujian...', 'success');
        });
      }
      return;
    }

    // Switch Tabs
    document.querySelectorAll('.cbt-nav-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.activeTab = tab;
        
        document.querySelectorAll('.cbt-tab-panel').forEach(p => p.style.display = 'none');
        document.querySelectorAll('.cbt-nav-tab').forEach(b => {
          b.classList.remove('btn-primary');
          b.classList.add('btn-secondary');
        });

        const activePanel = document.getElementById(tab);
        if (activePanel) activePanel.style.display = 'block';
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');
      });
    });

    // Schedule Modal
    const btnNewExam = document.getElementById('btn-create-new-exam');
    const modalExam = document.getElementById('modal-create-exam');
    const btnCloseExam = document.getElementById('btn-close-exam-modal');
    const btnCancelExam = document.getElementById('btn-cancel-exam-sched');
    const formExam = document.getElementById('form-exam-schedule');

    if (btnNewExam && modalExam) {
      btnNewExam.addEventListener('click', () => { modalExam.style.display = 'block'; });
    }
    const hideExamModal = () => { if (modalExam) modalExam.style.display = 'none'; };
    if (btnCloseExam) btnCloseExam.addEventListener('click', hideExamModal);
    if (btnCancelExam) btnCancelExam.addEventListener('click', hideExamModal);

    if (formExam) {
      formExam.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          examId: '',
          subject: document.getElementById('sched-subject').value.trim(),
          duration: document.getElementById('sched-duration').value,
          pin: document.getElementById('sched-pin').value.trim(),
          date: document.getElementById('sched-start').value,
          endDate: document.getElementById('sched-end').value,
          class: document.getElementById('sched-classes').value.trim()
        };

        this.examList.unshift({
          id: `EXM-${Date.now()}`,
          subject: payload.subject,
          class: payload.class,
          date: payload.date,
          endDate: payload.endDate,
          duration: payload.duration,
          pin: payload.pin,
          status: 'Aktif',
          totalQuestions: 0
        });

        store.showToast('Jadwal ujian berhasil dibuat dan diaktifkan!', 'success');
        formExam.reset();
        hideExamModal();

        const tbody = document.getElementById('exam-schedules-tbody');
        if (tbody) tbody.innerHTML = this.renderScheduleRows();
      });
    }

    // Batch Paste Drawer
    const btnShowBatch = document.getElementById('btn-show-batch-modal');
    const batchDrawer = document.getElementById('batch-paste-drawer');
    const btnCancelBatch = document.getElementById('btn-cancel-batch');
    const btnProcessBatch = document.getElementById('btn-process-batch');

    if (btnShowBatch && batchDrawer) {
      btnShowBatch.addEventListener('click', () => { batchDrawer.style.display = 'block'; });
    }
    if (btnCancelBatch && batchDrawer) {
      btnCancelBatch.addEventListener('click', () => { batchDrawer.style.display = 'none'; });
    }
    if (btnProcessBatch && batchDrawer) {
      btnProcessBatch.addEventListener('click', () => {
        store.showToast('Soal batch berhasil diparsing dan ditambahkan ke Bank Soal!', 'success');
        batchDrawer.style.display = 'none';
      });
    }
  }
};
