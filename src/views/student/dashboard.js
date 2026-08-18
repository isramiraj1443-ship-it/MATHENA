/**
 * MATHENA STUDENT DASHBOARD VIEW
 */

import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const StudentDashboardView = {
  render() {
    const user = store.getState().user || { name: 'Siswa', student_id: 'STU-2026-001' };

    return `
      <div style="max-width: 1100px; margin: 0 auto;">
        
        <div class="glass-panel polygonal-accent" style="padding: 24px; margin-bottom: 24px; border-left: 4px solid var(--teal-primary);">
          <h1 style="font-size: 1.6rem;">Selamat Datang, ${Layout.escapeHtml(user.fullName || user.name || 'Siswa')}!</h1>
          <p style="color: var(--white-muted); font-size: 0.88rem;">ID Siswa: ${user.student_id || 'STU-2026-001'} $\\cdot$ Portal Belajar Matematika</p>
        </div>

        <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px;">
          <div class="glass-panel" style="padding: 20px;">
            <h3 style="color: var(--white-crisp); margin-bottom: 12px;">📝 Penugasan Aktif Saya</h3>
            <div style="padding: 12px; background: rgba(15,23,42,0.8); border-radius: 6px; border-left: 3px solid var(--gold-celestial);">
              <div style="font-weight: 600;">Latihan Bentuk Pangkat & Akar</div>
              <div style="font-size: 0.78rem; color: var(--gold-celestial);">Tenggat: 20 Agustus 2026</div>
              <a href="#assignments" class="btn btn-primary btn-sm" style="margin-top: 8px;">Kerjakan Tugas</a>
            </div>
          </div>

          <div class="glass-panel glass-panel-gold" style="padding: 20px;">
            <h3 style="color: var(--gold-celestial); margin-bottom: 10px;">💻 Exam Room</h3>
            <p style="font-size: 0.82rem; color: var(--white-muted); margin-bottom: 12px;">PTS Matematika Kelas 8 (60 Menit)</p>
            <a href="#cbt" class="btn btn-gold btn-lg" style="width: 100%;">MASUK RUANG UJIAN</a>
          </div>
        </div>

      </div>
    `;
  },

  initEvents() {
    Layout.bindShellEvents();
  }
};
