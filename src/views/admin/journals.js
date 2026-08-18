/**
 * MATHENA LEARNING JOURNALS VIEW (JURNAL KBM)
 * Mencatat tanggal, kelas, topik ajar, aktivitas KBM, respons peserta didik,
 * refleksi guru, tindak lanjut perbaikan, dan dokumentasi foto.
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const AdminJournalsView = {
  render() {
    return `
      <div style="max-width: 1100px; margin: 0 auto;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
          <div>
            <h1 style="font-size: 1.6rem;">📖 Jurnal Pembelajaran KBM</h1>
            <p style="font-size: 0.85rem; color: var(--white-muted);">
              Dokumentasikan aktivitas kelas, respons siswa, refleksi pedagogis, dan tindak lanjut perbaikan.
            </p>
          </div>
          <button id="btn-show-add-journal" class="btn btn-primary">
            <span>+ Tulis Jurnal Hari Ini</span>
          </button>
        </div>

        <!-- FORM INPUT JURNAL BARU -->
        <div id="add-journal-modal" class="glass-panel" style="display: none; padding: 24px; margin-bottom: 24px; border-color: var(--teal-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="color: var(--teal-primary);">Form Catatan Jurnal Pembelajaran Guru</h3>
            <button id="btn-close-journal-form" class="btn btn-secondary btn-sm">✕ Tutup</button>
          </div>

          <form id="form-create-journal">
            <div style="display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Tanggal Pelaksanaan</label>
                <input type="date" id="journal-date" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Kelas</label>
                <select id="journal-class" class="form-select" required>
                  <option value="7A">Kelas 7A</option>
                  <option value="7B">Kelas 7B</option>
                  <option value="8A" selected>Kelas 8A</option>
                  <option value="9A">Kelas 9A</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Materi / Topik Pembelajaran</label>
                <input type="text" id="journal-topic" class="form-input" placeholder="Misal: Eksplorasi Teorema Pythagoras melalui media luas persegi" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Aktivitas & Respons Siswa</label>
              <textarea id="journal-activity" class="form-textarea" rows="3" placeholder="Jelaskan dinamika pembelajaran dan respon siswa saat berdiskusi kelompok..." required></textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Refleksi Guru</label>
                <textarea id="journal-reflection" class="form-textarea" rows="3" placeholder="Apa yang berjalan baik dan kendala konsep apa yang dialami siswa?..." required></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Rencana Tindak Lanjut</label>
                <textarea id="journal-followup" class="form-textarea" rows="3" placeholder="Rencana penguatan / remedial pada pertemuan berikutnya..." required></textarea>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Link Dokumentasi Foto / Google Drive</label>
              <input type="url" id="journal-photo-url" class="form-input" placeholder="https://drive.google.com/..." />
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;">
              <button type="button" id="btn-cancel-journal" class="btn btn-secondary">Batal</button>
              <button type="submit" class="btn btn-primary">Simpan Jurnal KBM</button>
            </div>
          </form>
        </div>

        <!-- LIST JURNAL RIWAYAT -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          
          <div class="glass-panel" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="badge badge-teal">Kelas 8A $\\cdot$ 16 Agustus 2026</span>
                <h3 style="font-size: 1.15rem; color: var(--white-crisp); margin-top: 4px;">Eksplorasi Pembuktian Teorema Pythagoras</h3>
              </div>
              <span class="badge badge-success">Dokumentasi Terverifikasi</span>
            </div>

            <div style="font-size: 0.88rem; color: var(--white-muted); margin-bottom: 12px; line-height: 1.6;">
              <strong style="color: var(--white-crisp);">Aktivitas & Respons:</strong> Siswa membagi diri dalam 6 kelompok menggunakan peraga visual puzzle luas persegi untuk menemukan $a^2 + b^2 = c^2$. 85% siswa antusias dan menemukan relasi dengan mandiri.<br>
              <strong style="color: var(--gold-celestial);">Refleksi:</strong> Siswa di kelompok 4 masih bingung saat membedakan sisi siku-siku dengan sisi miring pada posisi segitiga yang diputar.<br>
              <strong style="color: var(--teal-primary);">Tindak Lanjut:</strong> Berikan 3 latihan pengenalan posisi sisi miring pada awal pertemuan Formatif 2.
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--glass-border); padding-top: 10px; font-size: 0.8rem;">
              <span style="color: var(--white-muted);">📷 2 Foto Kegiatan Terlampir</span>
              <button class="btn btn-secondary btn-sm">Edit Jurnal</button>
            </div>
          </div>

        </div>

      </div>
    `;
  },

  initEvents() {
    const btnShow = document.getElementById('btn-show-add-journal');
    const modal = document.getElementById('add-journal-modal');
    const btnClose = document.getElementById('btn-close-journal-form');
    const btnCancel = document.getElementById('btn-cancel-journal');
    const form = document.getElementById('form-create-journal');

    // Default tanggal hari ini
    const dateInput = document.getElementById('journal-date');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    if (btnShow && modal) {
      btnShow.addEventListener('click', () => {
        modal.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const hide = () => { if (modal) modal.style.display = 'none'; };
    if (btnClose) btnClose.addEventListener('click', hide);
    if (btnCancel) btnCancel.addEventListener('click', hide);

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          date: dateInput.value,
          class_id: document.getElementById('journal-class').value,
          topic: document.getElementById('journal-topic').value.trim(),
          activity: document.getElementById('journal-activity').value.trim(),
          reflection: document.getElementById('journal-reflection').value.trim(),
          followup: document.getElementById('journal-followup').value.trim(),
          photo_url: document.getElementById('journal-photo-url').value.trim()
        };

        try {
          await api.saveLearningJournal(payload);
          store.showToast('Jurnal pembelajaran KBM berhasil disimpan.', 'success');
          form.reset();
          hide();
        } catch (err) {
          store.showToast(`Gagal menyimpan jurnal: ${err.message}`, 'error');
        }
      });
    }
  }
};
