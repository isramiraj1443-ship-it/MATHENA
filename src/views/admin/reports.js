/**
 * MATHENA REPORTS & EXPORT VIEW
 * Rekapitulasi nilai akhir, ekspor laporan KBM, dan log audit administratif.
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const AdminReportsView = {
  render() {
    return `
      <div style="max-width: 1100px; margin: 0 auto;">
        <div style="margin-bottom: 24px;">
          <h1 style="font-size: 1.6rem;">📑 Rekap & Laporan Akademik</h1>
          <p style="font-size: 0.85rem; color: var(--white-muted);">
            Unduh rekapitulasi penilaian komprehensif, rekam jejak jurnal, dan berkas nilai siswa.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          
          <div class="glass-panel" style="padding: 24px;">
            <h3 style="color: var(--teal-primary); margin-bottom: 8px;">📊 Rekap Nilai Formatif 1–5 & Diagnostik</h3>
            <p style="font-size: 0.82rem; color: var(--white-muted); margin-bottom: 16px;">
              Format siap cetak dan ekspor format CSV/Excel untuk pengisian raport dan arsip kurikulum.
            </p>
            <div class="form-group">
              <label class="form-label">Pilih Kelas</label>
              <select class="form-select">
                <option>Kelas 7A</option>
                <option>Kelas 8A</option>
                <option>Kelas 9A</option>
              </select>
            </div>
            <button id="btn-export-grades" class="btn btn-primary" style="width: 100%;">Unduh Format Excel (CSV)</button>
          </div>

          <div class="glass-panel" style="padding: 24px;">
            <h3 style="color: var(--gold-celestial); margin-bottom: 8px;">📖 Arsip Jurnal Pembelajaran Guru</h3>
            <p style="font-size: 0.82rem; color: var(--white-muted); margin-bottom: 16px;">
              Kumpulan refleksi KBM berkala, catatan evaluasi respons peserta didik, dan dokumentasi foto.
            </p>
            <div class="form-group">
              <label class="form-label">Rentang Waktu</label>
              <select class="form-select">
                <option>Semester Ganjil 2026/2027</option>
                <option>1 Bulan Terakhir</option>
              </select>
            </div>
            <button id="btn-export-journal" class="btn btn-gold" style="width: 100%;">Cetak Rekap PDF Jurnal</button>
          </div>

        </div>
      </div>
    `;
  },

  initEvents() {
    const btnGrades = document.getElementById('btn-export-grades');
    const btnJournal = document.getElementById('btn-export-journal');

    if (btnGrades) {
      btnGrades.addEventListener('click', () => {
        store.showToast('Memproses berkas rekap nilai...', 'info');
      });
    }
    if (btnJournal) {
      btnJournal.addEventListener('click', () => {
        store.showToast('Menyiapkan dokumen PDF Jurnal KBM...', 'info');
      });
    }
  }
};
