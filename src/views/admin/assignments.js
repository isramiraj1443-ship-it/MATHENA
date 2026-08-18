// ==================== FILE: src/views/admin/assignments.js ====================
/**
 * MATHENA ASSIGNMENTS MANAGEMENT VIEW
 * Mengelola penugasan matematika, batas pengumpulan berkas,
 * dan pemeriksaan nilai siswa dengan antarmuka yang bersih.
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const AdminAssignmentsView = {
  render() {
    return `
      <div style="max-width: 1150px; margin: 0 auto;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
          <div>
            <h1 style="font-size: 1.6rem; color: var(--white-crisp);">📝 Penugasan & Koreksi Tugas</h1>
            <p style="font-size: 0.85rem; color: var(--white-muted);">
              Buat tugas matematika terstruktur, pantau submission berkas siswa, dan berikan evaluasi nilai.
            </p>
          </div>
          <button id="btn-show-create-assignment" class="btn btn-primary">
            <span>+ Buat Penugasan Baru</span>
          </button>
        </div>

        <!-- FORM CREATE ASSIGNMENT MODAL -->
        <div id="create-assignment-modal" class="glass-panel" style="display: none; padding: 24px; margin-bottom: 24px; border-color: var(--teal-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="color: var(--teal-primary);">Form Pembuatan Tugas Matematika</h3>
            <button id="btn-close-assignment-form" class="btn btn-secondary btn-sm">✕ Tutup</button>
          </div>

          <form id="form-create-assignment">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Nama / Judul Tugas</label>
                <input type="text" id="assign-title" class="form-input" placeholder="Contoh: Latihan Bentuk Pangkat dan Akar" required />
              </div>
              <div class="form-group">
                <label class="form-label">Kelas</label>
                <select id="assign-class" class="form-select" required>
                  <option value="7A">Kelas 7A</option>
                  <option value="7B">Kelas 7B</option>
                  <option value="8A">Kelas 8A</option>
                  <option value="9A" selected>Kelas 9A</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Batas Pengumpulan (Deadline)</label>
                <input type="datetime-local" id="assign-deadline" class="form-input" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Instruksi Soal / Panduan Pengerjaan</label>
              <textarea id="assign-instructions" class="form-textarea" rows="3" placeholder="Tuliskan petunjuk pengerjaan tugas di sini..." required></textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Format Pengumpulan Berkas</label>
                <input type="text" class="form-input" value="PDF, JPG, PNG, DOCX" readonly style="color: var(--white-muted);" />
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
        <div class="table-container glass-panel">
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
                  <div style="font-weight: 600; color: var(--white-crisp);">Latihan Bentuk Pangkat dan Akar</div>
                  <div style="font-size: 0.75rem; color: var(--white-muted);">Operasi Aljabar Lanjut</div>
                </td>
                <td><span class="badge badge-teal">Kelas 9A</span></td>
                <td>20 Agustus 2026, 23:59 WIB</td>
                <td><span class="badge badge-success">28 / 32 Siswa</span></td>
                <td><span class="badge badge-gold">8 Perlu Diperiksa</span></td>
                <td>
                  <button class="btn btn-primary btn-sm btn-review-submission" data-title="Latihan Bentuk Pangkat dan Akar">Periksa Jawaban</button>
                </td>
              </tr>
              <tr>
                <td>
                  <div style="font-weight: 600; color: var(--white-crisp);">Penyelesaian Soal Cerita SPLDV</div>
                  <div style="font-size: 0.75rem; color: var(--white-muted);">Metode Eliminasi & Substitusi</div>
                </td>
                <td><span class="badge badge-teal">Kelas 8B</span></td>
                <td>18 Agustus 2026, 17:00 WIB</td>
                <td><span class="badge badge-success">30 / 30 Siswa</span></td>
                <td><span class="badge badge-teal">Selesai Dinilai</span></td>
                <td>
                  <button class="btn btn-secondary btn-sm btn-review-submission" data-title="Penyelesaian Soal Cerita SPLDV">Rekap Nilai</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- DRAWER PEMERIKSAAN NILAI -->
        <div id="grading-drawer-modal" class="glass-panel" style="display: none; padding: 24px; margin-top: 24px; border-color: var(--gold-celestial);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 id="grading-drawer-title" style="color: var(--gold-celestial);">Pemeriksaan Jawaban Siswa</h3>
            <button id="btn-close-grading-drawer" class="btn btn-secondary btn-sm">✕ Tutup</button>
          </div>

          <div class="table-container">
            <table class="mathena-table">
              <thead>
                <tr>
                  <th>Nama Siswa (ID)</th>
                  <th>Waktu Submit</th>
                  <th>Berkas Jawaban</th>
                  <th>Skor (0–100)</th>
                  <th>Catatan Feedback</th>
                  <th>Simpan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style="font-weight: 600;">Aditya Pratama</div>
                    <div style="font-size: 0.72rem; color: var(--white-muted);">STU-2026-001</div>
                  </td>
                  <td>18 Agu 2026, 14:22 WIB <span class="badge badge-success" style="font-size:0.65rem;">Tepat Waktu</span></td>
                  <td><a href="#" class="btn btn-outline-teal btn-sm" style="font-size:0.75rem;">📄 Lihat PDF</a></td>
                  <td style="width: 110px;">
                    <input type="number" class="form-input" value="95" min="0" max="100" style="padding: 4px 8px;" />
                  </td>
                  <td>
                    <input type="text" class="form-input" value="Langkah penyederhanaan sangat runtut dan tepat." style="padding: 4px 8px;" />
                  </td>
                  <td>
                    <button class="btn btn-primary btn-sm btn-save-single-grade">Simpan</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  initEvents() {
    const btnShowCreate = document.getElementById('btn-show-create-assignment');
    const createModal = document.getElementById('create-assignment-modal');
    const btnCloseCreate = document.getElementById('btn-close-assignment-form');
    const btnCancelCreate = document.getElementById('btn-cancel-assign');
    const formCreate = document.getElementById('form-create-assignment');

    const gradingDrawer = document.getElementById('grading-drawer-modal');
    const btnCloseGrading = document.getElementById('btn-close-grading-drawer');

    if (btnShowCreate && createModal) {
      btnShowCreate.addEventListener('click', () => {
        createModal.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const hideCreate = () => { if (createModal) createModal.style.display = 'none'; };
    if (btnCloseCreate) btnCloseCreate.addEventListener('click', hideCreate);
    if (btnCancelCreate) btnCancelCreate.addEventListener('click', hideCreate);

    if (formCreate) {
      formCreate.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          title: document.getElementById('assign-title').value.trim(),
          class_id: document.getElementById('assign-class').value,
          deadline: document.getElementById('assign-deadline').value,
          instructions: document.getElementById('assign-instructions').value.trim(),
          max_score: document.getElementById('assign-max-score').value
        };

        try {
          await api.createAssignment(payload);
          store.showToast('Penugasan matematika berhasil dipublikasikan.', 'success');
          formCreate.reset();
          hideCreate();
        } catch (err) {
          store.showToast(`Gagal: ${err.message}`, 'error');
        }
      });
    }

    document.querySelectorAll('.btn-review-submission').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const title = e.currentTarget.getAttribute('data-title');
        if (gradingDrawer) {
          document.getElementById('grading-drawer-title').textContent = `Pemeriksaan Submission: ${title}`;
          gradingDrawer.style.display = 'block';
          gradingDrawer.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    if (btnCloseGrading) {
      btnCloseGrading.addEventListener('click', () => {
        if (gradingDrawer) gradingDrawer.style.display = 'none';
      });
    }

    document.querySelectorAll('.btn-save-single-grade').forEach(btn => {
      btn.addEventListener('click', () => {
        store.showToast('Nilai dan feedback siswa berhasil disimpan.', 'success');
      });
    });
  }
};
