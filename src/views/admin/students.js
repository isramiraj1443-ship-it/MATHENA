// ==================== FILE: src/views/admin/students.js ====================
/**
 * MATHENA STUDENT MANAGEMENT VIEW
 * Mengelola Master Data Siswa, Identitas Permanen (Student_ID),
 * Penempatan Kelas (STUDENT_CLASSES), dan Akun Login Siswa.
 */

import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const AdminStudentsView = {
  // Data siswa lokal awal yang siap disinkronkan dengan database
  sampleStudents: [
    { studentId: 'STU-2026-001', username: 'aditya', nisn: '0089123401', fullName: 'Aditya Pratama', gender: 'L', classId: '8A', status: 'ACTIVE' },
    { studentId: 'STU-2026-002', username: 'citra', nisn: '0089123402', fullName: 'Citra Dewi Lestari', gender: 'P', classId: '8A', status: 'ACTIVE' },
    { studentId: 'STU-2026-003', username: 'dimas', nisn: '0089123403', fullName: 'Dimas Arya Pamungkas', gender: 'L', classId: '7A', status: 'ACTIVE' },
    { studentId: 'STU-2026-004', username: 'evelyn', nisn: '0089123404', fullName: 'Evelyn Angelica', gender: 'P', classId: '7A', status: 'ACTIVE' },
    { studentId: 'STU-2026-005', username: 'fauzan', nisn: '0089123405', fullName: 'Fauzan Nur Hidayat', gender: 'L', classId: '9A', status: 'ACTIVE' },
    { studentId: 'STU-2026-006', username: 'gisela', nisn: '0089123406', fullName: 'Gisela Putri Rahayu', gender: 'P', classId: '9A', status: 'ACTIVE' }
  ],

  render() {
    return `
      <div style="max-width: 1200px; margin: 0 auto;">
        
        <!-- HEADER MANAJEMEN SISWA -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
          <div>
            <h1 style="font-size: 1.6rem; color: var(--white-crisp);">👥 Data Siswa & Manajemen Kelas</h1>
            <p style="font-size: 0.85rem; color: var(--white-muted);">
              Kelola identitas permanen siswa, akun login siswa, dan riwayat penempatan kelas aktif.
            </p>
          </div>
          <button id="btn-show-add-student" class="btn btn-primary">
            <span>+ Tambah Siswa Baru</span>
          </button>
        </div>

        <!-- FORM MODAL TAMBAH SISWA -->
        <div id="add-student-modal" class="glass-panel" style="display: none; padding: 24px; margin-bottom: 24px; border-color: var(--teal-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="color: var(--teal-primary);">Registrasi Data Siswa Baru</h3>
            <button id="btn-close-student-form" class="btn btn-secondary btn-sm">✕ Tutup</button>
          </div>

          <form id="form-create-student">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
              <div class="form-group">
                <label class="form-label">Nama Lengkap Siswa</label>
                <input type="text" id="std-fullname" class="form-input" placeholder="Contoh: Budi Santoso" required />
              </div>
              <div class="form-group">
                <label class="form-label">NISN (Nomor Induk Siswa Nasional)</label>
                <input type="text" id="std-nisn" class="form-input" placeholder="Contoh: 0089123456" required />
              </div>
              <div class="form-group">
                <label class="form-label">Jenis Kelamin</label>
                <select id="std-gender" class="form-select" required>
                  <option value="L">Laki-Laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
              <div class="form-group">
                <label class="form-label">Kelas Penempatan</label>
                <select id="std-class" class="form-select" required>
                  <option value="7A">Kelas 7A</option>
                  <option value="7B">Kelas 7B</option>
                  <option value="8A" selected>Kelas 8A</option>
                  <option value="8B">Kelas 8B</option>
                  <option value="9A">Kelas 9A</option>
                  <option value="9B">Kelas 9B</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Username Login Siswa</label>
                <input type="text" id="std-username" class="form-input" placeholder="Contoh: budi8a" required />
              </div>
              <div class="form-group">
                <label class="form-label">Kata Sandi Awal</label>
                <input type="text" id="std-password" class="form-input" value="siswa123" required />
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px;">
              <button type="button" id="btn-cancel-student" class="btn btn-secondary">Batal</button>
              <button type="submit" class="btn btn-primary">Simpan Data Siswa</button>
            </div>
          </form>
        </div>

        <!-- FILTER KELAS & SEARCH BAR -->
        <div class="glass-panel" style="padding: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <label class="form-label" style="margin: 0; font-weight: 600;">Filter Kelas:</label>
            <select id="filter-students-class" class="form-select" style="width: 150px; height: 36px;">
              <option value="">Semua Kelas</option>
              <option value="7A">Kelas 7A</option>
              <option value="8A">Kelas 8A</option>
              <option value="9A">Kelas 9A</option>
            </select>
          </div>
          <div style="font-size: 0.8rem; color: var(--teal-primary);">
            ● Total Siswa Terdaftar: <strong>${this.sampleStudents.length} Siswa</strong>
          </div>
        </div>

        <!-- TABEL DATA SISWA -->
        <div class="table-container glass-panel">
          <table class="mathena-table">
            <thead>
              <tr>
                <th>ID Siswa (Permanen)</th>
                <th>NISN</th>
                <th>Nama Lengkap</th>
                <th>L/P</th>
                <th>Kelas Aktif</th>
                <th>Username Akun</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="students-tbody">
              ${this.sampleStudents.map(s => `
                <tr data-class="${s.classId}">
                  <td style="font-family: var(--font-mono); font-weight: 700; color: var(--gold-celestial);">${s.studentId}</td>
                  <td>${s.nisn}</td>
                  <td style="font-weight: 600; color: var(--white-crisp);">${s.fullName}</td>
                  <td><span class="badge badge-muted">${s.gender}</span></td>
                  <td><span class="badge badge-teal">Kelas ${s.classId}</span></td>
                  <td><code style="color: var(--teal-primary);">${s.username}</code></td>
                  <td><span class="badge badge-success">${s.status}</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="alert('Profil detail siswa: ${s.fullName}')">Detail</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>
    `;
  },

  initEvents() {
    const btnShowAdd = document.getElementById('btn-show-add-student');
    const modal = document.getElementById('add-student-modal');
    const btnClose = document.getElementById('btn-close-student-form');
    const btnCancel = document.getElementById('btn-cancel-student');
    const form = document.getElementById('form-create-student');
    const filterClass = document.getElementById('filter-students-class');

    if (btnShowAdd && modal) {
      btnShowAdd.addEventListener('click', () => {
        modal.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const hideModal = () => { if (modal) modal.style.display = 'none'; };
    if (btnClose) btnClose.addEventListener('click', hideModal);
    if (btnCancel) btnCancel.addEventListener('click', hideModal);

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newStd = {
          studentId: `STU-2026-00${this.sampleStudents.length + 1}`,
          username: document.getElementById('std-username').value.trim(),
          nisn: document.getElementById('std-nisn').value.trim(),
          fullName: document.getElementById('std-fullname').value.trim(),
          gender: document.getElementById('std-gender').value,
          classId: document.getElementById('std-class').value,
          status: 'ACTIVE'
        };

        this.sampleStudents.unshift(newStd);
        store.showToast(`Siswa ${newStd.fullName} berhasil didaftarkan!`, 'success');
        form.reset();
        hideModal();

        // Refresh tabel
        const viewport = document.getElementById('app-main-viewport');
        if (viewport) {
          viewport.innerHTML = this.render();
          this.initEvents();
        }
      });
    }

    if (filterClass) {
      filterClass.addEventListener('change', (e) => {
        const val = e.target.value;
        const rows = document.querySelectorAll('#students-tbody tr');
        rows.forEach(r => {
          if (!val || r.getAttribute('data-class') === val) {
            r.style.display = '';
          } else {
            r.style.display = 'none';
          }
        });
      });
    }
  }
};
