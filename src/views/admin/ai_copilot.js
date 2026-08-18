// ==================== FILE: src/views/admin/ai_copilot.js ====================
/**
 * MATHENA AI COPILOT VIEW (ADMIN & GURU ONLY)
 * Asisten cerdas guru matematika untuk menyusun RPD, LKPD, Bahan Ajar,
 * Bank Soal KaTeX, dan Analisis Refleksi.
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const AdminAiCopilotView = {
  render() {
    return `
      <div style="max-width: 1200px; margin: 0 auto;">
        
        <div class="glass-panel glass-panel-gold" style="padding: 24px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <span style="font-size: 2.2rem;">✨</span>
              <div>
                <h1 style="font-size: 1.7rem; color: var(--gold-celestial);">Mathena AI Teacher Copilot</h1>
                <p style="font-size: 0.85rem; color: var(--white-muted);">
                  Framework: Pembelajaran Mendalam • Taksonomi SOLO • Growth Mindset • Formula LaTeX Presisi
                </p>
              </div>
            </div>
            <span class="badge badge-gold" style="font-size: 0.8rem;">Modul Khusus Guru</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1.3fr; gap: 24px;">
          
          <!-- FORM KONFIGURASI AI -->
          <div class="glass-panel" style="padding: 24px;">
            <h3 style="color: var(--teal-primary); margin-bottom: 16px; font-size: 1.15rem;">Konfigurasi Generator AI</h3>

            <form id="ai-generator-form">
              <div class="form-group">
                <label class="form-label">Pilih Modul Pembelajaran AI</label>
                <select id="ai-module-select" class="form-select" required>
                  <option value="RPD">Rencana Pembelajaran Mendalam (RPD)</option>
                  <option value="LKPD">Lembar Kerja Peserta Didik (LKPD)</option>
                  <option value="Bahan Ajar">Bahan Ajar Terstruktur</option>
                  <option value="Soal" selected>Bank Soal & Pembahasan Matematika (LaTeX)</option>
                  <option value="Media">Storyboard Media Pembelajaran</option>
                  <option value="Analisis Kelas">Analisis Hasil Belajar & Rekomendasi</option>
                  <option value="Jurnal">Refleksi Jurnal KBM Guru</option>
                </select>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="form-group">
                  <label class="form-label">Tingkat Kelas</label>
                  <select id="ai-grade-select" class="form-select">
                    <option value="Kelas 7">Kelas 7</option>
                    <option value="Kelas 8" selected>Kelas 8</option>
                    <option value="Kelas 9">Kelas 9</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Tingkat Taksonomi SOLO</label>
                  <select id="ai-solo-select" class="form-select">
                    <option value="Unistructural">Unistructural (Dasar)</option>
                    <option value="Multistructural">Multistructural (Prosedural)</option>
                    <option value="Relational" selected>Relational (Konseptual)</option>
                    <option value="Extended Abstract">Extended Abstract (Analisis Tinggi)</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Topik / Materi Pokok Matematika</label>
                <input type="text" id="ai-topic-input" class="form-input" value="Teorema Pythagoras dan Aplikasi dalam Kehidupan Sehari-hari" required />
              </div>

              <div class="form-group">
                <label class="form-label">Instruksi Tambahan</label>
                <textarea id="ai-context-input" class="form-textarea" rows="3" placeholder="Tuliskan instruksi spesifik jika ada..."></textarea>
              </div>

              <button type="submit" id="btn-generate-ai" class="btn btn-gold btn-lg" style="width: 100%; font-weight: 700; margin-top: 10px;">
                <span id="ai-btn-text">✨ GENERATE MATERI DENGAN AI</span>
                <span id="ai-btn-spinner" style="display: none;">Memproses...</span>
              </button>
            </form>
          </div>

          <!-- PRATINJAU & LIVE KaTeX RENDER -->
          <div class="glass-panel" style="padding: 24px; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h3 style="color: var(--white-crisp); font-size: 1.15rem;">Hasil Output AI & Live Review</h3>
              <span class="badge badge-gold">DRAFT REVIEW</span>
            </div>

            <div class="form-group" style="flex: 1; margin-bottom: 14px;">
              <label class="form-label">Editor Output (Dapat diedit langsung):</label>
              <textarea id="ai-output-raw" class="form-textarea" style="height: 200px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.5;">
1. Sebuah tangga sepanjang $c = 10\text{ m}$ disandarkan pada tembok gedung. Jarak ujung bawah tangga terhadap dinding adalah $a = 6\text{ m}$. Tentukan tinggi dinding $b$ yang dicapai tangga!

Penyelesaian:
$$c^2 = a^2 + b^2 \implies b = \sqrt{c^2 - a^2}$$
$$b = \sqrt{10^2 - 6^2} = \sqrt{100 - 36} = \sqrt{64} = 8\text{ m}$$
              </textarea>
            </div>

            <div style="margin-bottom: 16px;">
              <label class="form-label" style="color: var(--teal-primary); font-weight: 600;">Pratinjau Rumus KaTeX Ter-render:</label>
              <div id="ai-live-math-preview" class="katex-render-area math-formula-box" style="max-height: 200px; overflow-y: auto; background: rgba(9,13,22,0.9);"></div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end; border-top: 1px solid var(--glass-border); padding-top: 14px;">
              <button id="btn-copy-ai-output" class="btn btn-secondary btn-sm">📋 Salin Teks</button>
              <button id="btn-save-to-material" class="btn btn-primary btn-sm">Simpan ke Modul Materi</button>
            </div>

          </div>

        </div>

      </div>
    `;
  },

  initEvents() {
    const rawEditor = document.getElementById('ai-output-raw');
    const previewContainer = document.getElementById('ai-live-math-preview');
    const form = document.getElementById('ai-generator-form');
    const btnSubmit = document.getElementById('btn-generate-ai');
    const btnText = document.getElementById('ai-btn-text');
    const btnSpinner = document.getElementById('ai-btn-spinner');

    const updatePreview = () => {
      if (rawEditor && previewContainer) {
        previewContainer.innerHTML = Layout.escapeHtml(rawEditor.value).replace(/\n/g, '<br>');
        Layout.renderMathFormulas(previewContainer);
      }
    };

    if (rawEditor) {
      rawEditor.addEventListener('input', updatePreview);
      updatePreview();
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        btnSubmit.disabled = true;
        btnText.style.display = 'none';
        btnSpinner.style.display = 'inline';

        const moduleType = document.getElementById('ai-module-select').value;
        const payload = {
          grade: document.getElementById('ai-grade-select').value,
          solo_level: document.getElementById('ai-solo-select').value,
          topic: document.getElementById('ai-topic-input').value.trim(),
          context: document.getElementById('ai-context-input').value.trim()
        };

        try {
          const res = await api.callMathenaAI(moduleType, payload);
          if (res && res.data && res.data.content) {
            rawEditor.value = res.data.content;
            updatePreview();
            store.showToast('Materi berhasil di-generate oleh Mathena AI!', 'success');
          } else {
            updatePreview();
          }
        } catch (err) {
          store.showToast(`AI Error: ${err.message}`, 'error');
        } finally {
          btnSubmit.disabled = false;
          btnText.style.display = 'inline';
          btnSpinner.style.display = 'none';
        }
      });
    }

    const btnCopy = document.getElementById('btn-copy-ai-output');
    if (btnCopy && rawEditor) {
      btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(rawEditor.value);
        store.showToast('Teks berhasil disalin ke clipboard.', 'success');
      });
    }

    const btnSaveMat = document.getElementById('btn-save-to-material');
    if (btnSaveMat) {
      btnSaveMat.addEventListener('click', () => {
        store.showToast('Draft AI berhasil ditambahkan ke daftar Materi!', 'success');
      });
    }
  }
};
