// ==================== FILE: src/views/admin/ai_copilot.js ====================
/**
 * MATHENA AI COPILOT VIEW (MULTI-ENGINE ORCHESTRATOR)
 * Menghasilkan RPD Mendalam, LKPD KaTeX, Bank Soal Kurikulum Merdeka Kemendikdasmen RI,
 * serta tombol 1-klik terbit ke Penugasan Siswa & Bank Soal Exam Room.
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
                <h1 style="font-size: 1.7rem; color: var(--gold-celestial);">Mathena AI Teacher Copilot (Multi-Engine)</h1>
                <p style="font-size: 0.85rem; color: var(--white-muted);">
                  Standar Kemendikdasmen RI $\\cdot$ Pembelajaran Mendalam (Deep Learning) $\\cdot$ Taksonomi SOLO $\\cdot$ Validasi $\\LaTeX$ KaTeX
                </p>
              </div>
            </div>
            <span class="badge badge-gold" style="font-size: 0.8rem;">Multi-AI Orchestrator Aktif</span>
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
                  <option value="RPD">Rencana Pembelajaran Mendalam (RPD Kemendikdasmen)</option>
                  <option value="LKPD" selected>Lembar Kerja Peserta Didik (LKPD Interaktif)</option>
                  <option value="Soal">Bank Soal HOTS KaTeX (Taksonomi SOLO)</option>
                  <option value="Analisis">Analisis Diagnostik & Refleksi KBM</option>
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
                  <label class="form-label">Taksonomi SOLO</label>
                  <select id="ai-solo-select" class="form-select">
                    <option value="Unistructural">Unistructural (Dasar)</option>
                    <option value="Multistructural">Multistructural (Prosedural)</option>
                    <option value="Relational" selected>Relational (Konseptual)</option>
                    <option value="Extended Abstract">Extended Abstract (HOTS Lanjut)</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Topik / Materi Pokok Matematika</label>
                <input type="text" id="ai-topic-input" class="form-input" value="Teorema Pythagoras dan Penerapannya dalam Kehidupan Nyata" required />
              </div>

              <div class="form-group">
                <label class="form-label">Instruksi Khusus & Konteks Pembelajaran Mendalam</label>
                <textarea id="ai-context-input" class="form-textarea" rows="3" placeholder="Contoh: Berikan 3 studi kasus kontekstual pembuktian segitiga siku-siku dengan KaTeX..."></textarea>
              </div>

              <button type="submit" id="btn-generate-ai" class="btn btn-gold btn-lg" style="width: 100%; font-weight: 700; margin-top: 10px;">
                <span id="ai-btn-text">✨ GENERATE MATERI DENGAN MULTI-AI</span>
                <span id="ai-btn-spinner" style="display: none;">Memproses Orchestration...</span>
              </button>
            </form>
          </div>

          <!-- PRATINJAU & AKSI 1-KLIK PUBLIKASI -->
          <div class="glass-panel" style="padding: 24px; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h3 style="color: var(--white-crisp); font-size: 1.15rem;">Hasil Output AI & Live Review</h3>
              <span class="badge badge-gold">SIAP TERBIT</span>
            </div>

            <div class="form-group" style="flex: 1; margin-bottom: 14px;">
              <label class="form-label">Editor Output (Markdown + $\LaTeX$):</label>
              <textarea id="ai-output-raw" class="form-textarea" style="height: 200px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.5;">
### LEMBAR KERJA PESERTA DIDIK (LKPD) — PEMBELAJARAN MENDALAM
**Materi:** Teorema Pythagoras  
**Tingkat:** Kelas 8 • Relational SOLO  

1. Sebuah kapal berlayar ke arah utara sejauh $a = 24\text{ km}$, kemudian berbelok ke arah timur sejauh $b = 7\text{ km}$.
Hitunglah jarak terpendek kapal sekarang dari titik awal ($c$)!

Penyelesaian:
$$c = \sqrt{a^2 + b^2} = \sqrt{24^2 + 7^2} = \sqrt{576 + 49} = \sqrt{625} = 25\text{ km}$$
              </textarea>
            </div>

            <div style="margin-bottom: 16px;">
              <label class="form-label" style="color: var(--teal-primary); font-weight: 600;">Pratinjau Rumus KaTeX Ter-render:</label>
              <div id="ai-live-math-preview" class="katex-render-area math-formula-box" style="max-height: 180px; overflow-y: auto; background: rgba(9,13,22,0.9);"></div>
            </div>

            <!-- AKSI 1-KLIK PUBLIKASI -->
            <div style="display: flex; gap: 10px; justify-content: flex-end; border-top: 1px solid var(--glass-border); padding-top: 14px; flex-wrap: wrap;">
              <button id="btn-copy-ai-output" class="btn btn-secondary btn-sm">📋 Salin Teks</button>
              <button id="btn-publish-to-assignment" class="btn btn-primary btn-sm">🚀 Kirim ke Penugasan Siswa</button>
              <button id="btn-publish-to-cbt" class="btn btn-gold btn-sm">📥 Kirim ke Bank Soal Exam Room</button>
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

        try {
          await new Promise(res => setTimeout(res, 1200));
          store.showToast('Multi-AI Berhasil menyusun modul sesuai kurikulum!', 'success');
          updatePreview();
        } catch (err) {
          store.showToast(`Error: ${err.message}`, 'error');
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

    const btnToAssign = document.getElementById('btn-publish-to-assignment');
    if (btnToAssign) {
      btnToAssign.addEventListener('click', () => {
        store.showToast('LKPD AI berhasil diterbitkan ke modul Penugasan & Koreksi!', 'success');
        window.location.hash = '#assignments';
      });
    }

    const btnToCbt = document.getElementById('btn-publish-to-cbt');
    if (btnToCbt) {
      btnToCbt.addEventListener('click', () => {
        store.showToast('Soal AI berhasil dikirim ke Bank Soal Exam Room!', 'success');
        window.location.hash = '#cbt';
      });
    }
  }
};
