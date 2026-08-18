// ==================== FILE: src/views/login.js ====================
/**
 * MATHENA LOGIN VIEW (Polygonal Glassmorphism)
 * Memvalidasi kredensial pengguna, autentikasi server-side via Google Apps Script,
 * menyimpan session token, dan mengarahkan pengguna sesuai kewenangan Role.
 */

import { api } from '../services/api.js';
import { store } from '../store/state.js';

export const LoginView = {
  render() {
    return `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px 16px; position: relative;">
        <!-- Card Login Glassmorphism -->
        <div class="glass-panel polygonal-accent" style="width: 100%; max-width: 420px; padding: 36px 28px; border: 1px solid var(--glass-border-teal); box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
          
          <!-- Logo & Brand Header (Bersih & Rapi) -->
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="https://raw.githubusercontent.com/isramiraj1443-ship-it/MATHENA/main/icon1%20(1).png" alt="Mathena Logo" style="height: 64px; width: auto; margin-bottom: 12px; filter: drop-shadow(0 4px 12px var(--teal-glow));" />
            <h1 style="font-size: 1.75rem; letter-spacing: 1px; margin-bottom: 4px; color: var(--white-crisp);">MATHENA</h1>
            <p style="font-size: 0.84rem; color: var(--teal-primary); font-weight: 600; margin-bottom: 6px;">
              Kebijaksanaan dari Pengetahuan yang Utuh
            </p>
            <p style="font-size: 0.78rem; color: var(--white-muted); line-height: 1.4;">
              Platform Pembelajaran Matematika dan Assessment Management Terintegrasi
            </p>
          </div>

          <!-- Alert Pesan Error -->
          <div id="login-alert" style="display: none; padding: 12px 14px; border-radius: var(--radius-sm); margin-bottom: 20px; font-size: 0.85rem; background: var(--danger-surface); border: 1px solid var(--danger-crimson); color: var(--white-crisp); line-height: 1.4;"></div>

          <!-- Form Login -->
          <form id="login-form">
            <div class="form-group">
              <label class="form-label" for="input-username">Username / Nomor Induk</label>
              <input type="text" id="input-username" class="form-input" placeholder="Masukkan Username atau ID" required autocomplete="username" />
            </div>

            <div class="form-group">
              <label class="form-label" for="input-password">Kata Sandi</label>
              <input type="password" id="input-password" class="form-input" placeholder="••••••••" required autocomplete="current-password" />
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin: 16px 0 22px; font-size: 0.8rem; color: var(--white-muted);">
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="remember-me" checked style="accent-color: var(--teal-primary);" /> Ingat saya
              </label>
              <span style="color: var(--gold-celestial); font-weight: 500;">Kelas 7–9 Math Engine</span>
            </div>

            <button type="submit" id="btn-submit-login" class="btn btn-primary btn-lg" style="width: 100%; font-weight: 700; letter-spacing: 0.5px;">
              <span id="btn-text">MASUK KE SISTEM</span>
              <span id="btn-spinner" style="display: none;">Memverifikasi...</span>
            </button>
          </form>

          <!-- Footer Info -->
          <div style="margin-top: 26px; text-align: center; border-top: 1px solid var(--glass-border); padding-top: 14px; font-size: 0.72rem; color: var(--white-muted);">
            <div>Siklus Belajar: Diagnose $\to$ Learn $\to$ Assess $\to$ Reflect</div>
            <div style="margin-top: 4px; color: rgba(255,255,255,0.35);">Mathena PWA Engine v1.0</div>
          </div>
        </div>
      </div>
    `;
  },

  initEvents() {
    const form = document.getElementById('login-form');
    const alertBox = document.getElementById('login-alert');
    const btnSubmit = document.getElementById('btn-submit-login');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('input-username').value.trim();
      const password = document.getElementById('input-password').value.trim();

      if (!username || !password) {
        alertBox.style.display = 'block';
        alertBox.textContent = 'Harap isi Username dan Kata Sandi dengan benar.';
        return;
      }

      btnSubmit.disabled = true;
      btnText.style.display = 'none';
      btnSpinner.style.display = 'inline';
      alertBox.style.display = 'none';

      try {
        const response = await api.login(username, password);

        if (response && response.success && response.data) {
          const { token, user } = response.data;
          const role = user?.role || response.data.role || 'GUEST';
          
          store.setAuth(token, role, user);
          store.showToast(`Selamat datang, ${user?.fullName || user?.name || username}!`, 'success');

          const normalizedRole = String(role).toUpperCase();
          if (normalizedRole === 'PROCTOR' || normalizedRole === 'PENGAWAS') {
            window.location.hash = '#proctor';
          } else {
            window.location.hash = '#dashboard';
          }
        } else {
          throw new Error(response.message || 'Username atau Kata Sandi salah.');
        }
      } catch (err) {
        alertBox.style.display = 'block';
        alertBox.textContent = err.message || 'Terjadi gangguan autentikasi. Silakan periksa koneksi Anda.';
      } finally {
        btnSubmit.disabled = false;
        btnText.style.display = 'inline';
        btnSpinner.style.display = 'none';
      }
    });
  }
};
