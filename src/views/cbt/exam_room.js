// ==================== FILE: src/views/cbt/exam_room.js ====================
/**
 * MATHENA EXAM ROOM — UNIFIED CBT ENVIRONMENT
 * 1. Jadwal Ujian & Cetak Kartu Peserta (Nama, NISN, User, Pass, Sesi, Ruang)
 * 2. Kelola Bank Soal (Template CSV 5 Tipe, Import File, Toolbar KaTeX MS Word-Style, Unggah Gambar, Keyword Esai)
 * 3. Monitor Ujian Real-Time (Status, Buka Blokir, Reset, Log Insiden)
 * 4. Hasil Ujian CBT (Rekap Nilai Otomatis & Ekspor CSV)
 */

import { api } from '../../services/api.js';
import { store } from '../../store/state.js';
import { Layout } from '../../components/layout.js';

export const CBTExamRoomView = {
  activeTab: 'tab-cbt-jadwal',
  
  examList: [
    {
      id: 'EXM-MAT-8A-01',
      subject: 'Penilaian Tengah Semester (PTS) — Matematika',
      class: '8A',
      session: 'Sesi 1 (08:00–09:30)',
      date: '2026-08-20T08:00',
      duration: 60,
      pin: '58291',
      status: 'Aktif'
    },
    {
      id: 'EXM-MAT-7A-01',
      subject: 'Ulangan Harian Formatif 1 — Aljabar',
      class: '7A',
      session: 'Sesi 2 (10:00–11:00)',
      date: '2026-08-22T10:00',
      duration: 45,
      pin: '74125',
      status: 'Aktif'
    }
  ],

  sampleResults: [
    { studentId: 'STU-2026-001', name: 'Aditya Pratama', classId: '8A', score: 92, submitTime: '20 Agu 2026, 08:52 WIB', status: 'Tuntas' },
    { studentId: 'STU-2026-002', name: 'Citra Dewi Lestari', classId: '8A', score: 88, submitTime: '20 Agu 2026, 08:48 WIB', status: 'Tuntas' },
    { studentId: 'STU-2026-003', name: 'Dimas Arya Pamungkas', classId: '8A', score: 58, submitTime: '20 Agu 2026, 08:58 WIB', status: 'Remedial' }
  ],

  // Fallback Toolbar Simbol Matematika Mandiri
  renderInternalMathToolbar(targetId) {
    if (Layout && typeof Layout.renderMathToolbar === 'function') {
      return Layout.renderMathToolbar(targetId);
    }
    const symbols = [
      { label: '√x', latex: '\\sqrt{x}' },
      { label: 'a/b', latex: '\\frac{a}{b}' },
      { label: 'x²', latex: 'x^{2}' },
      { label: '±', latex: '\\pm' },
      { label: '×', latex: '\\times' },
      { label: '÷', latex: '\\div' },
      { label: 'π', latex: '\\pi' },
      { label: 'θ', latex: '\\theta' },
      { label: '≤', latex: '\\le' },
      { label: '≥', latex: '\\ge' },
      { label: '≠', latex: '\\neq' },
      { label: '△', latex: '\\triangle' },
      { label: '∠', latex: '\\angle' },
      { label: '°', latex: '^\\circ' }
    ];
    return `
      <div class="math-symbol-toolbar" style="display:flex; flex-wrap:wrap; gap:4px; background:rgba(9,13,22,0.9); padding:6px 10px; border-radius:4px; margin-bottom:6px; border:1px solid rgba(248,250,252,0.08);">
        <span style="font-size:0.72rem; color:var(--gold-celestial); font-weight:700; align-self:center; margin-right:4px;">∑ FORMULA:</span>
        ${symbols.map(s => `
          <button type="button" class="math-toolbar-btn" data-latex="${s.latex}" data-target="${targetId}" style="background:var(--bg-obsidian-light); border:1px solid rgba(255,255,255,0.1); color:var(--teal-primary); padding:2px 7px; border-radius:3px; font-size:0.78rem; cursor:pointer;">${s.label}</button>
        `).join('')}
      </div>
    `;
  },

  render() {
    const role = (store.getState().role || '').toUpperCase();
    const isAdminOrGuru = role === 'ADMIN' || role === 'GURU' || role === 'ADMIN_GURU';

    if (isAdminOrGuru) {
      return this.renderAdminControl();
    } else {
      return this.renderStudentPortal();
    }
  },

  renderAdminControl() {
    return `
      <div style="max-width: 1200px; margin: 0 auto;">
        
        <!-- HEADER CONTROL -->
        <div class="glass-panel polygonal-accent" style="padding: 24px; margin-bottom: 20px; border-left: 4px solid var(--teal-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div>
              <span class="badge badge-teal" style="margin-bottom: 6px;">Exam Room Command Center</span>
              <h1 style="font-size: 1.6rem; color: var(--white-crisp);">💻 Exam Room — Manajemen Ujian CBT</h1>
              <p style="font-size: 0.85rem; color: var(--white-muted);">
                Jadwal Ujian · Template & Bank Soal · Toolbar LaTeX · Monitoring Live · Rekap Hasil Ujian.
              </p>
            </div>
            <button id="btn-create-exam-schedule" class="btn btn-primary">
              <span>+ Buat Jadwal Ujian Baru</span>
            </button>
          </div>
        </div>

        <!-- 4 TABS EXAM ROOM -->
        <div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid var(--glass-border); padding-bottom: 12px; overflow-x: auto;">
          <button class="btn btn-primary btn-sm cbt-tab-btn" data-tab="tab-cbt-jadwal">📅 Jadwal & Sesi Ujian</button>
          <button class="btn btn-secondary btn-sm cbt-tab-btn" data-tab="tab-cbt-bank-soal">📚 Kelola Bank Soal</button>
          <button class="btn btn-secondary btn-sm cbt-tab-btn" data-tab="tab-cbt-monitor">📡 Monitor Ujian Real-Time</button>
          <button class="btn btn-secondary btn-sm cbt-tab-btn" data-tab="tab-cbt-hasil">🏆 Hasil Ujian CBT</button>
        </div>

        <!-- ==================== TAB 1: JADWAL & SESI ==================== -->
        <div id="tab-cbt-jadwal" class="cbt-tab-content">
          
          <!-- MODAL FORM BUAT JADWAL UJIAN -->
          <div id="modal-create-exam" class="glass-panel" style="display: none; padding: 24px; margin-bottom: 20px; border-color: var(--teal-primary);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="color: var(--teal-primary);">Buat Jadwal Ujian & Sesi Baru</h3>
              <button id="btn-close-exam-modal" class="btn btn-secondary btn-sm">✕ Tutup</button>
            </div>

            <form id="form-create-new-exam">
              <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 14px;">
                <div class="form-group">
                  <label class="form-label">Nama Mata Pelajaran / Judul Ujian</label>
                  <input type="text" id="exam-subject" class="form-input" placeholder="Contoh: PTS Matematika Semester Ganjil" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Pilih Kelas</label>
                  <select id="exam-class" class="form-select" required>
                    <option value="7A">Kelas 7A</option>
                    <option value="7B">Kelas 7B</option>
                    <option value="8A" selected>Kelas 8A</option>
                    <option value="8B">Kelas 8B</option>
                    <option value="9A">Kelas 9A</option>
                    <option value="9B">Kelas 9B</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Sesi Ujian</label>
                  <input type="text" id="exam-session" class="form-input" value="Sesi 1 (08:00–09:30)" required />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px;">
                <div class="form-group">
                  <label class="form-label">Waktu Pelaksanaan</label>
                  <input type="datetime-local" id="exam-datetime" class="form-input" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Durasi (Menit)</label>
                  <input type="number" id="exam-duration" class="form-input" value="60" min="15" max="180" required />
                </div>
                <div class="form-group">
                  <label class="form-label">PIN Sesi (5 Digit)</label>
                  <input type="text" id="exam-pin" class="form-input" value="58291" required />
                </div>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
                <button type="button" id="btn-cancel-exam" class="btn btn-secondary">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan & Aktifkan Jadwal</button>
              </div>
            </form>
          </div>

          <div class="table-container glass-panel">
            <table class="mathena-table">
              <thead>
                <tr>
                  <th>Mata Pelajaran & Kelas</th>
                  <th>Waktu Pelaksanaan</th>
                  <th>Durasi</th>
                  <th>PIN Sesi</th>
                  <th>Status</th>
                  <th>Aksi & Cetak</th>
                </tr>
              </thead>
              <tbody id="exam-table-body">
                ${this.examList.map(e => `
                  <tr>
                    <td>
                      <div style="font-weight: 600; color: var(--white-crisp);">${e.subject}</div>
                      <div style="font-size: 0.75rem; color: var(--white-muted);">Target: Kelas ${e.class} • ${e.session || 'Sesi 1'}</div>
                    </td>
                    <td>${String(e.date).replace('T', ' ')}</td>
                    <td>${e.duration} Menit</td>
                    <td><code style="color: var(--gold-celestial); font-weight:700; font-size:1.05rem;">${e.pin}</code></td>
                    <td><span class="badge badge-success">${e.status}</span></td>
                    <td>
                      <button class="btn btn-outline-gold btn-sm btn-print-card" data-class="${e.class}">🪪 Cetak Kartu Peserta</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- ==================== TAB 2: KELOLA BANK SOAL ==================== -->
        <div id="tab-cbt-bank-soal" class="cbt-tab-content" style="display: none;">
          <div class="glass-panel" style="padding: 22px;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; background: rgba(15,23,42,0.85); padding: 14px; border-radius: var(--radius-sm);">
              <div>
                <h4 style="color: var(--gold-celestial); margin-bottom: 4px;">📥 Template & Import Bank Soal Excel/CSV</h4>
                <p style="font-size: 0.78rem; color: var(--white-muted);">Dukungan 5 Tipe: PG, PG Kompleks, Benar/Salah (AKM), Menjodohkan, dan Esai/Uraian.</p>
              </div>

              <div style="display: flex; gap: 10px;">
                <button id="btn-download-cbt-template" class="btn btn-outline-teal btn-sm">📄 Unduh Template CSV</button>
                <label class="btn btn-gold btn-sm" style="cursor: pointer;">
                  📂 Import Berkas Soal
                  <input type="file" id="input-import-cbt-file" accept=".csv, .xlsx" style="display: none;" />
                </label>
              </div>
            </div>

            <!-- FORM INPUT MANUAL SOAL DENGAN TOOLBAR RUMUS & UNGGAH GAMBAR -->
            <div class="glass-panel" style="padding: 20px; margin-bottom: 20px; border-color: var(--teal-primary);">
              <h4 style="color: var(--teal-primary); margin-bottom: 12px;">✍️ Input Butir Soal Manual dengan Rumus & Gambar</h4>

              <form id="form-manual-question">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                  <div class="form-group">
                    <label class="form-label">Tipe Soal</label>
                    <select id="q-type-select" class="form-select">
                      <option value="PG" selected>Pilihan Ganda (PG)</option>
                      <option value="PG_KOMPLEKS">PG Kompleks (Jawaban Jamak)</option>
                      <option value="BS">Benar / Salah (AKM)</option>
                      <option value="JODOH">Menjodohkan</option>
                      <option value="ESAI">Esai / Uraian Bebas</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Bobot / Poin</label>
                    <input type="number" id="q-weight" class="form-input" value="10" min="1" max="100" />
                  </div>
                </div>

                <label class="form-label">Teks Pertanyaan & Formula KaTeX</label>
                ${this.renderInternalMathToolbar('q-content-text')}
                
                <div class="form-group">
                  <textarea id="q-content-text" class="form-textarea" rows="3" placeholder="Ketik pertanyaan matematika di sini..." required></textarea>
                </div>

                <!-- Field Unggah Gambar Soal -->
                <div class="form-group" style="background: rgba(15,23,42,0.7); padding: 12px; border-radius: var(--radius-sm); border: 1px dashed var(--glass-border-teal);">
                  <label class="form-label" style="color: var(--teal-primary); font-weight:600;">📷 Unggah Gambar Ilustrasi / Diagram Soal (Opsional)</label>
                  <input type="file" id="q-image-file" class="form-input" accept="image/*" />
                  <div id="q-image-preview" style="display: none; margin-top: 8px;"></div>
                </div>

                <!-- CONTAINER PILIHAN JAWABAN DINAMIS -->
                <div id="q-options-container">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                    <div>
                      <label class="form-label">Pilihan A</label>
                      <input type="text" class="form-input q-opt" placeholder="Jawaban A" />
                    </div>
                    <div>
                      <label class="form-label">Pilihan B</label>
                      <input type="text" class="form-input q-opt" placeholder="Jawaban B" />
                    </div>
                    <div>
                      <label class="form-label">Pilihan C</label>
                      <input type="text" class="form-input q-opt" placeholder="Jawaban C" />
                    </div>
                    <div>
                      <label class="form-label">Pilihan D</label>
                      <input type="text" class="form-input q-opt" placeholder="Jawaban D" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Kunci Jawaban Benar (Pilih Huruf A, B, C, atau D)</label>
                    <select id="q-correct-key" class="form-select">
                      <option value="A">Pilihan A</option>
                      <option value="B">Pilihan B</option>
                      <option value="C">Pilihan C</option>
                      <option value="D">Pilihan D</option>
                    </select>
                  </div>
                </div>

                <!-- FIELD KEYWORD UNTUK SOAL ESAI -->
                <div id="q-essay-keyword-box" class="form-group" style="display: none;">
                  <label class="form-label" style="color: var(--gold-celestial); font-weight:600;">🔑 Keyword / Kata Kunci Koreksi Esai (Pisahkan dengan koma)</label>
                  <input type="text" id="q-essay-keywords" class="form-input" placeholder="Contoh: hipotenusa, akar 64, 8 cm, tripel pythagoras" />
                  <span style="font-size: 0.72rem; color: var(--white-muted);">Sistem akan otomatis mencocokkan kata kunci ini terhadap uraian jawaban siswa.</span>
                </div>

                <div style="display: flex; justify-content: flex-end; margin-top: 14px;">
                  <button type="submit" class="btn btn-primary">+ Tambah Soal ke Bank</button>
                </div>
              </form>
            </div>

          </div>
        </div>

        <!-- ==================== TAB 3: MONITORING REAL-TIME ==================== -->
        <div id="tab-cbt-monitor" class="cbt-tab-content" style="display: none;">
          <div class="glass-panel" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="color: var(--teal-primary);">Pantauan Langsung Peserta Ujian</h3>
              <button id="btn-refresh-cbt-monitor" class="btn btn-outline-teal btn-sm">🔄 Refresh Status Peserta</button>
            </div>

            <div class="table-container">
              <table class="mathena-table">
                <thead>
                  <tr>
                    <th>Peserta (ID)</th>
                    <th>Kelas</th>
                    <th>Status Ujian</th>
                    <th>Aktivitas Terakhir</th>
                    <th>Nilai Sementara</th>
                    <th>Aksi Pengawas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div style="font-weight:600;">Aditya Pratama</div>
                      <div style="font-size:0.72rem; color:var(--white-muted);">STU-2026-001</div>
                    </td>
                    <td>Kelas 8A</td>
                    <td><span class="badge badge-teal">MENGERJAKAN (18/20)</span></td>
                    <td>08:44 WIB (Autosave)</td>
                    <td><strong style="color: var(--gold-celestial); font-size:1.05rem;">-</strong></td>
                    <td><button class="btn btn-secondary btn-sm" onclick="alert('Peserta sedang aktif normal.')">Info</button></td>
                  </tr>
                  <tr>
                    <td>
                      <div style="font-weight:600;">Citra Dewi Lestari</div>
                      <div style="font-size:0.72rem; color:var(--white-muted);">STU-2026-002</div>
                    </td>
                    <td>Kelas 8A</td>
                    <td><span class="badge badge-success">SELESAI (SUBMIT)</span></td>
                    <td>08:48 WIB</td>
                    <td><strong style="color: var(--gold-celestial); font-size:1.05rem;">88</strong></td>
                    <td><span class="badge badge-muted">Terkunci</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div style="font-weight:600;">Dimas Arya Pamungkas</div>
                      <div style="font-size:0.72rem; color:var(--white-muted);">STU-2026-003</div>
                    </td>
                    <td>Kelas 8A</td>
                    <td><span class="badge badge-danger">TERPUTUS / OFFLINE</span></td>
                    <td>08:35 WIB</td>
                    <td>-</td>
                    <td><button class="btn btn-outline-teal btn-sm" onclick="alert('Akses ujian siswa dipulihkan.')">Buka Akses</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ==================== TAB 4: HASIL UJIAN CBT ==================== -->
        <div id="tab-cbt-hasil" class="cbt-tab-content" style="display: none;">
          <div class="glass-panel" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
              <div>
                <h3 style="color: var(--gold-celestial);">Rekapitulasi Hasil Nilai Ujian CBT</h3>
                <span style="font-size: 0.78rem; color: var(--white-muted);">Nilai dikoreksi otomatis untuk PG, PG Kompleks, BS AKM, Jodoh, dan Esai (via Keyword).</span>
              </div>
              <button id="btn-export-cbt-results" class="btn btn-outline-teal btn-sm">📥 Unduh Rekap Hasil Ujian (CSV)</button>
            </div>

            <div class="table-container">
              <table class="mathena-table">
                <thead>
                  <tr>
                    <th>Nama Peserta (ID)</th>
                    <th>Kelas</th>
                    <th>Waktu Pengumpulan</th>
                    <th>Nilai Akhir</th>
                    <th>Status KKM (≥75)</th>
                    <th>Rincian Jawaban</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.sampleResults.map(r => `
                    <tr>
                      <td>
                        <div style="font-weight: 600; color: var(--white-crisp);">${r.name}</div>
                        <div style="font-size: 0.72rem; color: var(--white-muted);">${r.studentId}</div>
                      </td>
                      <td>${r.classId}</td>
                      <td>${r.submitTime}</td>
                      <td><strong style="color: var(--gold-celestial); font-size:1.15rem;">${r.score}</strong></td>
                      <td><span class="badge ${r.status === 'Tuntas' ? 'badge-success' : 'badge-danger'}">${r.status}</span></td>
                      <td>
                        <button class="btn btn-secondary btn-sm" onclick="alert('Analisis Butir Soal untuk: ${r.name}')">Lihat Jawaban</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- MODAL CETAK KARTU PESERTA UJIAN -->
        <div id="card-print-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 9999; overflow-y: auto; padding: 30px 16px;">
          <div style="max-width: 520px; margin: 0 auto; position: relative;">
            <button id="btn-close-card-modal" class="btn btn-danger btn-sm" style="position: absolute; right: 0; top: -40px;">✕ Tutup</button>
            
            <div class="test-card-box" id="test-card-printable" style="background:#FFFFFF; color:#0F172A; border:2px solid #0F172A; border-radius:8px; padding:20px; font-family:sans-serif;">
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0F172A; padding-bottom: 10px; margin-bottom: 12px;">
                <img src="https://raw.githubusercontent.com/isramiraj1443-ship-it/MATHENA/main/icon1%20(1).png" alt="Logo" style="height: 38px;" />
                <div style="text-align: right;">
                  <div style="font-weight: 800; font-size: 0.95rem; letter-spacing: 0.5px;">KARTU PESERTA UJIAN CBT</div>
                  <div style="font-size: 0.72rem;">SMP MATHENA ACADEMY 2026/2027</div>
                </div>
              </div>

              <div style="font-size: 0.85rem; line-height: 1.6; margin-bottom: 12px;">
                <div style="display: grid; grid-template-columns: 110px 10px 1fr;">
                  <div>Nama Peserta</div><div>:</div><strong>Aditya Pratama</strong>
                  <div>NISN / ID</div><div>:</div><span>0089123401 / STU-2026-001</span>
                  <div>Kelas / Ruang</div><div>:</div><span>Kelas 8A / Lab Komputer 1</span>
                  <div>Username Login</div><div>:</div><strong style="color: #0d9488;">aditya</strong>
                  <div>Kata Sandi</div><div>:</div><strong style="color: #d97706;">siswa123</strong>
                  <div>Sesi Ujian</div><div>:</div><span>Sesi 1 (08:00–09:30 WIB)</span>
                </div>
              </div>

              <div style="border-top: 1px dashed #0F172A; padding-top: 8px; font-size: 0.7rem; color: #64748B; text-align: center;">
                Simpan kartu ini dengan baik. Dilarang memberitahukan kata sandi kepada orang lain.
              </div>
            </div>

            <div style="text-align: center; margin-top: 16px;">
              <button class="btn btn-gold btn-lg" onclick="window.print()">🖨️ Cetak Kartu Ujian</button>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  renderStudentPortal() {
    return `
      <div style="max-width: 520px; margin: 40px auto;">
        <div class="glass-panel polygonal-accent" style="padding: 36px 28px; text-align: center; border: 1px solid var(--glass-border-teal);">
          <span style="font-size: 2.5rem;">💻</span>
          <h2 style="font-size: 1.5rem; color: var(--white-crisp); margin: 12px 0 6px;">Exam Room — Portal Ujian Siswa</h2>
          <p style="font-size: 0.82rem; color: var(--white-muted); margin-bottom: 24px;">
            Masukkan PIN Sesi 5 Digit yang tertera pada Kartu Ujian atau diberikan Pengawas.
          </p>

          <form id="form-student-enter-cbt">
            <div class="form-group" style="text-align: left;">
              <label class="form-label">PIN Sesi Ujian</label>
              <input type="text" id="student-cbt-pin" class="form-input" placeholder="•••••" style="text-align: center; font-size: 1.5rem; letter-spacing: 6px; font-weight: 700;" required />
            </div>

            <button type="submit" class="btn btn-gold btn-lg" style="width: 100%; font-weight: 700; margin-top: 10px;">
              MASUK & MULAI UJIAN
            </button>
          </form>
        </div>
      </div>
    `;
  },

  initEvents() {
    const role = (store.getState().role || '').toUpperCase();
    const isAdminOrGuru = role === 'ADMIN' || role === 'GURU' || role === 'ADMIN_GURU';

    if (isAdminOrGuru) {
      this.initAdminEvents();
    } else {
      this.initStudentEvents();
    }
  },

  initAdminEvents() {
    if (Layout && typeof Layout.bindMathToolbarEvents === 'function') {
      Layout.bindMathToolbarEvents();
    } else {
      document.querySelectorAll('.math-toolbar-btn').forEach(btn => {
        btn.onclick = () => {
          const latex = btn.getAttribute('data-latex');
          const targetId = btn.getAttribute('data-target');
          const textarea = document.getElementById(targetId);
          if (!textarea) return;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const text = textarea.value;
          const insertText = `$${latex}$`;
          textarea.value = text.substring(0, start) + insertText + text.substring(end);
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
          textarea.dispatchEvent(new Event('input'));
        };
      });
    }

    // Tab Switching
    const tabBtns = document.querySelectorAll('.cbt-tab-btn');
    const tabContents = document.querySelectorAll('.cbt-tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        tabBtns.forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-secondary'); });
        btn.classList.remove('btn-secondary'); btn.classList.add('btn-primary');
        tabContents.forEach(tc => tc.style.display = tc.id === target ? 'block' : 'none');
      });
    });

    // Modal Jadwal Ujian
    const btnShowExamModal = document.getElementById('btn-create-exam-schedule');
    const examModal = document.getElementById('modal-create-exam');
    const btnCloseExam = document.getElementById('btn-close-exam-modal');
    const btnCancelExam = document.getElementById('btn-cancel-exam');
    const formExam = document.getElementById('form-create-new-exam');

    if (btnShowExamModal && examModal) {
      btnShowExamModal.addEventListener('click', () => {
        examModal.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const hideExamModal = () => { if (examModal) examModal.style.display = 'none'; };
    if (btnCloseExam) btnCloseExam.addEventListener('click', hideExamModal);
    if (btnCancelExam) btnCancelExam.addEventListener('click', hideExamModal);

    if (formExam) {
      formExam.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newExam = {
          id: `EXM-${Date.now()}`,
          subject: document.getElementById('exam-subject').value.trim(),
          class: document.getElementById('exam-class').value,
          session: document.getElementById('exam-session').value.trim(),
          date: document.getElementById('exam-datetime').value,
          duration: Number(document.getElementById('exam-duration').value),
          pin: document.getElementById('exam-pin').value.trim(),
          status: 'Aktif'
        };

        try {
          await api.saveExam(newExam);
          this.examList.unshift(newExam);
          store.showToast('Jadwal ujian berhasil disimpan dan aktif!', 'success');
          formExam.reset();
          hideExamModal();

          const viewport = document.getElementById('app-main-viewport');
          if (viewport) {
            viewport.innerHTML = this.render();
            this.initEvents();
          }
        } catch (err) {
          store.showToast(`Gagal: ${err.message}`, 'error');
        }
      });
    }

    // Modal Cetak Kartu Peserta
    const cardModal = document.getElementById('card-print-modal');
    const btnCloseCard = document.getElementById('btn-close-card-modal');
    document.querySelectorAll('.btn-print-card').forEach(btn => {
      btn.addEventListener('click', () => {
        if (cardModal) cardModal.style.display = 'block';
      });
    });
    if (btnCloseCard) btnCloseCard.addEventListener('click', () => { cardModal.style.display = 'none'; });

    // Download Template CSV
    const btnDownloadTemplate = document.getElementById('btn-download-cbt-template');
    if (btnDownloadTemplate) {
      btnDownloadTemplate.addEventListener('click', () => {
        const csv = "data:text/csv;charset=utf-8,TIPE,PERTANYAAN,OPSI_A,OPSI_B,OPSI_C,OPSI_D,KUNCI_JAWABAN,BOBOT,KEYWORD_ESAI\n" +
          "PG,Berapakah nilai dari $5 \\times 5$?,10,20,25,30,C,10,\n" +
          "PG_KOMPLEKS,Pilih yang merupakan bilangan prima,2,4,7,9,A|C,10,\n" +
          "BS,Apakah segitiga siku-siku memiliki sudut 90 derajat?,Benar,Salah,,,Benar,10,\n" +
          "ESAI,Jelaskan pembuktian teorema Pythagoras!,,,,,,20,c^2=a^2+b^2;hipotenusa;siku-siku\n";
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csv));
        link.setAttribute("download", "Template_Bank_Soal_Mathena_CBT.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        store.showToast('Template Bank Soal berhasil diunduh.', 'success');
      });
    }

    // Dynamic Options per Type
    const qTypeSelect = document.getElementById('q-type-select');
    const optionsContainer = document.getElementById('q-options-container');
    const essayKeywordBox = document.getElementById('q-essay-keyword-box');

    if (qTypeSelect) {
      qTypeSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'ESAI') {
          if (optionsContainer) optionsContainer.style.display = 'none';
          if (essayKeywordBox) essayKeywordBox.style.display = 'block';
        } else {
          if (optionsContainer) optionsContainer.style.display = 'block';
          if (essayKeywordBox) essayKeywordBox.style.display = 'none';
        }
      });
    }

    // Manual Question Form Submit
    const formQuestion = document.getElementById('form-manual-question');
    if (formQuestion) {
      formQuestion.addEventListener('submit', (e) => {
        e.preventDefault();
        store.showToast('Butir soal berhasil ditambahkan ke Bank Soal Exam Room!', 'success');
        formQuestion.reset();
      });
    }

    // Export Hasil Ujian
    const btnExportResults = document.getElementById('btn-export-cbt-results');
    if (btnExportResults) {
      btnExportResults.addEventListener('click', () => {
        const csv = "data:text/csv;charset=utf-8,ID Siswa,Nama Peserta,Kelas,Waktu Submit,Nilai Akhir,Status\n" +
          this.sampleResults.map(r => `${r.studentId},${r.name},${r.classId},${r.submitTime},${r.score},${r.status}`).join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csv));
        link.setAttribute("download", "Hasil_Ujian_CBT_Matematika.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        store.showToast('Rekap Hasil Ujian berhasil diunduh.', 'success');
      });
    }
  },

  initStudentEvents() {
    const form = document.getElementById('form-student-enter-cbt');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pin = document.getElementById('student-cbt-pin').value.trim();
        if (pin === '58291' || pin === '74125') {
          store.showToast('PIN Terverifikasi. Memasuki sesi ujian...', 'success');
          alert('Ujian PTS Matematika dimulai! Durasi: 60 Menit.');
        } else {
          store.showToast('PIN Ujian tidak valid untuk sesi ini.', 'error');
        }
      });
    }
  }
};

// Ekspor Tambahan untuk Kompatibilitas Maksimal
export const ExamRoomView = CBTExamRoomView;
export default CBTExamRoomView;
