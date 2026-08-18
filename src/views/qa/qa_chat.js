// ==================== FILE: src/views/qa/qa_chat.js ====================
/**
 * MATHENA QA THREADS & MULTIMEDIA CHAT MODULE
 * Mendukung teks formula KaTeX, lampiran berkas multimedia (Foto, Audio, Video, PDF),
 * serta fitur bantu respon AI untuk guru.
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const QAChatView = {
  activeMessages: [
    {
      id: 'MSG-001',
      sender: 'Aditya Pratama (Siswa)',
      role: 'STUDENT',
      time: '10:14 WIB',
      text: 'Pak Guru, untuk membuktikan kelompok bilangan $5, 12, 13$ adalah tripel Pythagoras, apakah selalu berlaku $c^2 = a^2 + b^2$ dengan $c = 13$?',
      mediaType: 'IMAGE',
      mediaUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=80',
      mediaName: 'Catatan_Soal_Segitiga.jpg'
    },
    {
      id: 'MSG-002',
      sender: 'Bapak Guru (Pengampu)',
      role: 'GURU',
      time: '10:20 WIB',
      text: 'Tepat sekali Aditya. Sisi terpanjang selalu menjadi hipotenusa ($c$).\n$$c^2 = 13^2 = 169$$\n$$a^2 + b^2 = 5^2 + 12^2 = 25 + 144 = 169$$\nKarena $169 = 169$, maka $(5, 12, 13)$ terbukti merupakan **Tripel Pythagoras**.',
      mediaType: '',
      mediaUrl: '',
      mediaName: ''
    }
  ],

  render() {
    const role = (store.getState().role || '').toUpperCase();
    const isAdminOrGuru = role === 'ADMIN' || role === 'GURU' || role === 'ADMIN_GURU';

    return `
      <div style="max-width: 1150px; margin: 0 auto; height: calc(100vh - 130px); display: flex; flex-direction: column;">
        
        <!-- HEADER QA -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h1 style="font-size: 1.5rem; color: var(--white-crisp);">💬 Tanya Jawab Akademik (QA)</h1>
            <p style="font-size: 0.82rem; color: var(--white-muted);">
              Diskusi konsep matematika dengan rumus $\\LaTeX$, audio suara, foto coretan soal, dan video.
            </p>
          </div>
          <button id="btn-create-qa-thread" class="btn btn-primary btn-sm">
            <span>+ Buat Pertanyaan Baru</span>
          </button>
        </div>

        <!-- DUAL PANEL INTERFACE -->
        <div style="display: grid; grid-template-columns: 320px 1fr; gap: 18px; flex: 1; min-height: 0;">
          
          <!-- LEFT PANEL: THREADS -->
          <div class="glass-panel" style="padding: 16px; display: flex; flex-direction: column; min-height: 0;">
            <input type="text" id="qa-search-input" class="form-input" placeholder="🔍 Cari topik / rumus..." style="margin-bottom: 12px; padding: 8px 12px; font-size: 0.85rem;" />

            <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
              <div class="qa-thread-card glass-panel-teal active" style="padding: 12px; background: var(--teal-surface); border-radius: var(--radius-sm); cursor: pointer; border: 1px solid var(--teal-primary);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span class="badge badge-teal" style="font-size: 0.65rem;">OPEN</span>
                  <span style="font-size: 0.7rem; color: var(--white-muted);">10 Menit lalu</span>
                </div>
                <div style="font-weight: 600; font-size: 0.88rem; color: var(--white-crisp); margin-bottom: 4px;">
                  Membuktikan Tripel Pythagoras 5, 12, 13
                </div>
                <div style="font-size: 0.75rem; color: var(--white-muted);">Oleh: Aditya Pratama (8A)</div>
              </div>
            </div>
          </div>

          <!-- RIGHT PANEL: CHAT STREAM -->
          <div class="glass-panel" style="padding: 20px; display: flex; flex-direction: column; min-height: 0;">
            
            <!-- THREAD TITLE & ACTIONS -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--glass-border); margin-bottom: 12px;">
              <div>
                <h3 style="font-size: 1.1rem; color: var(--white-crisp);">Membuktikan Tripel Pythagoras 5, 12, 13</h3>
                <div style="font-size: 0.75rem; color: var(--white-muted);">Siswa: <strong>Aditya Pratama (8A)</strong></div>
              </div>

              ${isAdminOrGuru ? `
                <div style="display: flex; gap: 8px;">
                  <button id="btn-qa-ai-draft" class="btn btn-gold btn-sm">✨ AI Draft Jawaban</button>
                  <button class="btn btn-secondary btn-sm" onclick="alert('Thread ditandai selesai.')">Tandai Selesai</button>
                </div>
              ` : ''}
            </div>

            <!-- CHAT STREAM -->
            <div id="qa-messages-stream" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; padding-right: 8px; margin-bottom: 12px;">
              ${this.renderMessages()}
            </div>

            <!-- TOOLBAR RUMUS MATH & MULTIMEDIA ATTACHMENT -->
            <div>
              ${Layout.renderMathToolbar('qa-message-input')}
              <div id="qa-live-preview" class="katex-render-area math-formula-box" style="display: none; padding: 6px 12px; font-size: 0.85rem; margin-bottom: 6px;"></div>

              <!-- Lampiran Terpilih -->
              <div id="qa-attachment-preview" style="display: none; padding: 6px 10px; background: rgba(20,184,166,0.1); border: 1px solid var(--teal-primary); border-radius: 4px; font-size: 0.78rem; color: var(--teal-primary); margin-bottom: 6px;"></div>

              <form id="form-send-qa" style="display: flex; gap: 8px; align-items: flex-end;">
                <label class="btn btn-secondary" style="height: 52px; padding: 0 14px; cursor: pointer;" title="Unggah Berkas / Foto / Suara / Video">
                  📎
                  <input type="file" id="qa-file-input" accept="image/*, audio/*, video/mp4, application/pdf" style="display: none;" />
                </label>

                <div style="flex: 1;">
                  <textarea id="qa-message-input" class="form-textarea" rows="2" placeholder="Tulis pesan atau gunakan tombol simbol di atas..." style="min-height: 52px; margin: 0;" required></textarea>
                </div>

                <button type="submit" class="btn btn-primary" style="height: 52px; padding: 0 20px;">Kirim</button>
              </form>
            </div>

          </div>

        </div>

      </div>
    `;
  },

  renderMessages() {
    return this.activeMessages.map(m => {
      const isTeacher = m.role === 'GURU' || m.role === 'ADMIN';
      return `
        <div style="align-self: ${isTeacher ? 'flex-end' : 'flex-start'}; max-width: 82%; background: ${isTeacher ? 'var(--teal-surface)' : 'rgba(30,41,59,0.8)'}; border: 1px solid ${isTeacher ? 'var(--teal-primary)' : 'var(--glass-border)'}; padding: 14px; border-radius: var(--radius-sm); border-top-${isTeacher ? 'right' : 'left'}-radius: 0;">
          <div style="font-size: 0.72rem; color: ${isTeacher ? 'var(--gold-celestial)' : 'var(--teal-primary)'}; font-weight: 600; margin-bottom: 4px;">
            ${m.sender} • ${m.time}
          </div>
          <div class="katex-render-area" style="font-size: 0.9rem; color: var(--white-crisp); line-height: 1.6;">
            ${m.text.replace(/\n/g, '<br>')}
          </div>

          ${m.mediaUrl ? `
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--glass-border);">
              ${m.mediaType === 'IMAGE' ? `
                <img src="${m.mediaUrl}" alt="Foto Soal" style="max-width: 100%; max-height: 180px; border-radius: 6px;" />
              ` : (m.mediaType === 'AUDIO' ? `
                <audio controls src="${m.mediaUrl}" style="width: 100%; height: 34px;"></audio>
              ` : (m.mediaType === 'VIDEO' ? `
                <video controls src="${m.mediaUrl}" style="width: 100%; max-height: 200px;"></video>
              ` : `
                <a href="${m.mediaUrl}" target="_blank" class="btn btn-outline-teal btn-sm">📄 Unduh Dokumen PDF</a>
              `))}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  },

  initEvents() {
    Layout.bindMathToolbarEvents();

    const input = document.getElementById('qa-message-input');
    const preview = document.getElementById('qa-live-preview');
    const form = document.getElementById('form-send-qa');
    const fileInput = document.getElementById('qa-file-input');
    const attachBox = document.getElementById('qa-attachment-preview');
    const btnAiDraft = document.getElementById('btn-qa-ai-draft');

    let currentMediaBase64 = '';
    let currentMediaType = '';
    let currentMediaName = '';

    if (input && preview) {
      input.addEventListener('input', () => {
        const val = input.value.trim();
        if (val.includes('$')) {
          preview.style.display = 'block';
          preview.innerHTML = Layout.escapeHtml(val).replace(/\n/g, '<br>');
          Layout.renderMathFormulas(preview);
        } else {
          preview.style.display = 'none';
        }
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        currentMediaName = file.name;
        if (file.type.startsWith('image/')) currentMediaType = 'IMAGE';
        else if (file.type.startsWith('audio/')) currentMediaType = 'AUDIO';
        else if (file.type.startsWith('video/')) currentMediaType = 'VIDEO';
        else currentMediaType = 'PDF';

        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          currentMediaBase64 = loadEvt.target.result;
          if (attachBox) {
            attachBox.style.display = 'block';
            attachBox.innerHTML = `📎 Berkas Terlampir: <strong>${file.name}</strong> (${currentMediaType})`;
          }
        };
        reader.readAsDataURL(file);
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text && !currentMediaBase64) return;

        const role = (store.getState().role || '').toUpperCase();
        const isTeacher = role === 'ADMIN' || role === 'GURU' || role === 'ADMIN_GURU';

        const newMsg = {
          id: `MSG-${Date.now()}`,
          sender: isTeacher ? 'Bapak Guru (Pengampu)' : 'Siswa',
          role: isTeacher ? 'GURU' : 'STUDENT',
          time: 'Baru saja',
          text: text,
          mediaType: currentMediaType,
          mediaUrl: currentMediaBase64,
          mediaName: currentMediaName
        };

        this.activeMessages.push(newMsg);
        store.showToast('Pesan terkirim.', 'success');

        input.value = '';
        currentMediaBase64 = '';
        currentMediaType = '';
        currentMediaName = '';
        if (attachBox) attachBox.style.display = 'none';
        if (preview) preview.style.display = 'none';

        const stream = document.getElementById('qa-messages-stream');
        if (stream) {
          stream.innerHTML = this.renderMessages();
          Layout.renderMathFormulas(stream);
          stream.scrollTop = stream.scrollHeight;
        }
      });
    }

    if (btnAiDraft) {
      btnAiDraft.addEventListener('click', () => {
        store.showToast('Menghasilkan draft respon terstruktur...', 'info');
        input.value = 'Pembahasan:\nBerdasarkan rumus Pythagoras $$c^2 = a^2 + b^2$$, substitusi nilai $a=5, b=12, c=13$ membuktikan kesamaan kuadrat.';
        input.dispatchEvent(new Event('input'));
      });
    }
  }
};
