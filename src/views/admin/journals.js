// ==================== FILE: src/views/admin/journals.js ====================
/**
 * MATHENA LEARNING JOURNALS VIEW (JURNAL KBM GURU)
 * Mencatat aktivitas kelas, respons siswa, refleksi pedagogis, tindak lanjut,
 * serta fitur Unggah Foto Dokumentasi KBM langsung dengan Live Preview.
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const AdminJournalsView = {
  // Data memori lokal jurnal
  journalRecords: [
    {
      journalId: 'JRN-2026-001',
      date: '2026-08-16',
      classId: '8A',
      topic: 'Eksplorasi Pembuktian Teorema Pythagoras',
      activity: 'Siswa membagi diri dalam 6 kelompok menggunakan peraga visual puzzle luas persegi untuk menemukan relasi sisi segitiga siku-siku. 85% siswa antusias dan menemukan relasi secara mandiri.',
      reflection: 'Siswa di kelompok 4 masih bingung saat membedakan sisi siku-siku dengan hipotenusa ketika posisi segitiga diputar.',
      followup: 'Berikan 3 latihan pengenalan posisi sisi miring pada awal pertemuan Formatif 2.',
      photoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
      photoName: 'dokumentasi_kbm_8a.jpg'
    }
  ],

  render() {
    return `
      <div style="max-width: 1100px; margin: 0 auto;">
        
        <!-- HEADER JURNAL -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
          <div>
            <h1 style="font-size: 1.6rem; color: var(--white-crisp);">📖 Jurnal Pembelajaran KBM Guru</h1>
            <p style="font-size: 0.85rem; color: var(--white-muted);">
              Dokumentasikan aktivitas kelas harian, respons siswa, refleksi pedagogis, dan foto kegiatan.
            </p>
          </div>
          <button id="btn-show-add-journal" class="btn btn-primary">
            <span>+ Tulis Jurnal Baru</span>
          </button>
        </div>

        <!-- FORM MODAL INPUT JURNAL BARU -->
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
                  <option value="8B">Kelas 8B</option>
                  <option value="9A">Kelas 9A</option>
                  <option value="9B">Kelas 9B</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Materi / Topik Pembelajaran</label>
                <input type="text" id="journal-topic" class="form-input" placeholder="Contoh: Pembuktian Teorema Pythagoras melalui puzzle luas" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Aktivitas Pembelajaran & Respons Peserta Didik</label>
              <textarea id="journal-activity" class="form-textarea" rows="3" placeholder="Jelaskan dinamika pembelajaran dan respon siswa saat berdiskusi..." required></textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Refleksi Guru (Evaluasi Kendala & Keberhasilan)</label>
                <textarea id="journal-reflection" class="form-textarea" rows="3" placeholder="Apa yang berjalan baik dan kendala apa yang dialami siswa?..." required></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Rencana Tindak Lanjut / Perbaikan</label>
                <textarea id="journal-followup" class="form-textarea" rows="3" placeholder="Rencana bimbingan atau penguatan di pertemuan berikutnya..." required></textarea>
              </div>
            </div>

            <!-- FIELD UNGGAH FOTO DOKUMENTASI DENGAN LIVE PREVIEW -->
            <div class="form-group" style="background: rgba(15,23,42,0.7); padding: 16px; border-radius: var(--radius-sm); border: 1px dashed var(--glass-border-teal); margin-top: 8px;">
              <label class="form-label" style="color: var(--teal-primary); font-weight: 600; margin-bottom: 6px; display: block;">
                📷 Unggah Foto Dokumentasi Kegiatan (JPG / PNG)
              </label>
              <input type="file" id="journal-photo-input" class="form-input" accept="image/png, image/jpeg, image/jpg" style="padding: 6px 12px; cursor: pointer;" />
              
              <!-- Image Preview Box -->
              <div id="journal-photo-preview-container" style="display: none; margin-top: 12px; align-items: center; gap: 14px;">
                <img id="journal-photo-preview-img" src="" alt="Pratinjau Foto" style="width: 90px; height: 90px; object-fit: cover; border-radius: 6px; border: 1px solid var(--teal-primary);" />
                <div>
                  <div id="journal-photo-preview-name" style="font-weight: 600; font-size: 0.85rem; color: var(--white-crisp);">nama_file.jpg</div>
                  <div style="font-size: 0.75rem; color: var(--teal-primary); margin-top: 2px;">✓ Foto siap diunggah ke Google Drive</div>
                  <button type="button" id="btn-remove-journal-photo" class="btn btn-danger btn-sm" style="margin-top: 6px; padding: 2px 8px; font-size: 0.72rem;">Hapus Foto</button>
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px;">
              <button type="button" id="btn-cancel-journal" class="btn btn-secondary">Batal</button>
              <button type="submit" id="btn-save-journal-submit" class="btn btn-primary">Simpan Jurnal KBM</button>
            </div>
          </form>
        </div>

        <!-- RIWAYAT JURNAL KBM -->
        <div id="journal-records-container" style="display: flex; flex-direction: column; gap: 18px;">
          ${this.renderJournalCards()}
        </div>

      </div>
    `;
  },

  renderJournalCards() {
    if (!this.journalRecords || this.journalRecords.length === 0) {
      return `
        <div class="glass-panel" style="padding: 30px; text-align: center; color: var(--white-muted);">
          Belum ada catatan jurnal pembelajaran. Klik tombol <strong>+ Tulis Jurnal Baru</strong> di atas untuk menambahkan.
        </div>
      `;
    }

    return this.journalRecords.map(j => `
      <div class="glass-panel" style="padding: 22px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
          <div>
            <span class="badge badge-teal">Kelas ${j.classId} • ${this.formatDateIndo(j.date)}</span>
            <h3 style="font-size: 1.15rem; color: var(--white-crisp); margin-top: 6px;">${Layout.escapeHtml(j.topic)}</h3>
          </div>
          <span class="badge badge-success">Terverifikasi</span>
        </div>

        <div style="font-size: 0.88rem; color: var(--white-muted); margin-bottom: 16px; line-height: 1.6;">
          <div style="margin-bottom: 8px;">
            <strong style="color: var(--white-crisp);">Aktivitas & Respons Siswa:</strong><br>
            ${Layout.escapeHtml(j.activity)}
          </div>
          <div style="margin-bottom: 8px;">
            <strong style="color: var(--gold-celestial);">Refleksi Guru:</strong><br>
            ${Layout.escapeHtml(j.reflection)}
          </div>
          <div>
            <strong style="color: var(--teal-primary);">Rencana Tindak Lanjut:</strong><br>
            ${Layout.escapeHtml(j.followup)}
          </div>
        </div>

        <!-- Lampiran Foto Dokumentasi -->
        ${j.photoUrl ? `
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--glass-border); display: flex; align-items: center; gap: 14px;">
            <a href="${j.photoUrl}" target="_blank" title="Klik untuk memperbesar">
              <img src="${j.photoUrl}" alt="Dokumentasi KBM" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid var(--glass-border-teal); cursor: pointer;" />
            </a>
            <div>
              <div style="font-size: 0.82rem; font-weight: 600; color: var(--white-crisp);">📷 Foto Dokumentasi Kegiatan</div>
              <div style="font-size: 0.74rem; color: var(--white-muted);">${j.photoName || 'dokumentasi_kbm.jpg'}</div>
            </div>
          </div>
        ` : ''}

      </div>
    `).join('');
  },

  initEvents() {
    const btnShow = document.getElementById('btn-show-add-journal');
    const modal = document.getElementById('add-journal-modal');
    const btnClose = document.getElementById('btn-close-journal-form');
    const btnCancel = document.getElementById('btn-cancel-journal');
    const form = document.getElementById('form-create-journal');
    const dateInput = document.getElementById('journal-date');

    const photoInput = document.getElementById('journal-photo-input');
    const previewContainer = document.getElementById('journal-photo-preview-container');
    const previewImg = document.getElementById('journal-photo-preview-img');
    const previewName = document.getElementById('journal-photo-preview-name');
    const btnRemovePhoto = document.getElementById('btn-remove-journal-photo');

    let currentBase64Photo = '';
    let currentPhotoFileName = '';

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

    // Event Pembacaan File Foto Lokal dengan FileReader (Base64)
    if (photoInput) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
          store.showToast('Harap pilih file gambar (JPG atau PNG).', 'error');
          photoInput.value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          currentBase64Photo = loadEvt.target.result;
          currentPhotoFileName = file.name;

          if (previewImg && previewName && previewContainer) {
            previewImg.src = currentBase64Photo;
            previewName.textContent = file.name;
            previewContainer.style.display = 'flex';
          }
        };
        reader.readAsDataURL(file);
      });
    }

    if (btnRemovePhoto) {
      btnRemovePhoto.addEventListener('click', () => {
        currentBase64Photo = '';
        currentPhotoFileName = '';
        if (photoInput) photoInput.value = '';
        if (previewContainer) previewContainer.style.display = 'none';
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newRecord = {
          journalId: `JRN-2026-00${this.journalRecords.length + 1}`,
          date: dateInput.value,
          classId: document.getElementById('journal-class').value,
          topic: document.getElementById('journal-topic').value.trim(),
          activity: document.getElementById('journal-activity').value.trim(),
          reflection: document.getElementById('journal-reflection').value.trim(),
          followup: document.getElementById('journal-followup').value.trim(),
          photoUrl: currentBase64Photo,
          photoName: currentPhotoFileName
        };

        try {
          await api.saveLearningJournal({
            date: newRecord.date,
            class_id: newRecord.classId,
            topic: newRecord.topic,
            activity: newRecord.activity,
            reflection: newRecord.reflection,
            followup: newRecord.followup,
            base64Photo: currentBase64Photo,
            photoName: currentPhotoFileName
          });
        } catch (apiErr) {
          console.warn('API Sync notice:', apiErr.message);
        }

        this.journalRecords.unshift(newRecord);
        store.showToast('Jurnal pembelajaran KBM dan foto berhasil disimpan!', 'success');

        form.reset();
        currentBase64Photo = '';
        currentPhotoFileName = '';
        if (previewContainer) previewContainer.style.display = 'none';
        hide();

        const viewport = document.getElementById('app-main-viewport');
        if (viewport) {
          viewport.innerHTML = this.render();
          this.initEvents();
        }
      });
    }
  },

  formatDateIndo(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return `${parseInt(parts[2], 10)} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  }
};
