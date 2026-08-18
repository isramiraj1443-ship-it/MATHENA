// ==================== FILE: src/views/student/dashboard.js ====================
/**
 * MATHENA STUDENT DASHBOARD VIEW
 * Portal personal siswa SMP/MTs, rekap progres formatif pribadi, tugas aktif & shortcut Exam Room.
 */

import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const StudentDashboardView = {
  render() {
    const user = store.getState().user || { name: 'Aditya Pratama', student_id: 'STU-2026-001', class_name: 'Kelas 8A' };

    return `
      <div style="max-width: 1100px; margin: 0 auto;">
        
        <div class="glass-panel polygonal-accent" style="padding: 28px; margin-bottom: 24px; border-left: 4px solid var(--teal-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
              <span class="badge badge-teal" style="margin-bottom: 8px;">Portal Siswa Mathena</span>
              <h1 style="font-size: 1.7rem; margin-bottom: 4px;">Halo, ${Layout.escapeHtml(user.fullName || user.name || 'Siswa')}!</h1>
              <p style="color: var(--white-muted); font-size: 0.88rem;">
                ID Siswa: <strong style="color: var(--white-crisp); font-family: var(--font-mono);">${Layout.escapeHtml(user.student_id || 'STU-2026-001')}</strong> $\\cdot$ Kelas 8A $\\cdot$ SIKLUS: $\\text{Pahami} \\to \\text{Berlatih} \\to \\text{Kuasai}$
              </p>
            </div>
            <span class="badge badge-success" style="font-size: 0.8rem;">Status: AKTIF</span>
          </div>
        </div>

        <!-- PROGRESS PRIBADI LONGITUDINAL -->
        <div class="glass-panel" style="padding: 22px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <h3 style="color: var(--gold-celestial); font-size: 1.15rem;">📈 Progres Capaian Formatif Matematika Saya</h3>
              <p style="font-size: 0.78rem; color: var(--white-muted);">Rekam jejak evaluasi berkala (Formatif 1 s.d Formatif 5)</p>
            </div>
            <span class="badge badge-teal">Predikat Sikap: A (Sangat Baik)</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; text-align: center;">
            <div style="padding: 12px; background: rgba(15,23,42,0.8); border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
              <div style="font-size: 0.72rem; color: var(--white-muted);">DIAGNOSTIK</div>
              <div style="font-size: 1.4rem; font-weight: 700; color: var(--teal-primary); margin: 4px 0;">75</div>
            </div>
            <div style="padding: 12px; background: rgba(15,23,42,0.8); border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
              <div style="font-size: 0.72rem; color: var(--white-muted);">FORMATIF 1</div>
              <div style="font-size: 1.4rem; font-weight: 700; color: var(--white-crisp); margin: 4px 0;">80</div>
            </div>
            <div style="padding: 12px; background: rgba(15,23,42,0.8); border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
              <div style="font-size: 0.72rem; color: var(--white-muted);">FORMATIF 2</div>
              <div style="font-size: 1.4rem; font-weight: 700; color: var(--white-crisp); margin: 4px 0;">85</div>
            </div>
            <div style="padding: 12px; background: rgba(15,23,42,0.8); border-radius: var(--radius-sm); border: 1px solid var(--glass-border-teal);">
              <div style="font-size: 0.72rem; color: var(--teal-primary); font-weight: 700;">FORMATIF 3</div>
              <div style="font-size: 1.4rem; font-weight: 700; color: var(--gold-celestial); margin: 4px 0;">90</div>
            </div>
            <div style="padding: 12px; background: rgba(15,23,42,0.8); border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
              <div style="font-size: 0.72rem; color: var(--white-muted);">FORMATIF 4</div>
              <div style="font-size: 1.4rem; font-weight: 700; color: var(--white-crisp); margin: 4px 0;">88</div>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1.3fr 1fr; gap: 24px;">
          
          <!-- TUGAS AKTIF SISWA -->
          <div class="glass-panel" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="font-size: 1.15rem; color: var(--white-crisp);">📝 Tugas Matematika Aktif</h3>
              <a href="#assignments" class="btn btn-outline-teal btn-sm">Lihat Semua</a>
            </div>

            <div style="padding: 14px 16px; background: rgba(15,23,42,0.8); border-radius: var(--radius-sm); border-left: 3px solid var(--gold-celestial); margin-bottom: 12px;">
              <div style="font-weight: 600; color: var(--white-crisp); font-size: 0.95rem;">Latihan Bentuk Pangkat dan Eksponen</div>
              <div class="katex-render-area" style="font-size: 0.8rem; color: var(--white-muted); margin: 6px 0;">
                Sederhanakan: $$\\frac{(2^3 \\cdot a^{-2} \\cdot b)^3}{8 \\cdot a^4 \\cdot b^{-2}}$$
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <span class="badge badge-gold">Tenggat: 20 Agu 2026</span>
                <a href="#assignments" class="btn btn-primary btn-sm">Kumpulkan Jawaban</a>
              </div>
            </div>
          </div>

          <!-- EXAM ROOM CBT SHORTCUT -->
          <div class="glass-panel glass-panel-gold" style="padding: 22px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="font-size: 1.6rem;">💻</span>
                <h3 style="font-size: 1.15rem; color: var(--gold-celestial);">Exam Room CBT</h3>
              </div>
              <p style="font-size: 0.82rem; color: var(--white-muted); margin-bottom: 14px;">
                Sesi Ujian Aktif: <strong>Penilaian Tengah Semester (PTS) Matematika</strong> (Ruang Lab 1).
              </p>
              <div style="background: rgba(15,23,42,0.85); padding: 10px 14px; border-radius: 6px; margin-bottom: 16px;">
                <span style="font-size:0.75rem; color:var(--white-muted);">PIN Sesi Anda:</span>
                <div style="font-size:1.3rem; font-weight:700; color:var(--gold-celestial); font-family:var(--font-mono);">84920</div>
              </div>
            </div>

            <a href="#cbt" class="btn btn-gold btn-lg" style="width: 100%; font-weight: 700; text-align: center;">
              MASUK KE EXAM ROOM
            </a>
          </div>

        </div>

      </div>
    `;
  },

  initEvents() {
    Layout.renderMathFormulas(document.getElementById('app-main-viewport'));
  }
};
