/**
 * MATHENA PROCTOR MONITORING DASHBOARD
 * Modul Pengawas Ujian EXAM CBT.
 * Memantau status seluruh peserta ujian secara real-time, mencatat laporan insiden/kecurangan,
 * dan melakukan reset attempt bila ada kendala perangkat.
 * KEAMANAN PRD: KUNCI JAWABAN & DATA AKADEMIK DI LUAR UJIAN TIDAK DITAMPILKAN.
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const ProctorMonitoringView = {
  render() {
    return `
      <div style="max-width: 1200px; margin: 0 auto;">
        
        <!-- PROCTOR HEADER -->
        <div class="glass-panel polygonal-accent" style="padding: 24px; margin-bottom: 24px; border-left: 4px solid var(--teal-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div>
              <span class="badge badge-teal" style="margin-bottom: 6px;">CBT Proctor Control Center</span>
              <h1 style="font-size: 1.6rem;">Monitoring Sesi Ujian Aktif</h1>
              <p style="font-size: 0.85rem; color: var(--white-muted);">
                Ruang: <strong>Lab Komputer 1</strong> $\\cdot$ Sesi: <strong>Sesi 1 (08:00–09:00 WIB)</strong> $\\cdot$ Ujian: <strong>PTS Matematika Kelas 8</strong>
              </p>
            </div>
            <button id="btn-proctor-record-incident" class="btn btn-danger btn-sm">
              🚨 Catat Insiden / Pelanggaran
            </button>
          </div>
        </div>

        <!-- STATS KONTROL PENGAWAS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <div class="glass-panel" style="padding: 16px;">
            <div style="font-size: 0.75rem; color: var(--white-muted); font-weight: 600;">TOTAL PESERTA</div>
            <div style="font-size: 1.8rem; font-weight: 700; color: var(--white-crisp); margin-top: 4px;">32</div>
          </div>
          <div class="glass-panel" style="padding: 16px;">
            <div style="font-size: 0.75rem; color: var(--teal-primary); font-weight: 600;">SEDANG MENGERJAKAN</div>
            <div style="font-size: 1.8rem; font-weight: 700; color: var(--teal-primary); margin-top: 4px;">29</div>
          </div>
          <div class="glass-panel" style="padding: 16px;">
            <div style="font-size: 0.75rem; color: var(--success-emerald); font-weight: 600;">SUDAH SUBMIT</div>
            <div style="font-size: 1.8rem; font-weight: 700; color: var(--success-emerald); margin-top: 4px;">3</div>
          </div>
          <div class="glass-panel" style="padding: 16px;">
            <div style="font-size: 0.75rem; color: var(--danger-crimson); font-weight: 600;">INSIDEN TERCATAT</div>
            <div style="font-size: 1.8rem; font-weight: 700; color: var(--danger-crimson); margin-top: 4px;">0</div>
          </div>
        </div>

        <!-- DAFTAR PESERTA REAL-TIME TABLE -->
        <div class="table-container glass-panel">
          <table class="mathena-table">
            <thead>
              <tr>
                <th>No. Kursi</th>
                <th>Nama Peserta (ID)</th>
                <th>Mulai Ujian</th>
                <th>Aktivitas Terakhir</th>
                <th>Progres Jawaban</th>
                <th>Status</th>
                <th>Aksi Pengawas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: 700; color: var(--teal-primary);">K-01</td>
                <td>
                  <div style="font-weight: 600;">Aditya Pratama</div>
                  <div style="font-size: 0.72rem; color: var(--white-muted);">STU-2026-001</div>
                </td>
                <td>08:02 WIB</td>
                <td>08:24 WIB (Autosave Soal 14)</td>
                <td><span class="badge badge-teal">14 / 20 Soal</span></td>
                <td><span class="badge badge-teal">ACTIVE</span></td>
                <td>
                  <button class="btn btn-secondary btn-sm btn-action-proctor" data-id="STU-2026-001">Aksi</button>
                </td>
              </tr>
              <tr>
                <td style="font-weight: 700; color: var(--teal-primary);">K-02</td>
                <td>
                  <div style="font-weight: 600;">Citra Dewi Lestari</div>
                  <div style="font-size: 0.72rem; color: var(--white-muted);">STU-2026-002</div>
                </td>
                <td>08:01 WIB</td>
                <td>08:22 WIB (Submit Selesai)</td>
                <td><span class="badge badge-success">20 / 20 Soal</span></td>
                <td><span class="badge badge-success">SUBMITTED</span></td>
                <td>
                  <button class="btn btn-secondary btn-sm" disabled>Terkunci</button>
                </td>
              </tr>
              <tr>
                <td style="font-weight: 700; color: var(--danger-crimson);">K-03</td>
                <td>
                  <div style="font-weight: 600;">Dimas Arya Pamungkas</div>
                  <div style="font-size: 0.72rem; color: var(--white-muted);">STU-2026-003</div>
                </td>
                <td>08:05 WIB</td>
                <td>08:15 WIB (Terputus / Offline)</td>
                <td><span class="badge badge-gold">8 / 20 Soal</span></td>
                <td><span class="badge badge-danger">DISCONNECTED</span></td>
                <td>
                  <button class="btn btn-outline-teal btn-sm btn-reconnect-student" data-id="STU-2026-003">Beri Akses Ulang</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- MODAL CATAT INSIDEN -->
        <div id="proctor-incident-modal" class="glass-panel" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1000; width: 90%; max-width: 500px; padding: 28px; border-color: var(--danger-crimson);">
          <h3 style="color: var(--danger-crimson); margin-bottom: 14px;">Catat Insiden Pelaksanaan Ujian</h3>
          
          <form id="form-record-incident">
            <div class="form-group">
              <label class="form-label">Pilih Peserta</label>
              <select id="incident-student-id" class="form-select">
                <option value="STU-2026-001">Aditya Pratama (K-01)</option>
                <option value="STU-2026-003">Dimas Arya Pamungkas (K-03)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Jenis Insiden</label>
              <select id="incident-type" class="form-select">
                <option value="PERANGKAT_KENDALA">Kendala Perangkat / Listrik</option>
                <option value="KONEKSI_TERPUTUS">Koneksi Jaringan Terputus</option>
                <option value="INDISIIPLIN">Pelanggaran Tata Tertib</option>
                <option value="LAINNYA">Lainnya</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Keterangan Detail Insiden</label>
              <textarea id="incident-notes" class="form-textarea" rows="3" placeholder="Jelaskan detail kejadian..." required></textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px;">
              <button type="button" id="btn-cancel-incident" class="btn btn-secondary">Batal</button>
              <button type="submit" class="btn btn-danger">Simpan Log Insiden</button>
            </div>
          </form>
        </div>

      </div>
    `;
  },

  initEvents() {
    const btnIncident = document.getElementById('btn-proctor-record-incident');
    const modalIncident = document.getElementById('proctor-incident-modal');
    const btnCancelIncident = document.getElementById('btn-cancel-incident');
    const formIncident = document.getElementById('form-record-incident');

    if (btnIncident && modalIncident) {
      btnIncident.addEventListener('click', () => { modalIncident.style.display = 'block'; });
    }
    if (btnCancelIncident && modalIncident) {
      btnCancelIncident.addEventListener('click', () => { modalIncident.style.display = 'none'; });
    }

    if (formIncident) {
      formIncident.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          await api.recordExamIncident({
            student_id: document.getElementById('incident-student-id').value,
            incident_type: document.getElementById('incident-type').value,
            notes: document.getElementById('incident-notes').value.trim()
          });
          store.showToast('Insiden berhasil dicatat ke dalam audit log.', 'success');
          modalIncident.style.display = 'none';
        } catch (err) {
          store.showToast(`Gagal mencatat insiden: ${err.message}`, 'error');
        }
      });
    }

    document.querySelectorAll('.btn-reconnect-student').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const studentId = e.currentTarget.getAttribute('data-id');
        store.showToast(`Akses ujian telah dipulihkan untuk peserta ${studentId}.`, 'info');
      });
    });
  }
};
