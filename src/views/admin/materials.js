/**
 * MATHENA MATERIALS MANAGEMENT VIEW
 * Mengelola materi pembelajaran matematika dengan dukungan KaTeX formula,
 * lampiran berkas terstruktur, dan pembagian kelas.
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const AdminMaterialsView = {
  render() {
    return `
      <div style="max-width: 1100px; margin: 0 auto;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
          <div>
            <h1 style="font-size: 1.6rem;">📚 Materi & Modul Pembelajaran</h1>
            <p style="font-size: 0.85rem; color: var(--white-muted);">
              Kelola bahan ajar, ringkasan teori matematika, rumus presisi, dan berkas ajar.
            </p>
          </div>
          <button id="btn-show-add-material" class="btn btn-primary">
            <span>+ Buat Materi Baru</span>
          </button>
        </div>

        <!-- FORM MODAL / DRAWER TAMBAH MATERI -->
        <div id="add-material-modal" class="glass-panel" style="display: none; padding: 24px; margin-bottom: 24px; border-color: var(--teal-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="color: var(--teal-primary);">Tambah Modul / Bahan Ajar Matematika</h3>
            <button id="btn-close-material-form" class="btn btn-secondary btn-sm">✕ Tutup</button>
          </div>

          <form id="form-create-material">
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Judul Materi Pembelajaran</label>
                <input type="text" id="mat-title" class="form-input" placeholder="Contoh: Teorema Pythagoras dan Penerapannya" required />
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

            <div class="form-group">
              <label class="form-label">Uraian Materi & Formula Matematika (Gunakan $\LaTeX$ delimiter seperti $a^2 + b^2 = c^2$)</label>
              <textarea id="mat-content" class="form-textarea" rows="6" placeholder="Tuliskan materi di sini. Contoh rumus: Pada segitiga siku-siku berlaku $c = \\sqrt{a^2 + b^2}$..." required></textarea>
            </div>

            <!-- LIVE KaTeX PREVIEW PANEL -->
            <div style="margin-bottom: 16px;">
              <label class="form-label" style="color: var(--gold-celestial);">Pratinjau Rumus Matematika (Live Render):</label>
              <div id="mat-preview" class="katex-render-area math-formula-box" style="min-height: 50px; color: var(--white-crisp);">
                <em>Formula matematika akan tampil di sini saat Anda mengetik...</em>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">URL Berkas Lampiran / Google Drive / PDF</label>
              <input type="url" id="mat-file-url" class="form-input" placeholder="https://drive.google.com/..." />
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px;">
              <button type="button" id="btn-cancel-mat" class="btn btn-secondary">Batal</button>
              <button type="submit" class="btn btn-primary">Simpan & Terbitkan Materi</button>
            </div>
          </form>
        </div>

        <!-- LIST DAFTAR MATERI AKTIF -->
        <div id="materials-list" style="display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Sample Material Card 1 -->
          <div class="glass-panel" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div>
                <span class="badge badge-teal" style="margin-bottom: 6px;">Kelas 8A $\\cdot$ Geometri</span>
                <h3 style="font-size: 1.15rem; color: var(--white-crisp);">Teorema Pythagoras dan Segitiga Siku-Siku Khusus</h3>
              </div>
              <span style="font-size: 0.78rem; color: var(--white-muted);">Dipublikasikan: 12 Agu 2026</span>
            </div>
            
            <div class="katex-render-area" style="font-size: 0.9rem; color: var(--white-muted); margin-bottom: 12px;">
              Hubungan panjang sisi pada segitiga siku-siku: $$c^2 = a^2 + b^2 \\iff c = \\sqrt{a^2 + b^2}$$
              Serta perbandingan sudut istimewa $30^\\circ : 60^\\circ : 90^\\circ \\implies 1 : \\sqrt{3} : 2$.
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--glass-border); padding-top: 12px;">
              <span style="font-size: 0.8rem; color: var(--teal-primary);">📎 PDF Modul Pembelajaran Terlampir</span>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-secondary btn-sm">Edit Materi</button>
                <button class="btn btn-outline-teal btn-sm">Bagikan ke QA</button>
              </div>
            </div>
          </div>

          <!-- Sample Material Card 2 -->
          <div class="glass-panel" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div>
                <span class="badge badge-teal" style="margin-bottom: 6px;">Kelas 7A $\\cdot$ Aljabar</span>
                <h3 style="font-size: 1.15rem; color: var(--white-crisp);">Sistem Persamaan Linear Satu Variabel ($PLSV$)</h3>
              </div>
              <span style="font-size: 0.78rem; color: var(--white-muted);">Dipublikasikan: 10 Agu 2026</span>
            </div>
            
            <div class="katex-render-area" style="font-size: 0.9rem; color: var(--white-muted); margin-bottom: 12px;">
              Bentuk umum persamaan linear satu variabel: $$ax + b = c, \\quad a \\neq 0$$
              Penyelesaian dapat dicari dengan mengurangkan atau membagi kedua ruas dengan pengali yang setara.
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--glass-border); padding-top: 12px;">
              <span style="font-size: 0.8rem; color: var(--teal-primary);">📎 LKPD Terlampir</span>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-secondary btn-sm">Edit Materi</button>
                <button class="btn btn-outline-teal btn-sm">Bagikan ke QA</button>
              </div>
            </div>
          </div>

        </div>

      </div>
    `;
  },

  initEvents() {
    const btnShowAdd = document.getElementById('btn-show-add-material');
    const modal = document.getElementById('add-material-modal');
    const btnClose = document.getElementById('btn-close-material-form');
    const btnCancel = document.getElementById('btn-cancel-mat');
    const matContent = document.getElementById('mat-content');
    const matPreview = document.getElementById('mat-preview');
    const form = document.getElementById('form-create-material');

    if (btnShowAdd && modal) {
      btnShowAdd.addEventListener('click', () => {
        modal.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const hideModal = () => { if (modal) modal.style.display = 'none'; };
    if (btnClose) btnClose.addEventListener('click', hideModal);
    if (btnCancel) btnCancel.addEventListener('click', hideModal);

    // Live KaTeX formula previewer
    if (matContent && matPreview) {
      matContent.addEventListener('input', () => {
        const val = matContent.value.trim();
        matPreview.innerHTML = val ? Layout.escapeHtml(val).replace(/\n/g, '<br>') : '<em>Formula matematika akan tampil di sini saat Anda mengetik...</em>';
        Layout.renderMathFormulas(matPreview);
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          title: document.getElementById('mat-title').value.trim(),
          class_id: document.getElementById('mat-class').value,
          content: matContent.value.trim(),
          file_url: document.getElementById('mat-file-url').value.trim()
        };

        try {
          await api.saveMaterial(payload);
          store.showToast('Materi berhasil disimpan dan dipublikasikan.', 'success');
          form.reset();
          hideModal();
        } catch (err) {
          store.showToast(`Gagal menyimpan materi: ${err.message}`, 'error');
        }
      });
    }
  }
};
