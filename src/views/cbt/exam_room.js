// ==================== FILE: src/views/cbt/exam_room.js ====================
/**
 * MATHENA EXAM CBT ENVIRONMENT & ADMIN CONTROL CENTER
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const CBTExamRoomView = {
  activeTab: 'jadwal', // 'jadwal' | 'soal' | 'monitor'
  examList: [],
  selectedExamId: '',

  render() {
    const role = (store.getState().role || '').toUpperCase();
    const isAdminOrGuru = role === 'ADMIN' || role === 'GURU' || role === 'ADMIN_GURU';

    if (isAdminOrGuru) {
      return this.renderAdminCbtControl();
    } else {
      return this.renderStudentExamPortal();
    }
  },

  // ==========================================
  // VIEW ADMIN & GURU: EXAM CONTROL CENTER
  // ==========================================
  renderAdminCbtControl() {
    return `
      <div style="max-width: 1200px; margin: 0 auto;">
        
        <!-- HEADER CONTROL -->
        <div class="glass-panel polygonal-accent" style="padding: 24px; margin-bottom: 20px; border-left: 4px solid var(--teal-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div>
              <span class="badge badge-teal" style="margin-bottom: 6px;">CBT Management Center</span>
              <h1 style="font-size: 1.6rem; color: var(--white-crisp);">💻 Manajemen EXAM CBT Terpadu</h1>
              <p style="font-size: 0.85rem; color: var(--white-muted);">
                Atur jadwal ujian, PIN sesi, bank soal (PG, PG Kompleks, BS AKM, Menjodohkan, Esai), dan pantau siswa real-time.
              </p>
            </div>
            <button id="btn-create-new-exam" class="btn btn-primary">
              <span>+ Buat Jadwal Ujian Baru</span>
            </button>
          </div>
        </div>

        <!-- TABS CBT -->
        <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid var(--glass-border); padding-bottom: 12px;">
          <button class="btn btn-primary btn-sm cbt-tab-btn" data-tab="tab-jadwal">📅 Jadwal & Sesi Ujian</button>
          <button class="btn btn-secondary btn-sm cbt-tab-btn" data-tab="tab-soal">📚 Kelola Bank Soal</button>
          <button class="btn btn-secondary btn-sm cbt-tab-btn" data-tab="tab-monitor">📡 Monitor Ujian Real-Time</button>
        </div>

        <!-- TAB 1: DAFTAR JADWAL UJIAN -->
        <div id="tab-jadwal" class="cbt-tab-content">
          <div class="table-container glass-panel">
            <table class="mathena-table">
              <thead>
                <tr>
                  <th>Mata Pelajaran & Kelas</th>
                  <th>Waktu Pelaksanaan</th>
                  <th>Durasi</th>
                  <th>PIN Sesi</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody id="cbt-exam-table-body">
                <tr>
                  <td colspan="6" style="text-align:center; padding: 24px; color: var(--white-muted);">Memuat daftar jadwal ujian...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 2: BANK SOAL (MANUAL & BATCH) -->
        <div id="tab-soal" class="cbt-tab-content" style="display: none;">
          <div class="glass-panel" style="padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 16px;">
              <label class="form-label" style="margin: 0; font-weight: 600;">Pilih Ujian:</label>
              <select id="cbt-select-exam-question" class="form-select" style="max-width: 320px; height: 38px;">
                <option value="">-- Pilih Mata Pelajaran --</option>
              </select>
              <button id="btn-show-batch-import" class="btn btn-gold btn-sm">+ Input Soal Batch (Paste)</button>
            </div>

            <!-- BATCH PASTE MODAL -->
            <div id="batch-paste-box" style="display: none; background: rgba(15,23,42,0.85); padding: 18px; border-radius: var(--radius-sm); border: 1px solid var(--gold-celestial); margin-bottom: 18px;">
              <h4 style="color: var(--gold-celestial); margin-bottom: 8px;">📋 Tempel Soal PG Batch (Format Standar)</h4>
              <p style="font-size: 0.78rem; color: var(--white-muted); margin-bottom: 10px;">
                Format: Nomor diikuti titik, Pilihan A-E, dan baris kunci "Jawaban: B".
              </p>
              <textarea id="batch-paste-textarea" class="form-textarea" rows="6" placeholder="1. Nilai dari 5 x 5 adalah?\nA. 10\nB. 25\nC. 30\nJawaban: B"></textarea>
              <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
                <button type="button" id="btn-cancel-batch" class="btn btn-secondary btn-sm">Batal</button>
                <button type="button" id="btn-submit-batch" class="btn btn-primary btn-sm">Proses & Simpan Soal</button>
              </div>
            </div>

            <div id="cbt-questions-list-container" class="table-container">
              <p style="color: var(--white-muted); text-align: center; padding: 20px;">Silakan pilih jadwal ujian di atas untuk melihat butir soal.</p>
            </div>
          </div>
        </div>

        <!-- TAB 3: MONITORING PENGAWAS REAL-TIME -->
        <div id="tab-monitor" class="cbt-tab-content" style="display: none;">
          <div class="glass-panel" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="color: var(--teal-primary);">Pantauan Langsung Peserta Ujian</h3>
              <button id="btn-refresh-monitor" class="btn btn-outline-teal btn-sm">🔄 Refresh Data</button>
            </div>
            <div class="table-container">
              <table class="mathena-table">
                <thead>
                  <tr>
                    <th>Nama Siswa (ID)</th>
                    <th>Kelas</th>
                    <th>Status Ujian</th>
                    <th>Waktu Submit</th>
                    <th>Nilai</th>
                    <th>Aksi Pengawas</th>
                  </tr>
                </thead>
                <tbody id="cbt-monitor-table-body">
                  <tr><td colspan="6" style="text-align:center; padding: 20px;">Memuat status peserta...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  // ==========================================
  // VIEW SISWA: RUANG UJIAN & PIN VALIDATION
  // ==========================================
  renderStudentExamPortal() {
    return `
      <div style="max-width: 500px; margin: 40px auto;">
        <div class="glass-panel polygonal-accent" style="padding: 36px 28px; text-align: center; border: 1px solid var(--glass-border-teal);">
          <span style="font-size: 2.5rem;">💻</span>
          <h2 style="font-size: 1.5rem; color: var(--white-crisp); margin: 12px 0 6px;">Ruang Ujian EXAM CBT</h2>
          <p style="font-size: 0.82rem; color: var(--white-muted); margin-bottom: 24px;">
            Masukkan PIN Sesi yang diberikan oleh Guru/Pengawas untuk memulai ujian.
          </p>

          <form id="form-enter-student-exam">
            <div class="form-group" style="text-align: left;">
              <label class="form-label">PIN Sesi Ujian (5 Digit)</label>
              <input type="text" id="student-exam-pin" class="form-input" placeholder="Contoh: 12345" style="text-align: center; font-size: 1.4rem; letter-spacing: 4px; font-weight: 700;" required />
            </div>

            <button type="submit" class="btn btn-gold btn-lg" style="width: 100%; font-weight: 700; margin-top: 10px;">
              MASUK & MULAI UJIAN
            </button>
          </form>
        </div>
      </div>
    `;
  },

  initEvents() {
    const role = (store.getState().role || '').toUpperCase();
    const isAdminOrGuru = role === 'ADMIN' || role === 'GURU' || role === 'ADMIN_GURU';

    if (isAdminOrGuru) {
      this.initAdminEvents();
    } else {
      this.initStudentEvents();
    }
  },

  initAdminEvents() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.cbt-tab-btn');
    const tabContents = document.querySelectorAll('.cbt-tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        tabBtns.forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-secondary'); });
        btn.classList.remove('btn-secondary'); btn.classList.add('btn-primary');
        tabContents.forEach(tc => tc.style.display = tc.id === target ? 'block' : 'none');

        if (target === 'tab-monitor') this.loadMonitoringData();
      });
    });

    this.loadExamsTable();

    const btnRefreshMon = document.getElementById('btn-refresh-monitor');
    if (btnRefreshMon) btnRefreshMon.addEventListener('click', () => this.loadMonitoringData());

    const btnBatch = document.getElementById('btn-show-batch-import');
    const batchBox = document.getElementById('batch-paste-box');
    if (btnBatch && batchBox) {
      btnBatch.addEventListener('click', () => batchBox.style.display = 'block');
    }
    const btnCancelBatch = document.getElementById('btn-cancel-batch');
    if (btnCancelBatch && batchBox) {
      btnCancelBatch.addEventListener('click', () => batchBox.style.display = 'none');
    }

    // Submit batch questions
    const btnSubmitBatch = document.getElementById('btn-submit-batch');
    if (btnSubmitBatch) {
      btnSubmitBatch.addEventListener('click', async () => {
        const examId = document.getElementById('cbt-select-exam-question').value;
        const text = document.getElementById('batch-paste-textarea').value.trim();
        if (!examId) { store.showToast('Pilih ujian terlebih dahulu.', 'warning'); return; }
        if (!text) { store.showToast('Isi teks soal batch.', 'warning'); return; }

        try {
          const parsedQs = this.parseBatchQuestions(text);
          await api.importQuestions(examId, parsedQs);
          store.showToast(`Berhasil menambahkan ${parsedQs.length} butir soal!`, 'success');
          batchBox.style.display = 'none';
          this.loadQuestionsTable(examId);
        } catch (err) {
          store.showToast(`Gagal: ${err.message}`, 'error');
        }
      });
    }

    const selectExamQ = document.getElementById('cbt-select-exam-question');
    if (selectExamQ) {
      selectExamQ.addEventListener('change', (e) => this.loadQuestionsTable(e.target.value));
    }
  },

  async loadExamsTable() {
    const tbody = document.getElementById('cbt-exam-table-body');
    const select = document.getElementById('cbt-select-exam-question');
    try {
      const res = await api.getExamList();
      const list = res.data || [];
      this.examList = list;

      if (select) {
        select.innerHTML = '<option value="">-- Pilih Mata Pelajaran --</option>' + 
          list.map(e => `<option value="${e.id}">${e.subject} (${e.class})</option>`).join('');
      }

      if (tbody) {
        if (list.length === 0) {
          tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: var(--white-muted);">Belum ada jadwal ujian.</td></tr>`;
          return;
        }
        tbody.innerHTML = list.map(e => `
          <tr>
            <td>
              <div style="font-weight: 600; color: var(--white-crisp);">${e.subject}</div>
              <div style="font-size: 0.75rem; color: var(--white-muted);">Kelas: ${e.class}</div>
            </td>
            <td>${new Date(e.date).toLocaleDateString('id-ID')}</td>
            <td>${e.duration} Menit</td>
            <td><code style="color: var(--gold-celestial); font-weight:700; font-size: 1rem;">${e.pin}</code></td>
            <td><span class="badge ${e.status === 'Aktif' ? 'badge-success' : 'badge-muted'}">${e.status}</span></td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="alert('Jadwal: ${e.subject}')">Detail</button>
            </td>
          </tr>
        `).join('');
      }
    } catch {
      if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: var(--danger-crimson);">Gagal memuat jadwal ujian.</td></tr>`;
    }
  },

  async loadQuestionsTable(examId) {
    const container = document.getElementById('cbt-questions-list-container');
    if (!examId) {
      container.innerHTML = `<p style="color: var(--white-muted); text-align: center; padding: 20px;">Silakan pilih jadwal ujian di atas.</p>`;
      return;
    }
    try {
      const res = await api.getQuestions(examId);
      const qs = res.data || [];
      if (qs.length === 0) {
        container.innerHTML = `<p style="color: var(--white-muted); text-align: center; padding: 20px;">Belum ada soal pada ujian ini.</p>`;
        return;
      }
      container.innerHTML = `
        <table class="mathena-table">
          <thead>
            <tr><th>No</th><th>Tipe</th><th>Pertanyaan</th><th>Pilihan & Kunci</th><th>Bobot</th></tr>
          </thead>
          <tbody>
            ${qs.map((q, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><span class="badge badge-teal">${q.type}</span></td>
                <td><div class="katex-render-area">${q.content}</div></td>
                <td><div style="font-size:0.75rem; color: var(--teal-primary);">Kunci: <strong>${q.key}</strong></div></td>
                <td>${q.point}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      Layout.renderMathFormulas(container);
    } catch (err) {
      container.innerHTML = `<p style="color: var(--danger-crimson); padding: 20px;">Gagal memuat butir soal: ${err.message}</p>`;
    }
  },

  async loadMonitoringData() {
    const tbody = document.getElementById('cbt-monitor-table-body');
    try {
      const res = await api.getMonitorData();
      const list = res.data || [];
      if (tbody) {
        tbody.innerHTML = list.map(m => `
          <tr>
            <td>
              <div style="font-weight:600; color: var(--white-crisp);">${m.fullName}</div>
              <div style="font-size:0.72rem; color: var(--white-muted);">${m.studentId}</div>
            </td>
            <td>${m.classId}</td>
            <td><span class="badge ${m.status === 'Selesai' ? 'badge-success' : (m.status === 'Curang' ? 'badge-danger' : 'badge-teal')}">${m.status}</span></td>
            <td>${m.submitTime || '-'}</td>
            <td><strong style="color: var(--gold-celestial); font-size:1.1rem;">${m.score}</strong></td>
            <td>
              ${m.status === 'Curang' ? `<button class="btn btn-outline-teal btn-sm" onclick="alert('Buka blokir ${m.fullName}')">Buka Blokir</button>` : ''}
              ${m.responseId ? `<button class="btn btn-secondary btn-sm" onclick="alert('Reset ujian ${m.fullName}')">Reset</button>` : '-'}
            </td>
          </tr>
        `).join('');
      }
    } catch {
      if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: var(--danger-crimson);">Gagal memuat monitoring.</td></tr>`;
    }
  },

  parseBatchQuestions(text) {
    const blocks = text.trim().split(/\n\s*\n/);
    const result = [];

    blocks.forEach(b => {
      const lines = b.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      let qText = '';
      let opts = [];
      let key = '';

      lines.forEach(l => {
        if (/^(jawaban|kunci)\s*:/i.test(l)) {
          const match = l.match(/:\s*([A-Ea-e])/);
          if (match) key = match[1].toUpperCase();
        } else if (/^[A-Ea-e][.)]/i.test(l)) {
          opts.push(l.substring(2).trim());
        } else {
          qText += (qText ? ' ' : '') + l;
        }
      });

      if (qText && opts.length >= 2) {
        result.push({
          type: 'PG',
          content: qText,
          options: opts,
          correct: key || opts[0],
          isRequired: 'TRUE',
          point: 10
        });
      }
    });

    return result;
  },

  initStudentEvents() {
    const form = document.getElementById('form-enter-student-exam');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pin = document.getElementById('student-exam-pin').value.trim();
        try {
          const res = await api.startStudentExam(pin, '8A');
          store.showToast(`Memulai ujian: ${res.data.subject}`, 'success');
          // Launch Exam View
          alert(`Ujian ${res.data.subject} berhasil dimulai! Durasi: ${res.data.duration} menit.`);
        } catch (err) {
          store.showToast(`Gagal: ${err.message}`, 'error');
        }
      });
    }
  }
};
