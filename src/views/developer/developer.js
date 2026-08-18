// ==================== FILE: src/views/developer/developer.js ====================
/**
 * MATHENA DEVELOPER PROFILE VIEW
 * Profil Pengembang Platform: Arif Nuur Iswahyudi, S.Pd. (Mathematic Teacher & EdTech Lead)
 * Dilengkapi Frame Avatar 3D Pop-Out Melingkar & Filosofi Pembelajaran.
 */

import { Layout } from '../../components/layout.js';

export const DeveloperView = {
  render() {
    return `
      <div style="max-width: 1000px; margin: 0 auto; padding-bottom: 40px;">
        
        <!-- HEADER PROFILE DEVELOPER -->
        <div class="glass-panel polygonal-accent" style="padding: 28px; margin-bottom: 28px; border-left: 4px solid var(--gold-celestial);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
              <span class="badge badge-gold" style="margin-bottom: 8px;">Arsitek & Pengembang Platform</span>
              <h1 style="font-size: 1.75rem; color: var(--white-crisp); margin-bottom: 4px;">Profil Pengembang Mathena</h1>
              <p style="color: var(--white-muted); font-size: 0.88rem;">
                Dedikasi untuk Transformasi Pendidikan Matematika Indonesia Berbasis Teknologi & Pembelajaran Mendalam.
              </p>
            </div>
            <span class="badge badge-teal" style="font-size: 0.8rem;">Versi Platform 2.2.0</span>
          </div>
        </div>

        <!-- MAIN DEVELOPER CARD 3D -->
        <div class="glass-panel developer-card-3d" style="padding: 36px 28px; margin-bottom: 28px;">
          <div style="display: grid; grid-template-columns: 280px 1fr; gap: 36px; align-items: center;" class="developer-grid-layout">
            
            <!-- FOTO 3D AVATAR MELINGKAR POP-OUT -->
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <div class="developer-avatar-3d-wrapper">
                <div class="developer-ring-glow"></div>
                <img 
                  src="https://raw.githubusercontent.com/isramiraj1443-ship-it/MATHENA/main/Me%20-%20Diedit.png" 
                  alt="Arif Nuur Iswahyudi, S.Pd." 
                  class="developer-avatar-img" 
                />
              </div>
              <div style="margin-top: 18px; text-align: center;">
                <span class="badge badge-grade-a" style="font-size: 0.78rem; padding: 4px 12px;">★ Lead EdTech Engineer</span>
              </div>
            </div>

            <!-- BIODATA & PROFIL LENGKAP -->
            <div>
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                <h2 style="font-size: 1.8rem; color: var(--gold-celestial); font-family: var(--font-header);">
                  Arif Nuur Iswahyudi, S.Pd.
                </h2>
              </div>
              
              <div style="font-size: 1.05rem; color: var(--teal-primary); font-weight: 600; margin-bottom: 16px;">
                Mathematic Teacher · EdTech System Architect · Educational Assessor
              </div>

              <p style="color: var(--white-crisp); font-size: 0.94rem; line-height: 1.7; margin-bottom: 20px;">
                Guru Matematika yang mendedikasikan keahlian dalam merancang sistem pembelajaran cerdas (EdTech) untuk memfasilitasi siklus pembelajaran matematika utuh:
                <strong style="color: var(--gold-celestial);"> Diagnosa $\to$ Perencanaan $\to$ Pembelajaran Mendalam $\to$ Asesmen Terpadu $\to$ Refleksi</strong>.
              </p>

              <!-- PILL BADGES KOMPETENSI -->
              <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px;">
                <span class="badge badge-teal">📐 Pendidikan Matematika SMP/MTs</span>
                <span class="badge badge-gold">🧠 Taksonomi SOLO & Kurikulum Merdeka</span>
                <span class="badge badge-teal">💻 Unified Exam CBT Core Engine</span>
                <span class="badge badge-gold">✨ Multi-Engine AI Orchestrator</span>
                <span class="badge badge-teal">∑ Formula KaTeX & LaTeX Rendering</span>
              </div>

              <!-- FILOSOFI KUTIPAN -->
              <div style="padding: 16px 20px; background: rgba(15,23,42,0.85); border-left: 3px solid var(--teal-primary); border-radius: var(--radius-sm);">
                <div style="font-style: italic; color: var(--white-crisp); font-size: 0.9rem; line-height: 1.6;">
                  "Kebijaksanaan dari Pengetahuan yang Utuh lahir ketika matematika tidak lagi dipandang sebagai sekadar hafalan rumus, melainkan sebagai bahasa logika, keindahan pola, dan sarana pemecahan masalah kontekstual."
                </div>
                <div style="text-align: right; color: var(--gold-celestial); font-size: 0.78rem; font-weight: 700; margin-top: 6px;">
                  — Arif Nuur Iswahyudi, S.Pd.
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- FITUR UTAMA & ARSITEKTUR YANG DIKEMBANGKAN -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          <div class="glass-panel" style="padding: 22px;">
            <div style="font-size: 1.4rem; margin-bottom: 8px;">🏛️</div>
            <h3 style="color: var(--teal-primary); font-size: 1.1rem; margin-bottom: 6px;">Pedagogi Matematika Mendalam</h3>
            <p style="font-size: 0.84rem; color: var(--white-muted); line-height: 1.6;">
              Integrasi Standar Kemendikdasmen RI dengan kerangka berpikir kritis, kontekstual, dan pemahaman relasional bertingkat SOLO.
            </p>
          </div>

          <div class="glass-panel" style="padding: 22px;">
            <div style="font-size: 1.4rem; margin-bottom: 8px;">💻</div>
            <h3 style="color: var(--gold-celestial); font-size: 1.1rem; margin-bottom: 6px;">Exam Room & Asesmen Terpadu</h3>
            <p style="font-size: 0.84rem; color: var(--white-muted); line-height: 1.6;">
              CBT mandiri mendukung 5 tipe soal (PG, PG Kompleks, BS AKM, Menjodohkan, Esai Keyword), pemantauan proctor real-time, dan kartu ujian.
            </p>
          </div>

          <div class="glass-panel" style="padding: 22px;">
            <div style="font-size: 1.4rem; margin-bottom: 8px;">✨</div>
            <h3 style="color: var(--teal-primary); font-size: 1.1rem; margin-bottom: 6px;">Mathena Multi-Engine AI Copilot</h3>
            <p style="font-size: 0.84rem; color: var(--white-muted); line-height: 1.6;">
              Asisten AI guru untuk merancang RPD, LKPD, dan Bank Soal berpresisi LaTeX yang dapat diterbitkan ke siswa dalam 1-klik.
            </p>
          </div>
        </div>

      </div>
    `;
  },

  initEvents() {
    Layout.renderMathFormulas(document.getElementById('app-main-viewport'));
  }
};

export default DeveloperView;
