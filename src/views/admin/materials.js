// ==================== FILE: src/views/admin/materials.js ====================
/**
 * MATHENA MATERIALS MANAGEMENT VIEW
 * Manajemen materi dan modul bahan ajar dengan dukungan multimedia (MP4, MP3, JPG/PNG, PDF)
 * serta live formula KaTeX rendering.
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const AdminMaterialsView = {
  materialsData: [
    {
      id: 'MAT-001',
      title: 'Teorema Pythagoras dan Segitiga Siku-Siku Khusus',
      classId: '8A',
      category: 'Geometri',
      date: '16 Agustus 2026',
      content: 'Hubungan panjang sisi pada segitiga siku-siku: $$c^2 = a^2 + b^2 \\iff c = \\sqrt{a^2 + b^2}$$ Perbandingan panjang sisi dengan sudut istimewa $30^\\circ : 60^\\circ : 90^\\circ$ adalah $1 : \\sqrt{3} : 2$.',
      mediaType: 'VIDEO',
      mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      mediaName: 'Video_Pembuktian_Pythagoras.mp4'
    },
    {
      id: 'MAT-002',
      title: 'Sistem Persamaan Linear Satu Variabel (PLSV)',
      classId: '7A',
      category: 'Aljabar',
      date: '12 Agustus 2026',
      content: 'Bentuk umum persamaan linear satu variabel: $$ax + b = c \\quad (a \\neq 0)$$ Solusi nilai x diperoleh melalui penyetaraan kedua ruas.',
      mediaType: 'AUDIO',
      mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      mediaName: 'Audio_Konsep_Aljabar.mp3'
    }
  ],

  render() {
    return `
      <div style="max-width: 1150px; margin: 0 auto;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
          <div>
            <h1 style="font-size: 1.6rem; color: var(--white-crisp);">📚 Materi & Modul Pembelajaran</h1>
            <p style="font-size: 0.85rem; color: var(--white-muted);">
              Kelola bahan ajar, video pembelajaran, podcast audio, gambar modul, dan formula $\\LaTeX$ presisi.
            </p>
          </div>
          <button id="btn-show-add-material" class="btn btn-primary">
            <span>+ Buat Materi Baru</span>
          </button>
        </div>

        <!-- MODAL / FORM TAMBAH MATERI -->
        <div id="add-material-modal" class="glass-panel" style="display: none; padding: 24px; margin-bottom: 24px; border-color: var(--teal-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="color: var(--teal-primary);">Tambah Modul / Bahan Ajar Matematika</h3>
            <button id="btn-close-material-form" class="btn btn-secondary btn-sm">✕ Tutup</button>
          </div>

          <form id="form-create-material">
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Judul Materi Pembelajaran</label>
                <input type="text" id="mat-title" class="form-input" placeholder="Contoh: Teorema Pythagoras dan Segitiga Khusus" required />
              </div>
              <div class="form-group">
                <label class="form-label">Target Kelas</label>
                <select id="mat-class" class="form-select" required>
                  <option value="7A">Kelas 7A</option>
                  <option value="7B">Kelas 7B</option>
                  <option value="8A" selected>Kelas 8A</option>
                  <option value="8B">Kelas 8B</option>
                  <option value="9A">Kelas 9A</option>
                  <option value="9B">Kelas 9B</option>
                </select>
              </div>
            </div>

            <!-- Toolbar Simbol Matematika MS Word-Style -->
            <label class="form-label">Uraian Materi & Formula Matematika</label>
            ${Layout.renderMathToolbar('mat-content')}

            <div class="form-group">
              <textarea id="mat-content" class="form-textarea" rows="4" placeholder="Ketik materi di sini. Gunakan $...$ atau tombol toolbar untuk rumus..." required></textarea>
            </div>

            <!-- LIVE PREVIEW KaTeX -->
            <div style="margin-bottom: 16px;">
              <label class="form-label" style="color: var(--gold-celestial); font-weight: 600;">Pratinjau Rumus Matematika (Live Render):</label>
              <div id="mat-preview" class="katex-render-area math-formula-box" style="min-height: 48px; color: var(--white-crisp);">
                <em>Formula matematika akan tampil otomatis di sini...</em>
              </div>
            </div>

            <!-- UNGGAH FILE MULTIMEDIA (MP4, MP3, JPG, PDF) -->
            <div style="background: rgba(15,23,42,0.7); padding: 16px; border-radius: var(--radius-sm); border: 1px dashed var(--glass-border-teal); margin-bottom: 18px;">
              <label class="form-label" style="color: var(--teal-primary); font-weight: 600;">📎 Unggah Berkas Materi (Video MP4, Audio MP3, Gambar JPG/PNG, atau PDF)</label>
              <input type="file" id="mat-file-upload" class="form-input" accept="video/mp4, audio/mp3, audio/mpeg, image/jpeg, image/png, application/pdf" />
              
              <div id="mat-file-preview-box" class="media-preview-container" style="display: none;"></div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px;">
              <button type="button" id="btn-cancel-mat" class="btn btn-secondary">Batal</button>
              <button type="submit" class="btn btn-primary">Simpan & Terbitkan Materi</button>
            </div>
          </form>
        </div>

        <!-- LIST DAFTAR MATERI AKTIF -->
        <div id="materials-list" style="display: flex; flex-direction: column; gap: 18px;">
          ${this.renderMaterialCards()}
        </div>

      </div>
    `;
  },

  renderMaterialCards() {
    return this.materialsData.map(m => `
      <div class="glass-panel" style="padding: 22px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
          <div>
            <span class="badge badge-teal" style="margin-bottom: 6px;">Kelas ${m.classId} • ${m.category}</span>
            <h3 style="font-size: 1.18rem; color: var(--white-crisp);">${Layout.escapeHtml(m.title)}</h3>
          </div>
          <span style="font-size: 0.78rem; color: var(--white-muted);">${m.date}</span>
        </div>
        
        <div class="katex-render-area" style="font-size: 0.95rem; color: var(--white-crisp); margin-bottom: 14px; line-height: 1.6;">
          ${m.content}
        </div>

        <!-- RENDER MULTIMEDIA -->
        ${m.mediaUrl ? `
          <div class="media-preview-container" style="margin-bottom: 14px;">
            <div style="font-size: 0.78rem; color: var(--teal-primary); font-weight: 600; margin-bottom: 8px;">
              📁 Berkas Terlampir: ${Layout.escapeHtml(m.mediaName || 'Berkas Lampiran')}
            </div>
            ${m.mediaType === 'VIDEO' ? `
              <video class="media-preview-video" controls src="${m.mediaUrl}"></video>
            ` : (m.mediaType === 'AUDIO' ? `
              <audio class="media-preview-audio" controls src="${m.mediaUrl}"></audio>
            ` : (m.mediaType === 'IMAGE' ? `
              <img class="media-preview-img" src="${m.mediaUrl}" alt="Media Modul" />
            ` : `
              <a href="${m.mediaUrl}" target="_blank" class="btn btn-outline-teal btn-sm">📄 Buka Dokumen PDF</a>
            `))}
          </div>
        ` : ''}

        <div style="display: flex; justify-content: flex-end; align-items: center; border-top: 1px solid var(--glass-border); padding-top: 12px; gap: 8px;">
          <button class="btn btn-secondary btn-sm" onclick="alert('Fitur edit modul: ${m.title}')">✏️ Edit</button>
        </div>
      </div>
    `).join('');
  },

  initEvents() {
    Layout.bindMathToolbarEvents();

    const btnShowAdd = document.getElementById('btn-show-add-material');
    const modal = document.getElementById('add-material-modal');
    const btnClose = document.getElementById('btn-close-material-form');
    const btnCancel = document.getElementById('btn-cancel-mat');
    const matContent = document.getElementById('mat-content');
    const matPreview = document.getElementById('mat-preview');
    const form = document.getElementById('form-create-material');
    const fileUpload = document.getElementById('mat-file-upload');
    const previewBox = document.getElementById('mat-file-preview-box');

    let uploadedBase64 = '';
    let uploadedType = '';
    let uploadedFileName = '';

    if (btnShowAdd && modal) {
      btnShowAdd.addEventListener('click', () => {
        modal.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const hideModal = () => { if (modal) modal.style.display = 'none'; };
    if (btnClose) btnClose.addEventListener('click', hideModal);
    if (btnCancel) btnCancel.addEventListener('click', hideModal);

    if (matContent && matPreview) {
      matContent.addEventListener('input', () => {
        const val = matContent.value.trim();
        matPreview.innerHTML = val ? Layout.escapeHtml(val).replace(/\n/g, '<br>') : '<em>Formula matematika akan tampil otomatis di sini...</em>';
        Layout.renderMathFormulas(matPreview);
      });
    }

    if (fileUpload) {
      fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        uploadedFileName = file.name;
        if (file.type.startsWith('video/')) uploadedType = 'VIDEO';
        else if (file.type.startsWith('audio/')) uploadedType = 'AUDIO';
        else if (file.type.startsWith('image/')) uploadedType = 'IMAGE';
        else uploadedType = 'PDF';

        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          uploadedBase64 = loadEvt.target.result;
          previewBox.style.display = 'block';

          if (uploadedType === 'VIDEO') {
            previewBox.innerHTML = `<video class="media-preview-video" controls src="${uploadedBase64}"></video>`;
          } else if (uploadedType === 'AUDIO') {
            previewBox.innerHTML = `<audio class="media-preview-audio" controls src="${uploadedBase64}"></audio>`;
          } else if (uploadedType === 'IMAGE') {
            previewBox.innerHTML = `<img class="media-preview-img" src="${uploadedBase64}" alt="Pratinjau" />`;
          } else {
            previewBox.innerHTML = `<div style="color: var(--teal-primary);">📄 File PDF Terpilih: <strong>${file.name}</strong></div>`;
          }
        };
        reader.readAsDataURL(file);
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newMat = {
          id: `MAT-${Date.now()}`,
          title: document.getElementById('mat-title').value.trim(),
          classId: document.getElementById('mat-class').value,
          category: 'Matematika',
          date: 'Hari ini',
          content: matContent.value.trim(),
          mediaType: uploadedType,
          mediaUrl: uploadedBase64,
          mediaName: uploadedFileName
        };

        try {
          await api.saveMaterial(newMat);
          this.materialsData.unshift(newMat);
          store.showToast('Materi dan lampiran media berhasil diterbitkan!', 'success');
          form.reset();
          if (previewBox) previewBox.style.display = 'none';
          hideModal();

          const viewport = document.getElementById('app-main-viewport');
          if (viewport) {
            viewport.innerHTML = this.render();
            this.initEvents();
            Layout.renderMathFormulas(viewport);
          }
        } catch (err) {
          store.showToast(`Gagal: ${err.message}`, 'error');
        }
      });
    }
  }
};
