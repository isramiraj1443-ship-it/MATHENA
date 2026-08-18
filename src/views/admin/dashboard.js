/**
 * MATHENA ADMIN & TEACHER DASHBOARD VIEW
 * Menyajikan ringkasan indikator kinerja, daftar tindakan prioritas (actionable insight),
 * filter tahun pelajaran & kelas, serta shortcut operasional cepat.
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const AdminDashboardView = {
  render() {
    const user = store.getState().user || { name: 'Bapak/Ibu Guru' };

    return `
      <div style="max-width: 1200px; margin: 0 auto;">
        
        <!-- WELCOME BANNER WITH GEOMETRIC ACCENT -->
        <div class="glass-panel polygonal-accent" style="padding: 28px; margin-bottom: 24px; border-left: 4px solid var(--teal-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
              <span class="badge badge-gold" style="margin-bottom: 8px;">Teacher Command Center</span>
              <h1 style="font-size: 1.7rem; margin-bottom: 4px;">Selamat Bertugas, ${Layout.escapeHtml(user.name || 'Guru')}</h1>
              <p style="color: var(--white-muted); font-size: 0.9rem;">
                Platform Pembelajaran Matematika Terpadu $\\cdot$ SIKLUS: $\\text{Diagnose} \\to \\text{Plan} \\to \\text{Learn} \\to \\text{Assess} \\to \\text{Reflect}$
              </p>
            </div>
            
            <!-- Filter Bar Terpadu -->
            <div style="display: flex; gap: 12px; align-items: center; background: rgba(15,23,42,0.8); padding: 8px 16px; border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
              <div>
                <label style="font-size: 0.72rem; color: var(--white-muted); display: block;">KELAS AKTIF</label>
                <select id="dashboard-class-filter" class="form-select" style="padding: 4px 8px; font-size: 0.85rem; height: 32px;">
                  <option value="">Semua Kelas (7–9)</option>
                  <option value="7A">Kelas 7A</option>
                  <option value="7B">Kelas 7B</option>
                  <option value="8A">Kelas 8A</option>
                  <option value="8B">Kelas 8B</option>
                  <option value="9A">Kelas 9A</option>
                  <option value="9B">Kelas 9B</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- STATS KPI METRICS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
          
          <div class="glass-panel" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 0.78rem; color: var(--white-muted); text-transform: uppercase; font-weight: 600;">Siswa Terdaftar</div>
                <div id="stat-total-students" style="font-size: 1.8rem; font-weight: 700; color: var(--white-crisp); margin-top: 4px;">64</div>
              </div>
              <span style="font-size: 1.5rem;">👥</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--teal-primary); margin-top: 8px;">● 100% Memiliki ID Permanen</div>
          </div>

          <div class="glass-panel" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 0.78rem; color: var(--white-muted); text-transform: uppercase; font-weight: 600;">Tugas Perlu Diperiksa</div>
                <div id="stat-pending-grading" style="font-size: 1.8rem; font-weight: 700; color: var(--gold-celestial); margin-top: 4px;">12</div>
              </div>
              <span style="font-size: 1.5rem;">📝</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--gold-celestial); margin-top: 8px;">Perlu verifikasi & skor guru</div>
          </div>

          <div class="glass-panel" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 0.78rem; color: var(--white-muted); text-transform: uppercase; font-weight: 600;">Formatif Aktif</div>
                <div id="stat-active-formative" style="font-size: 1.8rem; font-weight: 700; color: var(--teal-primary); margin-top: 4px;">F3 / 5</div>
              </div>
              <span style="font-size: 1.5rem;">📈</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--white-muted); margin-top: 8px;">Maksimal 5 Sesuai Blueprint</div>
          </div>

          <div class="glass-panel" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 0.78rem; color: var(--white-muted); text-transform: uppercase; font-weight: 600;">Ujian EXAM CBT</div>
                <div id="stat-cbt-sessions" style="font-size: 1.8rem; font-weight: 700; color: var(--info-sky); margin-top: 4px;">1 Sesi</div>
              </div>
              <span style="font-size: 1.5rem;">💻</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--teal-primary); margin-top: 8px;">Sub-sistem mandiri aktif</div>
          </div>
        </div>

        <!-- TWO COLUMN LAYOUT: ACTIONABLE INSIGHTS & QUICK COPILOT SHORTCUT -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
          
          <!-- LEFT: ACTIONABLE INSIGHTS & TASKS NEEDING REVIEW -->
          <div class="glass-panel" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
              <h3 style="font-size: 1.15rem; display: flex; align-items: center; gap: 8px;">
                <span>⚡</span> Tindakan Prioritas Hari Ini
              </h3>
              <a href="#assignments" class="btn btn-outline-teal btn-sm">Lihat Semua Tugas</a>
            </div>

            <div id="action-items-list" style="display: flex; flex-direction: column; gap: 12px;">
              
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(15,23,42,0.8); border-radius: var(--radius-sm); border-left: 3px solid var(--gold-celestial);">
                <div>
                  <div style="font-weight: 600; color: var(--white-crisp); font-size: 0.92rem;">Tugas: Persamaan Linear Satu Variabel ($PLSV$)</div>
                  <div style="font-size: 0.78rem; color: var(--white-muted); margin-top: 2px;">Kelas 7A $\\cdot$ 8 Submission belum diperiksa</div>
                </div>
                <a href="#assignments" class="btn btn-gold btn-sm">Periksa</a>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(15,23,42,0.8); border-radius: var(--radius-sm); border-left: 3px solid var(--danger-crimson);">
                <div>
                  <div style="font-weight: 600; color: var(--white-crisp); font-size: 0.92rem;">3 Siswa Memerlukan Perhatian Khusus (Trend Turun)</div>
                  <div style="font-size: 0.78rem; color: var(--white-muted); margin-top: 2px;">Berdasarkan evaluasi Formatif 1 & 2 serta catatan kehadiran</div>
                </div>
                <a href="#assessment" class="btn btn-danger btn-sm">Analisis Siswa</a>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(15,23,42,0.8); border-radius: var(--radius-sm); border-left: 3px solid var(--teal-primary);">
                <div>
                  <div style="font-weight: 600; color: var(--white-crisp); font-size: 0.92rem;">Tanya Jawab (QA): 2 Pertanyaan Baru Menunggu</div>
                  <div style="font-size: 0.78rem; color: var(--white-muted); margin-top: 2px;">Materi: Teorema Pythagoras & Geometri Ruang</div>
                </div>
                <a href="#qa" class="btn btn-primary btn-sm">Jawab Diskusi</a>
              </div>

            </div>
          </div>

          <!-- RIGHT: MATHENA AI COPILOT LAUNCHPAD -->
          <div class="glass-panel glass-panel-gold" style="padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <span style="font-size: 1.4rem;">✨</span>
                <h3 style="color: var(--gold-celestial); font-size: 1.15rem;">Mathena AI Copilot</h3>
              </div>
              <p style="font-size: 0.85rem; color: var(--white-muted); line-height: 1.5; margin-bottom: 16px;">
                Asisten kecerdasan buatan khusus guru untuk menyusun Rencana Pembelajaran Mendalam (RPD), LKPD, Bank Soal KaTeX, dan Analisis Refleksi.
              </p>
              
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <a href="#ai" class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start;">
                  <span>📄</span> Generate RPD & LKPD Mendalam
                </a>
                <a href="#ai" class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start;">
                  <span>📐</span> Buat Bank Soal Matematika ($\LaTeX$)
                </a>
                <a href="#ai" class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start;">
                  <span>🧠</span> Analisis SOLO & Growth Mindset
                </a>
              </div>
            </div>

            <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--glass-border); font-size: 0.75rem; color: var(--gold-celestial);">
              🔒 AI Terisolasi Khusus Guru (PRD Strict Compliance)
            </div>
          </div>

        </div>

      </div>
    `;
  },

  initEvents() {
    const classFilter = document.getElementById('dashboard-class-filter');
    if (classFilter) {
      classFilter.addEventListener('change', (e) => {
        const selected = e.target.value;
        store.setSelectedClass(selected);
        store.showToast(`Memuat data analitik untuk ${selected || 'Semua Kelas'}`, 'info');
      });
    }
  }
};
