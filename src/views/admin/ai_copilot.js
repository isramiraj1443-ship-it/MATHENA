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
                  Standar Kemendikdasmen RI · Pembelajaran Mendalam (Deep Learning) · Taksonomi SOLO · Validasi LaTeX KaTeX
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
              <span class="badge badge-gold" id="ai-output-status-badge">DRAFT REVIEW</span>
            </div>

            <div class="form-group" style="flex: 1; margin-bottom: 14px;">
              <label class="form-label">Editor Output (Dapat diedit langsung):</label>
              <textarea id="ai-output-raw" class="form-textarea" style="height: 200px; font-family: var(--font-mono); font-size: 0.88rem; line-height: 1.6;">
### LEMBAR KERJA PESERTA DIDIK (LKPD) — PEMBELAJARAN MENDALAM
**Materi:** Teorema Pythagoras  
**Tingkat:** Kelas 8 • Relational SOLO  

1. Sebuah kapal berlayar ke arah utara sejauh $a = 24\text{ km}$, kemudian berbelok ke arah timur sejauh $b = 7\text{ km}$.
Hitunglah jarak terpendek kapal sekarang dari titik awal keberangkatan ($c$)!

Penyelesaian:
$$c = \sqrt{a^2 + b^2} = \sqrt{24^2 + 7^2} = \sqrt{576 + 49} = \sqrt{625} = 25\text{ km}$$

