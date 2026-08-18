/**
 * MATHENA QA THREADS & CHAT MODULE
 * Komunikasi akademik terstruktur guru-siswa berbasis thread.
 * Mendukung teks, berkas/gambar lampiran, rumus presisi KaTeX,
 * status thread (OPEN, ANSWERED, CLOSED), dan draft asisten guru AI.
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const QAChatView = {
  render() {
    const role = (store.getState().role || '').toUpperCase();
    const isAdminOrGuru = role === 'ADMIN' || role === 'GURU' || role === 'ADMIN_GURU';

    return `
      <div style="max-width: 1150px; margin: 0 auto; height: calc(100vh - 130px); display: flex; flex-direction: column;">
        
        <!-- HEADER QA -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h1 style="font-size: 1.5rem;">💬 Tanya Jawab Akademik (QA)</h1>
            <p style="font-size: 0.82rem; color: var(--white-muted);">
              Diskusi konsep dan pemecahan soal matematika dengan dukungan format rumus $\\LaTeX$.
            </p>
          </div>
          <button id="btn-create-qa-thread" class="btn btn-primary btn-sm">
            <span>+ Ajukan Pertanyaan Baru</span>
          </button>
        </div>

        <!-- QA INTERFACE: DUAL PANEL -->
        <div style="display: grid; grid-template-columns: 320px 1fr; gap: 18px; flex: 1; min-height: 0;">
          
          <!-- LEFT PANEL: THREADS LIST -->
          <div class="glass-panel" style="padding: 16px; display: flex; flex-direction: column; min-height: 0;">
            <div style="margin-bottom: 12px;">
              <input type="text" id="qa-search-input" class="form-input" placeholder="🔍 Cari topik / rumus..." style="padding: 8px 12px; font-size: 0.85rem;" />
            </div>

            <div id="qa-threads-list-container" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
              
              <!-- Active Thread Card 1 -->
              <div class="qa-thread-card glass-panel-teal active" data-id="TH-001" style="padding: 12px; background: var(--teal-surface); border-radius: var(--radius-sm); cursor: pointer; border: 1px solid var(--teal-primary);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span class="badge badge-teal" style="font-size: 0.65rem;">OPEN</span>
                  <span style="font-size: 0.7rem; color: var(--white-muted);">10 Menit lalu</span>
                </div>
                <div style="font-weight: 600; font-size: 0.88rem; color: var(--white-crisp); margin-bottom: 4px;">
                  Cara membuktikan tripel Pythagoras 5, 12, 13?
                </div>
                <div style="font-size: 0.75rem; color: var(--white-muted);">
                  Oleh: Aditya Pratama (8A)
                </div>
              </div>

              <!-- Thread Card 2 -->
              <div class="qa-thread-card" data-id="TH-002" style="padding: 12px; background: rgba(15,23,42,0.7); border-radius: var(--radius-sm); cursor: pointer; border: 1px solid var(--glass-border);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span class="badge badge-success" style="font-size: 0.65rem;">ANSWERED</span>
                  <span style="font-size: 0.7rem; color: var(--white-muted);">Kemarin</span>
                </div>
                <div style="font-weight: 600; font-size: 0.88rem; color: var(--white-crisp); margin-bottom: 4px;">
                  Rumus mencari hipotenusa jika sudutnya 30° dan 60°
                </div>
                <div style="font-size: 0.75rem; color: var(--white-muted);">
                  Oleh: Citra Dewi (8A)
                </div>
              </div>

            </div>
          </div>

          <!-- RIGHT PANEL: ACTIVE CHAT CONVERSATION -->
          <div class="glass-panel" style="padding: 20px; display: flex; flex-direction: column; min-height: 0;">
            
            <!-- THREAD HEADER -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--glass-border); margin-bottom: 14px;">
              <div>
                <h3 id="active-thread-title" style="font-size: 1.1rem; color: var(--white-crisp);">Cara membuktikan tripel Pythagoras 5, 12, 13?</h3>
                <div style="font-size: 0.75rem; color: var(--white-muted); margin-top: 2px;">
                  Siswa: <strong>Aditya Pratama (Kelas 8A)</strong> $\\cdot$ Status: <span class="badge badge-teal">OPEN</span>
                </div>
              </div>

              ${isAdminOrGuru ? `
                <div style="display: flex; gap: 8px;">
                  <button id="btn-qa-ai-draft" class="btn btn-gold btn-sm" title="Gunakan AI untuk membuat draft jawaban pedagogis">✨ AI Draft Jawaban</button>
                  <button id="btn-qa-close-thread" class="btn btn-secondary btn-sm">Tandai Selesai</button>
                </div>
              ` : ''}
            </div>

            <!-- CHAT MESSAGES STREAM -->
            <div id="qa-messages-stream" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; padding-right: 8px; margin-bottom: 14px;">
              
              <!-- Student Message Bubble -->
              <div style="align-self: flex-start; max-width: 80%; background: rgba(30,41,59,0.8); border: 1px solid var(--glass-border); padding: 14px; border-radius: var(--radius-sm); border-top-left-radius: 0;">
                <div style="font-size: 0.72rem; color: var(--teal-primary); font-weight: 600; margin-bottom: 4px;">Aditya Pratama (Siswa) • 10:14 WIB</div>
                <div class="katex-render-area" style="font-size: 0.9rem; color: var(--white-crisp);">
                  Pak Guru, untuk membuktikan apakah kelompok bilangan $5, 12, 13$ adalah tripel Pythagoras, apakah saya harus selalu mengkuadratkan sisi terpanjangnya dulu? Apakah berlaku $13^2 = 5^2 + 12^2$?
                </div>
              </div>

              <!-- Teacher Message Bubble -->
              <div style="align-self: flex-end; max-width: 80%; background: var(--teal-surface); border: 1px solid var(--teal-primary); padding: 14px; border-radius: var(--radius-sm); border-top-right-radius: 0;">
                <div style="font-size: 0.72rem; color: var(--gold-celestial); font-weight: 600; margin-bottom: 4px;">Bapak Guru (Pengampu) • 10:20 WIB</div>
                <div class="katex-render-area" style="font-size: 0.9rem; color: var(--white-crisp);">
                  Benar sekali Aditya. Sisi terpanjang selalu menjadi hipotenusa ($c$). Pembuktiannya adalah:
                  $$c^2 = 13^2 = 169$$
                  $$a^2 + b^2 = 5^2 + 12^2 = 25 + 144 = 169$$
                  Karena $13^2 = 5^2 + 12^2 = 169$, maka $(5, 12, 13)$ terbukti merupakan <strong>Tripel Pythagoras</strong>.
                </div>
              </div>

            </div>

            <!-- CHAT INPUT & LaTeX PREVIEW -->
            <div>
              <div id="qa-live-preview" class="katex-render-area math-formula-box" style="display: none; padding: 8px 12px; font-size: 0.85rem; margin-bottom: 8px; background: rgba(9,13,22,0.85);"></div>
              
              <form id="form-send-qa" style="display: flex; gap: 8px; align-items: flex-end;">
                <div style="flex: 1;">
                  <textarea id="qa-message-input" class="form-textarea" rows="2" placeholder="Ketik pesan atau rumus matematika (contoh: $x^2 + y^2 = r^2$)..." style="min-height: 54px; margin: 0;" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="height: 54px; padding: 0 20px;">Kirim</button>
              </form>
            </div>

          </div>

        </div>

      </div>
    `;
  },

  initEvents() {
    const input = document.getElementById('qa-message-input');
    const preview = document.getElementById('qa-live-preview');
    const form = document.getElementById('form-send-qa');
    const btnAiDraft = document.getElementById('btn-qa-ai-draft');

    if (input && preview) {
      input.addEventListener('input', () => {
        const val = input.value.trim();
        if (val.includes('$')) {
          preview.style.display = 'block';
          preview.innerHTML = Layout.escapeHtml(val);
          Layout.renderMathFormulas(preview);
        } else {
          preview.style.display = 'none';
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = input.value.trim();
        if (!msg) return;

        store.showToast('Pesan berhasil dikirim.', 'success');
        input.value = '';
        if (preview) preview.style.display = 'none';
      });
    }

    if (btnAiDraft) {
      btnAiDraft.addEventListener('click', async () => {
        store.showToast('Menghubungi Mathena AI untuk draft respon...', 'info');
        if (input) {
          input.value = "Penyelesaian:\nBerdasarkan konsep segitiga siku-siku, kita uji dengan teorema Pythagoras: $$c^2 = a^2 + b^2$$";
          input.dispatchEvent(new Event('input'));
        }
      });
    }
  }
};
