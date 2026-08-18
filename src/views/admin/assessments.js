// ==================== FILE: src/views/admin/assessments.js ====================
/**
 * MATHENA ASSESSMENT ENGINE VIEW
 * Mengelola Penilaian Diagnostik, Formatif 1–5 (Maksimal 5 Sesuai PRD),
 * Sikap, Kehadiran, dan Analisis Progres Belajar.
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';

export const AdminAssessmentsView = {
  render() {
    return `
      <div style="max-width: 1200px; margin: 0 auto;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h1 style="font-size: 1.6rem; color: var(--white-crisp);">📈 Mesin Penilaian & Analisis Siswa</h1>
            <p style="font-size: 0.85rem; color: var(--white-muted);">
              Siklus Penilaian: Diagnostik → Formatif 1–5 (Maksimal 5) → Sikap & Presensi → Rekap Longitudinal.
            </p>
          </div>
          
          <div style="display: flex; gap: 8px;">
            <select id="assess-filter-class" class="form-select" style="width: 150px; height: 38px;">
              <option value="7A">Kelas 7A</option>
              <option value="7B">Kelas 7B</option>
              <option value="8A" selected>Kelas 8A</option>
              <option value="9A">Kelas 9A</option>
            </select>
          </div>
        </div>

        <!-- TABS PENILAIAN -->
        <div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid var(--glass-border); padding-bottom: 12px; overflow-x: auto;">
          <button class="btn btn-primary btn-sm assess-tab-btn" data-tab="tab-summary">📊 Rekap & Tren Progres</button>
          <button class="btn btn-secondary btn-sm assess-tab-btn" data-tab="tab-formative">📝 Formatif 1–5</button>
          <button class="btn btn-secondary btn-sm assess-tab-btn" data-tab="tab-diagnostic">🎯 Asesmen Diagnostik</button>
          <button class="btn btn-secondary btn-sm assess-tab-btn" data-tab="tab-attitude-attendance">🤝 Sikap & Kehadiran</button>
        </div>

        <!-- TAB 1: REKAP SUMMARY & LONGITUDINAL PROGRESS -->
        <div id="tab-summary" class="assess-tab-content">
          <div class="glass-panel" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div>
                <h3 style="font-size: 1.15rem; color: var(--teal-primary);">Rekapitulasi Capaian Belajar Siswa</h3>
                <span style="font-size: 0.78rem; color: var(--white-muted);">Data terintegrasi dari Diagnostik, Formatif 1–5, Sikap, dan Presensi.</span>
              </div>
              <button id="btn-export-assessment" class="btn btn-outline-teal btn-sm">📥 Ekspor CSV</button>
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
                    <th>Sikap</th>
                    <th>Presensi</th>
                    <th>Status Progres</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div style="font-weight: 600;">Aditya Pratama</div>
                      <div style="font-size: 0.72rem; color: var(--white-muted);">STU-2026-001</div>
                    </td>
                    <td><span class="badge badge-teal">72</span></td>
                    <td>78</td>
                    <td>84</td>
                    <td>88</td>
                    <td>-</td>
                    <td>-</td>
                    <td><span class="badge badge-success">Sangat Baik</span></td>
                    <td>96%</td>
                    <td><span class="badge badge-teal">📈 MENINGKAT</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div style="font-weight: 600;">Citra Dewi Lestari</div>
                      <div style="font-size: 0.72rem; color: var(--white-muted);">STU-2026-002</div>
                    </td>
                    <td><span class="badge badge-teal">85</span></td>
                    <td>85</td>
                    <td>86</td>
                    <td>85</td>
                    <td>-</td>
                    <td>-</td>
                    <td><span class="badge badge-success">Baik</span></td>
                    <td>100%</td>
                    <td><span class="badge badge-gold">⚖️ STABIL</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div style="font-weight: 600;">Dimas Arya Pamungkas</div>
                      <div style="font-size: 0.72rem; color: var(--white-muted);">STU-2026-003</div>
                    </td>
                    <td><span class="badge badge-gold">55</span></td>
                    <td>60</td>
                    <td>58</td>
                    <td>50</td>
                    <td>-</td>
                    <td>-</td>
                    <td><span class="badge badge-muted">Cukup</span></td>
                    <td>82%</td>
                    <td><span class="badge badge-danger">⚠️ PERLU PERHATIAN</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB 2: FORMATIF 1–5 -->
        <div id="tab-formative" class="assess-tab-content" style="display: none;">
          <div class="glass-panel" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div>
                <h3 style="color: var(--teal-primary);">Input Nilai Formatif Siswa</h3>
                <p style="font-size: 0.8rem; color: var(--gold-celestial); font-weight: 600;">
                  ⚠️ Aturan PRD: Formatif dibatasi tepat maksimal 5 (F1–F5).
                </p>
              </div>

              <div style="display: flex; align-items: center; gap: 10px;">
                <label class="form-label" style="margin: 0;">Pilih Formatif:</label>
                <select id="formative-slot-select" class="form-select" style="width: 150px; height: 36px;">
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
                      <th>Siswa</th>
                      <th>Materi / Indikator</th>
                      <th>Skor Formatif (0–100)</th>
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
                      <td><input type="text" class="form-input" value="Perhitungan akar sangat teliti." /></td>
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
        <div id="tab-diagnostic" class="assess-tab-content" style="display: none;">
          <div class="glass-panel" style="padding: 20px;">
            <h3 style="color: var(--teal-primary); margin-bottom: 8px;">Asesmen Diagnostik Awal Materi</h3>
            <p style="font-size: 0.8rem; color: var(--white-muted); margin-bottom: 16px;">
              Digunakan sebagai baseline kompetensi awal sebelum pembelajaran mendalam dimulai.
            </p>
            <div class="table-container">
              <table class="mathena-table">
                <thead>
                  <tr>
                    <th>Siswa</th>
                    <th>Level Awal</th>
                    <th>Kekuatan</th>
                    <th>Kelemahan / Area Bimbingan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Aditya Pratama</td>
                    <td><span class="badge badge-teal">Menengah (72)</span></td>
                    <td>Aritmatika dasar kuat</td>
                    <td>Visualisasi spasial perlu dilatih</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB 4: SIKAP & KEHADIRAN -->
        <div id="tab-attitude-attendance" class="assess-tab-content" style="display: none;">
          <div class="glass-panel" style="padding: 20px;">
            <h3 style="color: var(--teal-primary); margin-bottom: 12px;">Pencatatan Sikap & Presensi Kehadiran Terpadu</h3>
            <div class="table-container">
              <table class="mathena-table">
                <thead>
                  <tr>
                    <th>Siswa</th>
                    <th>Disiplin</th>
                    <th>Tanggung Jawab</th>
                    <th>Kerja Sama</th>
                    <th>Keaktifan</th>
                    <th>Presensi (Hadir/Izin/Sakit/Alpa)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Aditya Pratama</td>
                    <td><span class="badge badge-success">Sangat Baik</span></td>
                    <td><span class="badge badge-success">Sangat Baik</span></td>
                    <td><span class="badge badge-success">Baik</span></td>
                    <td><span class="badge badge-teal">Aktif</span></td>
                    <td>Hadir: 14 • Izin: 1 • Sakit: 0 • Alpa: 0 (93%)</td>
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

        tabBtns.forEach(b => {
          b.classList.remove('btn-primary');
          b.classList.add('btn-secondary');
        });
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');

        tabContents.forEach(tc => {
          tc.style.display = tc.id === targetTab ? 'block' : 'none';
        });
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
          store.showToast(`Penilaian Formatif ${fSlot} berhasil disimpan ke database.`, 'success');
        } catch (err) {
          store.showToast(`Gagal: ${err.message}`, 'error');
        }
      });
    }

    const btnExport = document.getElementById('btn-export-assessment');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        store.showToast('Mengekspor laporan penilaian ke format Excel/CSV...', 'info');
      });
    }
  }
};