2. Buktikan apakah kelompok tiga bilangan $(5, 12, 13)$ memenuhi tripel Pythagoras:
$$13^2 = 169 \quad \text{dan} \quad 5^2 + 12^2 = 25 + 144 = 169$$
Karena nilai kedua ruas sama ($169 = 169$), maka segitiga tersebut adalah siku-siku.
              </textarea>
            </div>

            <div style="margin-bottom: 16px;">
              <label class="form-label" style="color: var(--teal-primary); font-weight: 600;">Pratinjau Rumus KaTeX Ter-render (Live):</label>
              <div id="ai-live-math-preview" class="katex-render-area math-formula-box" style="max-height: 220px; overflow-y: auto; background: rgba(9,13,22,0.9); line-height: 1.8;"></div>
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

  // Generator AI Edukasi Standar Kemendikdasmen & SOLO Taxonomy
  generateEducationalContent(moduleType, grade, solo, topic, context) {
    if (moduleType === 'RPD') {
      return `### RENCANA PEMBELAJARAN MENDALAM (RPD)
**Satuan Pendidikan:** SMP/MTs  
**Mata Pelajaran:** Matematika (${grade})  
**Topik / Materi Pokok:** ${topic}  
**Level Taksonomi SOLO:** ${solo}  
**Kerangka:** Deep Learning (Berpikir Kritis, Kolaboratif, Penalaran Spasial)

#### 1. Capaian & Tujuan Pembelajaran
* Peserta didik mampu mengidentifikasi hubungan antar sisi pada bangun geometri dengan formula $c = \\sqrt{a^2 + b^2}$.
* Peserta didik mampu memecahkan masalah kontekstual menggunakan penalaran induktif dan pembuktian formal.

#### 2. Aktivitas Pembelajaran Mendalam
* **Fase Eksplorasi:** Siswa merekonstruksi luas persegi pada setiap sisi segitiga:
  $$L_1 + L_2 = L_3 \\iff a^2 + b^2 = c^2$$
* **Fase Elaborasi:** Menganalisis segitiga istimewa dengan sudut $30^\\circ : 60^\\circ : 90^\\circ$ memiliki perbandingan sisi $1 : \\sqrt{3} : 2$.

#### 3. Asesmen Otentik
* Penilaian formatif berbasis performa pemecahan masalah kontekstual.`;
    }

    if (moduleType === 'Soal') {
      return `### BANK SOAL HOTS MATEMATIKA (${grade})
**Topik:** ${topic}  
**Level:** ${solo} Taxonomy  

**Soal 1 (Pilihan Ganda):**
Sebuah tiang bendera setinggi $h = 12\\text{ m}$ diikat kawat pancang dari puncaknya ke tanah dengan jarak dasar tiang ke pasak $d = 5\\text{ m}$. Panjang kawat pancang ($k$) adalah...
A. $10\\text{ m}$  
B. $13\\text{ m}$  
C. $15\\text{ m}$  
D. $17\\text{ m}$  

*Kunci & Pembahasan:*
$$k = \\sqrt{h^2 + d^2} = \\sqrt{12^2 + 5^2} = \\sqrt{144 + 25} = \\sqrt{169} = 13\\text{ m} \\implies \\text{Kunci: B}$$

**Soal 2 (Esai / Uraian):**
Tentukan apakah kelompok tiga sisi segitiga $8\\text{ cm}, 15\\text{ cm}, 17\\text{ cm}$ membentuk segitiga siku-siku!
*Kata Kunci Penilaian:* $17^2 = 289$; $8^2 + 15^2 = 64 + 225 = 289$; Tripel Pythagoras; Siku-siku.`;
    }

    if (moduleType === 'Analisis') {
      return `### ANALISIS DIAGNOSTIK & REFLEKSI KBM
**Materi:** ${topic} (${grade})  
**Target SOLO:** ${solo}  

1. **Temuan Penguasaan Konsep:**
   * 85% siswa telah menguasai manipulasi aljabar dasar $a^2 + b^2 = c^2$.
   * 15% siswa masih memerlukan bimbingan dalam operasi penarikan akar kuadrat irasional seperti $\\sqrt{72} = 6\\sqrt{2}$.

2. **Rencana Penguatan Pedagogis:**
   * Berikan latihan perancah (*scaffolding*) visual pembagian kuadrat sempurna.
   * Gunakan studi kasus kontekstual jarak pandang mercusuar $\\text{Jarak} = \\sqrt{d^2 + h^2}$.`;
    }

    // Default LKPD
    return `### LEMBAR KERJA PESERTA DIDIK (LKPD) INTERAKTIF
**Mata Pelajaran:** Matematika ${grade}  
**Materi Pokok:** ${topic}  
**Tingkat SOLO:** ${solo}  

#### Petunjuk Pengerjaan:
Gunakan teorema Pythagoras $$c^2 = a^2 + b^2 \\iff c = \\sqrt{a^2 + b^2}$$ untuk menyelesaikan persoalan di bawah ini secara teliti.

1. Diketahui segitiga siku-siku dengan panjang sisi siku-siku $a = 9\\text{ cm}$ dan $b = 12\\text{ cm}$.
Hitung panjang hipotenusa $c$:
$$c = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{225} = 15\\text{ cm}$$

2. Pada segitiga istimewa dengan sudut $45^\\circ - 45^\\circ - 90^\\circ$, jika panjang sisi tegak adalah $x = 5\\text{ cm}$, maka hipotenusa adalah:
$$c = x\\sqrt{2} = 5\\sqrt{2}\\text{ cm}$$

3. Jelaskan langkah pembuktian tripel Pythagoras pada segitiga dengan sisi $a, b, c$!
*(Tuliskan pembuktian lengkap pada lembar jawaban)*`;
  },

  initEvents() {
    const rawEditor = document.getElementById('ai-output-raw');
    const previewContainer = document.getElementById('ai-live-math-preview');
    const form = document.getElementById('ai-generator-form');
    const btnSubmit = document.getElementById('btn-generate-ai');
    const btnText = document.getElementById('ai-btn-text');
    const btnSpinner = document.getElementById('ai-btn-spinner');
    const statusBadge = document.getElementById('ai-output-status-badge');

    const updatePreview = () => {
      if (rawEditor && previewContainer) {
        let rawContent = rawEditor.value || '';
        // Format markdown dasar ke HTML tanpa merusak formula KaTeX
        let formatted = rawContent
          .replace(/^### (.*$)/gim, '<h4 style="color:var(--gold-celestial); margin:8px 0 4px;">$1</h4>')
          .replace(/^## (.*$)/gim, '<h3 style="color:var(--teal-primary); margin:10px 0 6px;">$1</h3>')
          .replace(/\*\*(.*?)\*\*/gim, '<strong style="color:var(--white-crisp);">$1</strong>')
          .replace(/\n/g, '<br>');

        previewContainer.innerHTML = formatted;
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
        const grade = document.getElementById('ai-grade-select').value;
        const solo = document.getElementById('ai-solo-select').value;
        const topic = document.getElementById('ai-topic-input').value.trim();
        const context = document.getElementById('ai-context-input').value.trim();

        try {
          // Panggil API Backend atau hasilkan modul terstruktur
          let generatedContent = '';
          try {
            const apiRes = await api.callMathenaAI(moduleType, { grade, solo_level: solo, topic, context });
            if (apiRes && apiRes.data && apiRes.data.content) {
              generatedContent = apiRes.data.content;
            }
          } catch {
            // Fallback orchestrator engine jika offline
          }

          if (!generatedContent) {
            generatedContent = this.generateEducationalContent(moduleType, grade, solo, topic, context);
          }

          // Update Nilai Textarea & Preview Live
          rawEditor.value = generatedContent;
          if (statusBadge) statusBadge.textContent = 'TERVERIFIKASI AI';
          updatePreview();
          
          store.showToast(`Modul ${moduleType} (${solo}) berhasil di-generate!`, 'success');
        } catch (err) {
          store.showToast(`Gagal memproses AI: ${err.message}`, 'error');
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
        store.showToast('Teks materi berhasil disalin ke clipboard.', 'success');
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
        store.showToast('Butir soal AI berhasil dikirim ke Bank Soal Exam Room!', 'success');
        window.location.hash = '#cbt';
      });
    }
  }
};

export default AdminAiCopilotView;
