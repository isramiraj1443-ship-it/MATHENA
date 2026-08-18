/**
 * MATHENA STUDENT DASHBOARD VIEW
 * Menyajikan ringkasan perjalanan belajar pribadi siswa (longitudinal progress),
 * tugas aktif beserta statusnya, materi pembelajaran terkini, dan jadwal EXAM CBT.
 * Mematuhi PRD: Tidak membandingkan ranking dengan siswa lain secara default.
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const StudentDashboardView = {
  render() {
    const state = store.getState();
    const user = state.user || { name: 'Siswa Mathena', student_id: 'STU-2026-001', class_name: 'Kelas 8A' };

    return `
      <div style="max-width: 1100px; margin: 0 auto;">
        
        <!-- HERO GREETING BANNER -->
        <div class="glass-panel polygonal-accent" style="padding: 28px; margin-bottom: 24px; border-left: 4px solid var(--teal-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
              <span class="badge badge-teal" style="margin-bottom: 8px;">Portal Siswa Mathena</span>
              <h1 style="font-size: 1.7rem; margin-bottom: 4px;">Halo, ${Layout.escapeHtml(user.name || 'Siswa')}!</h1>
              <p style="color: var(--white-muted); font-size: 0.88rem;">
                ID Siswa: <strong style="color: var(--white-crisp); font-family: var(--font-mono);">${Layout.escapeHtml(user.student_id || 'STU-2026-001')}</strong> $\\cdot$ ${Layout.escapeHtml(user.class_name || 'Kelas 8A')} $\\cdot$ SIKLUS: $\\text{Pahami} \\to \\text{Berlatih} \\to \\text{Kuasai}$
              </p>
            </div>
            <div style="text-align: right;">
              <span class="badge badge-success" style="font-size: 0.8rem;">Status Belajar: AKTIF</span>
            </div>
          </div>
        </div>

        <!-- PROGRESS PRIBADI LONGITUDINAL -->
        <div class="glass-panel" style="padding: 22px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <h3 style="color: var(--gold-celestial); font-size: 1.15rem;">📈 Progres Capaian Formatif Matematika Saya</h3>
              <p style="font-size: 0.78rem; color: var(--white-muted);">Rekam jejak penilaian berkelanjutan (Formatif 1 s.d. Formatif 5)</p>
            </div>
            <span class="badge badge-teal">Tren: 📈 MENINGKAT</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; text-align: center;">
            <div style="padding: 12px; background: rgba(15,23,42,0.8); border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
              <div style="font-size: 0.72rem; color: var(--white-muted);">DIAGNOSTIK</div>
              <div style="font-size: 1.4rem; font-weight: 700; color: var(--teal-primary); margin: 4px 0;">72</div>
              <div style="font-size: 0.68rem; color: var(--white-muted);">Baseline Awal</div>
            </div>
            <div style="padding: 12px; background: rgba(15,23,42,0.8); border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
              <div style="font-size: 0.72rem; color: var(--white-muted);">FORMATIF 1</div>
              <div style="font-size: 1.4rem; font-weight: 700; color: var(--white-crisp); margin: 4px 0;">78</div>
              <div style="font-size: 0.68rem; color: var(--teal-primary);">PLSV</div>
            </div>
            <div style="padding: 12px; background: rgba(15,23,42,0.8); border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
              <div style="font-size: 0.72rem; color: var(--white-muted);">FORMATIF 2</div>
              <div style="font-size: 1.4rem; font-weight: 700; color: var(--white-crisp); margin: 4px 0;">84</div>
              <div style="font-size: 0.68rem; color: var(--teal-primary);">Pythagoras 1</div>
            </div>
            <div style="padding: 12px; background: rgba(15,23,42,0.8); border-radius: var(--radius-sm); border: 1px solid var(--glass-border-teal);">
              <div style="font-size: 0.72rem; color: var(--teal-primary); font-weight: 700;">FORMATIF 3</div>
              <div style="font-size: 1.4rem; font-weight: 700; color: var(--gold-celestial); margin: 4px 0;">88</div>
              <div style="font-size: 0.68rem; color: var(--gold-celestial);">Pythagoras 2</div>
            </div>
            <div style="padding: 12px; background: rgba(15,23,42,0.4); border-radius: var(--radius-sm); border: 1px dashed var(--glass-border); opacity: 0.7;">
              <div style="font-size: 0.72rem; color: var(--white-muted);">FORMATIF 4</div>
              <div style="font-size: 1.4rem; font-weight: 700; color: var(--white-muted); margin: 4px 0;">-</div>
              <div style="font-size: 0.68rem; color: var(--white-muted);">Segitiga Khusus</div>
            </div>
            <div style="padding: 12px; background: rgba(15,23,42,0.4); border-radius: var(--radius-sm); border: 1px dashed var(--glass-border); opacity: 0.7;">
              <div style="font-size: 0.72rem; color: var(--white-muted);">FORMATIF 5</div>
              <div style="font-size: 1.4rem; font-weight: 700; color: var(--white-muted); margin: 4px 0;">-</div>
              <div style="font-size: 0.68rem; color: var(--white-muted);">Evaluasi Siklus</div>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px;">
          
          <!-- DAFTAR TUGAS AKTIF SISWA -->
          <div class="glass-panel" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="font-size: 1.15rem; color: var(--white-crisp);">📝 Tugas yang Harus Dikerjakan</h3>
              <a href="#assignments" class="btn btn-outline-teal btn-sm">Lihat Semua</a>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px;">
              
              <!-- Item Tugas 1 -->
              <div style="padding: 14px 16px; background: rgba(15,23,42,0.8); border-radius: var(--radius-sm); border-left: 3px solid var(--gold-celestial);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                  <div>
                    <div style="font-weight: 600; color: var(--white-crisp); font-size: 0.95rem;">Latihan Bentuk Pangkat & Akar</div>
                    <div style="font-size: 0.78rem; color: var(--gold-celestial); margin-top: 2px;">Tenggat: 20 Agustus 2026, 23:59 WIB</div>
                  </div>
                  <span class="badge badge-gold">Sedang Dikerjakan</span>
                </div>
                <div style="font-size: 0.82rem; color: var(--white-muted); margin-bottom: 10px;">
                  Penyederhanaan formula: $$\\sqrt{72} + 3\\sqrt{2} - \\sqrt{50}$$
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 8px;">
                  <a href="#assignments" class="btn btn-primary btn-sm">Buka & Kumpulkan Tugas</a>
                </div>
              </div>

              <!-- Item Tugas 2 -->
              <div style="padding: 14px 16px; background: rgba(15,23,42,0.8); border-radius: var(--radius-sm); border-left: 3px solid var(--success-emerald);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                  <div>
                    <div style="font-weight: 600; color: var(--white-crisp); font-size: 0.95rem;">Soal Cerita SPLDV Kontekstual</div>
                    <div style="font-size: 0.78rem; color: var(--white-muted); margin-top: 2px;">Terkumpul pada: 18 Agustus 2026</div>
                  </div>
                  <span class="badge badge-success">Nilai: 95 / 100</span>
                </div>
                <div style="font-size: 0.8rem; color: var(--teal-primary);">
                  💬 Feedback Guru: "Langkah penyederhanaan sangat runtut dan tepat."
                </div>
              </div>

            </div>
          </div>

          <!-- UJIAN CBT AKTIF & DISKUSI CEPAT -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            
            <!-- UJIAN CBT CARD -->
            <div class="glass-panel glass-panel-gold" style="padding: 22px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="font-size: 1.5rem;">💻</span>
                <div>
                  <h3 style="font-size: 1.1rem; color: var(--gold-celestial);">Ruang Ujian EXAM CBT</h3>
                  <span style="font-size: 0.72rem; color: var(--white-muted);">Sistem Ujian Terjadwal & Terkontrol</span>
                </div>
              </div>

              <div style="padding: 12px; background: rgba(15,23,42,0.85); border-radius: var(--radius-sm); margin-bottom: 14px; font-size: 0.85rem;">
                <div style="font-weight: 600; color: var(--white-crisp);">Penilaian Tengah Semester — Matematika</div>
                <div style="color: var(--white-muted); font-size: 0.78rem; margin-top: 2px;">Durasi: 60 Menit $\\cdot$ 20 Butir Soal</div>
                <div style="color: var(--teal-primary); font-size: 0.75rem; margin-top: 4px;">● Sesi Ujian Aktif: Sesi 1 (Ruang Lab 1)</div>
              </div>

              <a href="#cbt" class="btn btn-gold btn-lg" style="width: 100%; font-weight: 700; font-size: 0.95rem;">
                MASUK KE RUANG UJIAN
              </a>
            </div>

            <!-- TANYA JAWAB GURU SHORTCUT -->
            <div class="glass-panel" style="padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="color: var(--teal-primary);">💬 Ada Pertanyaan Matematika?</h4>
                <a href="#qa" class="btn btn-outline-teal btn-sm">Buka Forum</a>
              </div>
              <p style="font-size: 0.8rem; color: var(--white-muted); margin-bottom: 12px;">
                Kirim pertanyaan atau foto rumus yang sulit langsung ke guru pengampu melalui thread chat.
              </p>
              <a href="#qa" class="btn btn-secondary btn-sm" style="width: 100%;">
                + Buat Pertanyaan Baru
              </a>
            </div>

          </div>

        </div>

      </div>
    `;
  },

  initEvents() {
    // Siswa dashboard event listeners
  }
};
