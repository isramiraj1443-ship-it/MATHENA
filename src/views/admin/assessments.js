// ==================== FILE: src/views/admin/assessments.js ====================
/**
 * MATHENA ASSESSMENT ENGINE & GRADEBOOK VIEW
 * Menilai Diagnostik, Formatif 1–5 (Maksimal 5), Sikap (A, B, C, K), Kehadiran,
 * serta Tab "Rekap Nilai" lengkap dengan ekspor CSV/Excel.
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const AdminAssessmentsView = {
  sampleScores: [
    { studentId: 'STU-2026-001', name: 'Aditya Pratama', classId: '8A', diagnostic: 72, f1: 78, f2: 84, f3: 88, f4: null, f5: null, attitude: 'A', attendance: 96, status: 'TUNTAS' },
    { studentId: 'STU-2026-002', name: 'Citra Dewi Lestari', classId: '8A', diagnostic: 85, f1: 85, f2: 86, f3: 85, f4: null, f5: null, attitude: 'A', attendance: 100, status: 'TUNTAS' },
    { studentId: 'STU-2026-003', name: 'Dimas Arya Pamungkas', classId: '8A', diagnostic: 55, f1: 60, f2: 58, f3: 50, f4: null, f5: null, attitude: 'C', attendance: 82, status: 'REMEDIAL' },
    { studentId: 'STU-2026-004', name: 'Evelyn Angelica', classId: '8A', diagnostic: 90, f1: 92, f2: 95, f3: 94, f4: null, f5: null, attitude: 'A', attendance: 98, status: 'TUNTAS' }
  ],

  render() {
    return `
      <div style="max-width: 1200px; margin: 0 auto;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h1 style="font-size: 1.6rem; color: var(--white-crisp);">📈 Mesin Penilaian & Rekap Nilai Siswa</h1>
            <p style="font-size: 0.85rem; color: var(--white-muted);">
              Diagnostik $\\to$ Formatif 1–5 (Maksimal 5) $\\to$ Sikap (A/B/C/K) & Presensi $\\to$ Buku Nilai Terpadu.
            </p>
          </div>
          
          <div style="display: flex; gap: 8px;">
            <select id="assess-filter-class" class="form-select" style="width: 150px; height: 38px;">
              <option value="7A">Kelas 7A</option>
              <option value="8A" selected>Kelas 8A</option>
              <option value="9A">Kelas 9A</option>
            </select>
          </div>
        </div>

        <!-- TABS NAVIGASI PENILAIAN -->
        <div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid var(--glass-border); padding-bottom: 12px; overflow-x: auto;">
          <button class="btn btn-primary btn-sm assess-tab-btn" data-tab="tab-rekap-nilai">📊 Rekap Nilai & Progres</button>
          <button class="btn btn-secondary btn-sm assess-tab-btn" data-tab="tab-formatif">📝 Formatif 1–5 (Max 5)</button>
          <button class="btn btn-secondary btn-sm assess-tab-btn" data-tab="tab-diagnostik">🎯 Asesmen Diagnostik</button>
          <button class="btn btn-secondary btn-sm assess-tab-btn" data-tab="tab-sikap-presensi">🤝 Sikap & Presensi</button>
        </div>

        <!-- TAB 1: REKAP NILAI (GRADEBOOK MASTER) -->
        <div id="tab-rekap-nilai" class="assess-tab-content">
          <div class="glass-panel" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
              <div>
                <h3 style="font-size: 1.15rem; color: var(--teal-primary);">Buku Nilai & Rekap Capaian Akademik</h3>
                <span style="font-size: 0.78rem; color: var(--white-muted);">Sikap: A (Sangat Baik), B (Baik), C (Cukup), K (Kurang).</span>
              </div>
              <button id="btn-export-grades-csv" class="btn btn-outline-teal btn-sm">📥 Unduh Format CSV/Excel</button>
            </div>

            <div class="table-container">
              <table class="mathena-table">
                <thead>
                  <tr>
                    <th>Siswa (ID)</th>
                    <th>Diagnostik</th>
                    <th>F1</th>
                    <th>F2</th>
                    <th>F3</th>
                    <th>F4</th>
                    <th>F5</th>
                    <th>Rata Formatif</th>
                    <th>Predikat Sikap</th>
                    <th>Presensi</th>
                    <th>Status Kelulusan</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.sampleScores.map(s => {
                    const validF = [s.f1, s.f2, s.f3, s.f4, s.f5].filter(v => v !== null && v !== undefined);
                    const avgF = validF.length > 0 ? Math.round(validF.reduce((a,b)=>a+b,0) / validF.length) : '-';
                    const badgeAttitudeClass = s.attitude === 'A' ? 'badge-grade-a' : (s.attitude === 'B' ? 'badge-grade-b' : (s.attitude === 'C' ? 'badge-grade-c' : 'badge-grade-k'));
                    const attitudeLabel = s.attitude === 'A' ? 'A (Sangat Baik)' : (s.attitude === 'B' ? 'B (Baik)' : (s.attitude === 'C' ? 'C (Cukup)' : 'K (Kurang)'));

                    return `
                      <tr>
                        <td>
                          <div style="font-weight: 600;">${s.name}</div>
                          <div style="font-size: 0.72rem; color: var(--white-muted);">${s.studentId}</div>
                        </td>
                        <td><span class="badge badge-teal">${s.diagnostic}</span></td>
                        <td>${s.f1 || '-'}</td>
                        <td>${s.f2 || '-'}</td>
                        <td>${s.f3 || '-'}</td>
                        <td>${s.f4 || '-'}</td>
                        <td>${s.f5 || '-'}</td>
                        <td><strong style="color: var(--gold-celestial); font-size:1.05rem;">${avgF}</strong></td>
                        <td><span class="badge ${badgeAttitudeClass}">${attitudeLabel}</span></td>
                        <td>${s.attendance}%</td>
                        <td>
                          <span class="badge ${s.status === 'TUNTAS' ? 'badge-success' : 'badge-danger'}">${s.status}</span>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB 2: FORMATIF 1–5 INPUT -->
        <div id="tab-formatif" class="assess-tab-content" style="display: none;">
          <div class="glass-panel" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
              <div>
                <h3 style="color: var(--teal-primary);">Input Nilai Formatif Siswa</h3>
                <p style="font-size: 0.8rem; color: var(--gold-celestial); font-weight: 600;">
                  ⚠️ Aturan Ketat: Formatif dibatasi tepat maksimal 5 slot (F1 s.d. F5).
                </p>
              </div>

              <div style="display: flex; align-items: center; gap: 10px;">
                <label class="form-label" style="margin: 0;">Pilih Slot:</label>
                <select id="formative-slot-select" class="form-select" style="width: 160px; height: 36px;">
                  <option value="1">Formatif 1 (F1)</option>
                  <option value="2">Formatif 2 (F2)</option>
                  <option value="3" selected>Formatif 3 (F3)</option>
                  <option value="4">Formatif 4 (F4)</option>
                  <option value="5">Formatif 5 (F5)</option>
                </select>
              </div>
            </div>

            <form id="form-save-formative-batch">
              <div class="table-container">
                <table class="mathena-table">
                  <thead>
                    <tr>
                      <th>Nama Siswa</th>
                      <th>Materi / Indikator Capaian</th>
                      <th>Skor (0–100)</th>
                      <th>Catatan Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Aditya Pratama</td>
                      <td>Teorema Pythagoras & Segitiga Istimewa</td>
                      <td style="width: 120px;"><input type="number" class="form-input" value="88" min="0" max="100" /></td>
                      <td><input type="text" class="form-input" value="Penguasaan konsep segitiga siku-siku sangat baik." /></td>
                    </tr>
                    <tr>
                      <td>Citra Dewi Lestari</td>
                      <td>Teorema Pythagoras & Segitiga Istimewa</td>
                      <td><input type="number" class="form-input" value="85" min="0" max="100" /></td>
                      <td><input type="text" class="form-input" value="Perhitungan akar kuadrat sangat teliti." /></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
                <button type="submit" class="btn btn-primary">Simpan Hasil Penilaian Formatif</button>
              </div>
            </form>
          </div>
        </div>

        <!-- TAB 3: DIAGNOSTIK -->
        <div id="tab-diagnostik" class="assess-tab-content" style="display: none;">
          <div class="glass-panel" style="padding: 20px;">
            <h3 style="color: var(--teal-primary); margin-bottom: 8px;">Asesmen Diagnostik Awal Materi</h3>
            <p style="font-size: 0.8rem; color: var(--white-muted); margin-bottom: 16px;">
              Baseline kompetensi prasyarat sebelum siklus pembelajaran mendalam dimulai.
            </p>
            <div class="table-container">
              <table class="mathena-table">
                <thead>
                  <tr>
                    <th>Siswa</th>
                    <th>Skor Awal</th>
                    <th>Kekuatan</th>
                    <th>Area Bimbingan Tambahan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Aditya Pratama</td>
                    <td><span class="badge badge-teal">72</span></td>
                    <td>Aritmatika dasar kuat</td>
                    <td>Visualisasi bangun ruang dan sudut perlu diasah</td>
                  </tr>
                  <tr>
                    <td>Dimas Arya Pamungkas</td>
                    <td><span class="badge badge-gold">55</span></td>
                    <td>Keingintahuan tinggi</td>
                    <td>Perlu matrikulasi operasi pecahan dan aljabar dasar</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB 4: SIKAP (A, B, C, K) & PRESENSI -->
        <div id="tab-sikap-presensi" class="assess-tab-content" style="display: none;">
          <div class="glass-panel" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <div>
                <h3 style="color: var(--teal-primary);">Penilaian Sikap & Presensi Terpadu</h3>
                <span style="font-size: 0.78rem; color: var(--white-muted);">Skala Penilaian Sikap: A = Sangat Baik, B = Baik, C = Cukup, K = Kurang</span>
              </div>
              <button id="btn-save-attitude-all" class="btn btn-primary btn-sm">Simpan Penilaian Sikap</button>
            </div>

            <div class="table-container">
              <table class="mathena-table">
                <thead>
                  <tr>
                    <th>Siswa</th>
                    <th>Disiplin</th>
                    <th>Tanggung Jawab</th>
                    <th>Kerja Sama</th>
                    <th>Keaktifan</th>
                    <th>Ketekunan</th>
                    <th>Predikat Akhir</th>
                    <th>Presensi (H / I / S / A)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Aditya Pratama</td>
                    <td>
                      <select class="form-select" style="padding:2px 6px; font-size:0.8rem; height:30px;">
                        <option selected>A</option><option>B</option><option>C</option><option>K</option>
                      </select>
                    </td>
                    <td>
                      <select class="form-select" style="padding:2px 6px; font-size:0.8rem; height:30px;">
                        <option selected>A</option><option>B</option><option>C</option><option>K</option>
                      </select>
                    </td>
                    <td>
                      <select class="form-select" style="padding:2px 6px; font-size:0.8rem; height:30px;">
                        <option>A</option><option selected>B</option><option>C</option><option>K</option>
                      </select>
                    </td>
                    <td>
                      <select class="form-select" style="padding:2px 6px; font-size:0.8rem; height:30px;">
                        <option selected>A</option><option>B</option><option>C</option><option>K</option>
                      </select>
                    </td>
                    <td>
                      <select class="form-select" style="padding:2px 6px; font-size:0.8rem; height:30px;">
                        <option selected>A</option><option>B</option><option>C</option><option>K</option>
                      </select>
                    </td>
                    <td><span class="badge badge-grade-a">A (Sangat Baik)</span></td>
                    <td>14 Hadir • 1 Izin • 0 Sakit • 0 Alpa (93%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  initEvents() {
    const tabBtns = document.querySelectorAll('.assess-tab-btn');
    const tabContents = document.querySelectorAll('.assess-tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabBtns.forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-secondary'); });
        btn.classList.remove('btn-secondary'); btn.classList.add('btn-primary');
        tabContents.forEach(tc => { tc.style.display = tc.id === targetTab ? 'block' : 'none'; });
      });
    });

    const formativeForm = document.getElementById('form-save-formative-batch');
    const slotSelect = document.getElementById('formative-slot-select');

    if (formativeForm) {
      formativeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fSlot = parseInt(slotSelect.value, 10);
        if (isNaN(fSlot) || fSlot < 1 || fSlot > 5) {
          store.showToast('Error: Formatif harus bernilai antara 1 sampai 5.', 'error');
          return;
        }

        try {
          await api.saveFormativeResult(fSlot, {
            class_id: document.getElementById('assess-filter-class').value,
            recorded_at: new Date().toISOString()
          });
          store.showToast(`Penilaian Formatif ${fSlot} berhasil disimpan ke database!`, 'success');
        } catch (err) {
          store.showToast(`Gagal: ${err.message}`, 'error');
        }
      });
    }

    const btnExport = document.getElementById('btn-export-grades-csv');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const csvContent = "data:text/csv;charset=utf-8,ID Siswa,Nama Lengkap,Diagnostik,F1,F2,F3,F4,F5,Sikap,Presensi,Status\n" +
          this.sampleScores.map(e => `${e.studentId},${e.name},${e.diagnostic},${e.f1||''},${e.f2||''},${e.f3||''},${e.f4||''},${e.f5||''},${e.attitude},${e.attendance}%,${e.status}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Rekap_Nilai_Matematika_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        store.showToast('File CSV Rekap Nilai berhasil diunduh.', 'success');
      });
    }
  }
};
