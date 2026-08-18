/**
 * MATHENA LOGIN VIEW (Polygonal Glassmorphism)
 * Memvalidasi kredensial pengguna, autentikasi server-side via Google Apps Script,
 * menyimpan session token, dan mengarahkan pengguna sesuai kewenangan Role.
 */

import { api } from '../services/api.js';
import { store } from '../store/state.js';
import { Layout } from '../components/layout.js';

export const LoginView = {
  render() {
    return `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; position: relative;">
        <!-- Card Login Glassmorphism -->
        <div class="glass-panel polygonal-accent" style="width: 100%; max-width: 440px; padding: 40px 32px; border: 1px solid var(--glass-border-teal); box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
          
          <!-- Logo & Brand Header -->
          <div style="text-align: center; margin-bottom: 28px;">
            <img src="https://raw.githubusercontent.com/isramiraj1443-ship-it/MATHENA/main/icon1%20(1).png" alt="Mathena Logo" style="height: 68px; margin-bottom: 12px; filter: drop-shadow(0 4px 12px var(--teal-glow));" />
            <h1 style="font-size: 1.8rem; margin-bottom: 4px;">MATHENA</h1>
            <p style="font-size: 0.82rem; color: var(--gold-celestial); font-style: italic; letter-spacing: 0.5px;">
              $$\\text{Kebijaksanaan dari Pengetahuan yang Utuh}$$
            </p>
          </div>

          <!-- Alert Pesan Error -->
          <div id="login-alert" style="display: none; padding: 12px 14px; border-radius: var(--radius-sm); margin-bottom: 20px; font-size: 0.88rem; background: var(--danger-surface); border: 1px solid var(--danger-crimson); color: var(--white-crisp);"></div>

          <!-- Form Login -->
          <form id="login-form">
            <div class="form-group">
              <label class="form-label" for="input-username">Username / Nomor Induk</label>
              <input type="text" id="input-username" class="form-input" placeholder="Masukkan ID / Username" required autocomplete="username" />
            </div>

            <div class="form-group">
              <label class="form-label" for="input-password">Kata Sandi</label>
              <input type="password" id="input-password" class="form-input" placeholder="••••••••" required autocomplete="current-password" />
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin: 18px 0 24px; font-size: 0.82rem; color: var(--white-muted);">
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="remember-me" checked style="accent-color: var(--teal-primary);" /> Ingat sesi saya
              </label>
              <span style="color: var(--white-muted);">Kelas 7–9 Math Engine</span>
            </div>

            <button type="submit" id="btn-submit-login" class="btn btn-primary btn-lg" style="width: 100%; font-weight: 700; letter-spacing: 0.5px;">
              <span id="btn-text">MASUK KE SISTEM</span>
              <span id="btn-spinner" style="display: none;">Memverifikasi...</span>
            </button>
          </form>

          <!-- Footer Metadata -->
          <div style="margin-top: 32px; text-align: center; border-top: 1px solid var(--glass-border); padding-top: 16px; font-size: 0.75rem; color: var(--white-muted);">
            <div>Platform Diagnostik $\\cdot$ Formatif 1–5 $\\cdot$ EXAM CBT</div>
            <div style="margin-top: 4px; color: rgba(255,255,255,0.3);">Mathena Architecture v1.0 — 39 Sheet Contract</div>
          </div>
        </div>
      </div>
    `;
  },

  initEvents() {
    // Render rumus KaTeX pada halaman login
    Layout.renderMathFormulas(document.getElementById('app-root'));

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

      // UI Loading State
      btnSubmit.disabled = true;
      btnText.style.display = 'none';
      btnSpinner.style.display = 'inline';
      alertBox.style.display = 'none';

      try {
        const response = await api.login(username, password);

        if (response && response.success && response.data) {
          const { token, role, user } = response.data;
          store.setAuth(token, role, user);
          store.showToast(`Selamat datang, ${user.name || username}!`, 'success');

          // Perutean Berdasarkan Kewenangan Role Sesuai PRD
          const normalizedRole = role.toUpperCase();
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
