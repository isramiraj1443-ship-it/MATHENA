// ==================== FILE: src/views/admin/assignments.js ====================
/**
 * MATHENA ASSIGNMENTS & CORRECTION MANAGEMENT VIEW
 * Mengelola penugasan siswa serta drawer pemeriksaan/koreksi jawaban siswa secara interaktif.
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const AdminAssignmentsView = {
  activeSubmissions: [
    {
      submissionId: 'SUB-001',
      studentName: 'Aditya Pratama',
      studentId: 'STU-2026-001',
      classId: '8A',
      submitTime: '18 Agu 2026, 14:22 WIB',
      fileType: 'PDF',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'Jawaban_SPLDV_Aditya.pdf',
      studentAnswerText: 'Langkah pengerjaan: $$2x + 3y = 12 \\implies x = \\frac{12 - 3y}{2}$$ Substitusi ke persamaan kedua: $$4\\left(\\frac{12 - 3y}{2}\\right) - y = 10 \\implies 24 - 6y - y = 10 \\implies -7y = -14 \\implies y = 2, x = 3$$',
      score: 95,
      feedback: 'Langkah penyederhanaan sangat runtut dan tepat.'
    },
    {
      submissionId: 'SUB-002',
      studentName: 'Citra Dewi Lestari',
      studentId: 'STU-2026-002',
      classId: '8A',
      submitTime: '18 Agu 2026, 15:10 WIB',
      fileType: 'IMAGE',
      fileUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      fileName: 'Foto_Lembar_Jawaban_Citra.jpg',
      studentAnswerText: 'Hasil perhitungan tertera pada foto lembar kerja.',
      score: 90,
      feedback: 'Perhitungan rapi dan teliti.'
    }
  ],

  render() {
    return `
      <div style="max-width: 1150px; margin: 0 auto;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
          <div>
            <h1 style="font-size: 1.6rem; color: var(--white-crisp);">📝 Penugasan & Koreksi Tugas</h1>
            <p style="font-size: 0.85rem; color: var(--white-muted);">
              Buat penugasan LKPD matematika, periksa berkas submission siswa, dan berikan evaluasi nilai.
            </p>
          </div>
          <button id="btn-show-create-assignment" class="btn btn-primary">
            <span>+ Buat Penugasan Baru</span>
          </button>
        </div>

        <!-- MODAL FORM BUAT PENUGASAN -->
        <div id="create-assignment-modal" class="glass-panel" style="display: none; padding: 24px; margin-bottom: 24px; border-color: var(--teal-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="color: var(--teal-primary);">Form Pembuatan Tugas Matematika</h3>
            <button id="btn-close-assignment-form" class="btn btn-secondary btn-sm">✕ Tutup</button>
          </div>

          <form id="form-create-assignment">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Nama / Judul Tugas</label>
                <input type="text" id="assign-title" class="form-input" placeholder="Contoh: LKPD Penyelesaian SPLDV Kontekstual" required />
              </div>
              <div class="form-group">
                <label class="form-label">Kelas</label>
                <select id="assign-class" class="form-select" required>
                  <option value="7A">Kelas 7A</option>
                  <option value="7B">Kelas 7B</option>
                  <option value="8A" selected>Kelas 8A</option>
                  <option value="9A">Kelas 9A</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Batas Waktu (Deadline)</label>
                <input type="datetime-local" id="assign-deadline" class="form-input" required />
              </div>
            </div>

            <label class="form-label">Instruksi Soal / Petunjuk Pengerjaan</label>
            ${Layout.renderMathToolbar('assign-instructions')}
            <div class="form-group">
              <textarea id="assign-instructions" class="form-textarea" rows="4" placeholder="Tuliskan petunjuk pengerjaan dan soal di sini..." required></textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Format Pengumpulan Berkas Diizinkan</label>
                <input type="text" class="form-input" value="PDF, JPG, PNG, DOCX, MP3" readonly style="color: var(--white-muted);" />
              </div>
              <div class="form-group">
                <label class="form-label">Skor Maksimum</label>
                <input type="number" id="assign-max-score" class="form-input" value="100" min="10" max="100" required />
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px;">
              <button type="button" id="btn-cancel-assign" class="btn btn-secondary">Batal</button>
              <button type="submit" class="btn btn-primary">Publikasikan Penugasan</button>
            </div>
          </form>
        </div>

        <!-- DAFTAR PENUGASAN AKTIF -->
        <div class="table-container glass-panel" style="margin-bottom: 24px;">
          <table class="mathena-table">
            <thead>
              <tr>
                <th>Judul Tugas</th>
                <th>Kelas</th>
                <th>Batas Waktu</th>
                <th>Terkumpul</th>
                <th>Status Penilaian</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style="font-weight: 600; color: var(--white-crisp);">Penyelesaian Soal Cerita SPLDV</div>
                  <div style="font-size: 0.75rem; color: var(--white-muted);">Metode Eliminasi & Substitusi</div>
                </td>
                <td><span class="badge badge-teal">Kelas 8A</span></td>
                <td>20 Agustus 2026, 23:59 WIB</td>
                <td><span class="badge badge-success">30 / 32 Siswa</span></td>
                <td><span class="badge badge-gold">2 Perlu Diperiksa</span></td>
                <td>
                  <button class="btn btn-primary btn-sm btn-open-grading" data-title="Penyelesaian Soal Cerita SPLDV">🔍 Periksa Jawaban Siswa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- DRAWER / PANEL PEMERIKSAAN NILAI (KOREKSI) -->
        <div id="grading-drawer-modal" class="glass-panel" style="display: none; padding: 24px; border-color: var(--gold-celestial);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <h3 id="grading-drawer-title" style="color: var(--gold-celestial); font-size: 1.2rem;">Pemeriksaan Submission Siswa</h3>
              <p style="font-size: 0.8rem; color: var(--white-muted);">Periksa uraian matematika, berkas PDF/Foto, dan berikan skor langsung.</p>
            </div>
            <button id="btn-close-grading-drawer" class="btn btn-secondary btn-sm">✕ Tutup</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 18px;" id="submissions-list-container">
            ${this.renderSubmissionsList()}
          </div>
        </div>

      </div>
    `;
  },

  renderSubmissionsList() {
    return this.activeSubmissions.map((sub, idx) => `
      <div class="glass-panel" style="padding: 18px; background: rgba(15,23,42,0.9); border: 1px solid var(--glass-border-teal);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <div>
            <strong style="color: var(--white-crisp); font-size: 1rem;">${sub.studentName}</strong>
            <span style="font-size: 0.75rem; color: var(--white-muted); margin-left: 8px;">(${sub.studentId} • Kelas ${sub.classId})</span>
          </div>
          <span class="badge badge-success">${sub.submitTime}</span>
        </div>

        <!-- Student Math Text Answer -->
        <div style="margin-bottom: 12px; background: rgba(30,41,59,0.7); padding: 12px; border-radius: 6px;">
          <div style="font-size: 0.75rem; color: var(--teal-primary); font-weight:600; margin-bottom: 4px;">Uraian Jawaban Siswa:</div>
          <div class="katex-render-area" style="font-size: 0.92rem; color: var(--white-crisp);">${sub.studentAnswerText}</div>
        </div>

        <!-- Student File Attachment Preview -->
        <div style="margin-bottom: 16px;">
          <span style="font-size: 0.78rem; color: var(--gold-celestial); font-weight:600;">📁 Berkas Jawaban:</span>
          ${sub.fileType === 'IMAGE' ? `
            <div style="margin-top: 6px;">
              <img src="${sub.fileUrl}" alt="Jawaban Siswa" style="max-height: 180px; border-radius: 6px; border: 1px solid var(--glass-border);" />
            </div>
          ` : `
            <div style="margin-top: 6px;">
              <a href="${sub.fileUrl}" target="_blank" class="btn btn-outline-teal btn-sm">📄 Lihat & Buka PDF (${sub.fileName})</a>
            </div>
          `}
        </div>

        <!-- Form Input Skor & Feedback -->
        <div style="display: grid; grid-template-columns: 120px 1fr auto; gap: 12px; align-items: flex-end;">
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Skor (0–100)</label>
            <input type="number" id="grade-score-${idx}" class="form-input" value="${sub.score}" min="0" max="100" />
          </div>
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Catatan Umpan Balik Guru</label>
            <input type="text" id="grade-feedback-${idx}" class="form-input" value="${sub.feedback}" placeholder="Tuliskan apresiasi atau saran perbaikan..." />
          </div>
          <button class="btn btn-gold btn-save-grade" data-index="${idx}">💾 Simpan Nilai</button>
        </div>
      </div>
    `).join('');
  },

  initEvents() {
    Layout.bindMathToolbarEvents();

    const btnShow = document.getElementById('btn-show-create-assignment');
    const modal = document.getElementById('create-assignment-modal');
    const btnClose = document.getElementById('btn-close-assignment-form');
    const btnCancel = document.getElementById('btn-cancel-assign');
    const form = document.getElementById('form-create-assignment');

    const drawer = document.getElementById('grading-drawer-modal');
    const btnCloseDrawer = document.getElementById('btn-close-grading-drawer');

    if (btnShow && modal) {
      btnShow.addEventListener('click', () => {
        modal.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const hideModal = () => { if (modal) modal.style.display = 'none'; };
    if (btnClose) btnClose.addEventListener('click', hideModal);
    if (btnCancel) btnCancel.addEventListener('click', hideModal);

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          title: document.getElementById('assign-title').value.trim(),
          class_id: document.getElementById('assign-class').value,
          due_date: document.getElementById('assign-deadline').value,
          instructions: document.getElementById('assign-instructions').value.trim(),
          max_score: document.getElementById('assign-max-score').value
        };

        try {
          await api.createAssignment(payload);
          store.showToast('Penugasan matematika berhasil dipublikasikan!', 'success');
          form.reset();
          hideModal();
        } catch (err) {
          store.showToast(`Gagal: ${err.message}`, 'error');
        }
      });
    }

    document.querySelectorAll('.btn-open-grading').forEach(btn => {
      btn.addEventListener('click', () => {
        if (drawer) {
          drawer.style.display = 'block';
          drawer.scrollIntoView({ behavior: 'smooth' });
          Layout.renderMathFormulas(drawer);
        }
      });
    });

    if (btnCloseDrawer) {
      btnCloseDrawer.addEventListener('click', () => {
        if (drawer) drawer.style.display = 'none';
      });
    }

    document.querySelectorAll('.btn-save-grade').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-index');
        const score = document.getElementById(`grade-score-${idx}`).value;
        const feedback = document.getElementById(`grade-feedback-${idx}`).value;

        this.activeSubmissions[idx].score = Number(score);
        this.activeSubmissions[idx].feedback = feedback;
        store.showToast(`Nilai (${score}/100) dan umpan balik berhasil disimpan!`, 'success');
      });
    });
  }
};
