// ==================== FILE: src/components/layout.js ====================
/**
 * MATHENA COMMON LAYOUT & UI COMPONENTS
 * Dilengkapi Navigasi Menu Developer, Universal KaTeX Dispatcher, dan App Shell.
 */

import { store } from '../store/state.js';
import { api } from '../services/api.js';

export const Layout = {
  renderAppShell(contentHtml, activeRoute) {
    const state = store.getState();
    const user = state.user || { name: 'User', role: state.role || 'GUEST' };
    const role = (state.role || '').toUpperCase();

    return `
      <div id="app" class="mathena-app-wrapper">
        <!-- HEADER UTAMA -->
        <header class="app-header">
          <a href="#dashboard" class="app-brand">
            <img src="https://raw.githubusercontent.com/isramiraj1443-ship-it/MATHENA/main/icon1%20(1).png" alt="Mathena Logo" class="app-brand-logo" />
            <div>
              <span class="app-brand-title">MATHENA</span>
              <span class="app-brand-tagline">Kebijaksanaan dari Pengetahuan yang Utuh</span>
            </div>
          </a>

          <div style="display: flex; align-items: center; gap: 16px;">
            <!-- Status Jaringan PWA -->
            <span class="badge ${state.isOnline ? 'badge-teal' : 'badge-gold'}" style="font-size: 0.75rem;">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${state.isOnline ? 'var(--teal-primary)' : 'var(--gold-celestial)'}; margin-right:5px;"></span>
              ${state.isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>

            <!-- User Pill -->
            <div style="display: flex; align-items: center; gap: 10px; padding: 4px 12px; background: rgba(255,255,255,0.05); border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
              <div style="text-align: right;">
                <div style="font-weight: 600; font-size: 0.88rem; color: var(--white-crisp);">${this.escapeHtml(user.fullName || user.name || user.username || 'Pengguna')}</div>
                <div style="font-size: 0.72rem; color: var(--white-muted); text-transform: uppercase;">${role}</div>
              </div>
              <button id="btn-logout" class="btn btn-secondary btn-sm" title="Keluar dari sistem" style="padding: 4px 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            </div>
          </div>
        </header>

        <div class="app-body">
          <!-- SIDEBAR DESKTOP -->
          <aside class="app-sidebar">
            ${this.renderSidebarMenu(role, activeRoute)}
          </aside>

          <!-- MAIN CONTENT VIEWPORT -->
          <main id="app-main-viewport" class="app-main">
            ${contentHtml}
          </main>
        </div>

        <!-- MOBILE BOTTOM NAVIGATION -->
        <nav class="mobile-bottom-nav">
          ${this.renderMobileNavItems(role, activeRoute)}
        </nav>

        <!-- TOAST CONTAINER -->
        <div id="toast-container" style="position: fixed; bottom: 80px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;"></div>
      </div>
    `;
  },

  renderSidebarMenu(role, activeRoute) {
    const isAdminOrGuru = role === 'ADMIN' || role === 'GURU' || role === 'ADMIN_GURU';
    const isProctor = role === 'PROCTOR' || role === 'PENGAWAS';

    if (isAdminOrGuru) {
      return `
        <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--white-muted); padding: 8px 14px 4px; font-weight: 700;">Akademik & Utama</div>
        <a href="#dashboard" class="nav-item ${activeRoute === '#dashboard' ? 'active' : ''}">
          <span class="nav-icon">📊</span> Dashboard Utama
        </a>
        <a href="#students" class="nav-item ${activeRoute === '#students' ? 'active' : ''}">
          <span class="nav-icon">👥</span> Data Siswa & Kelas
        </a>
        <a href="#learning" class="nav-item ${activeRoute === '#learning' ? 'active' : ''}">
          <span class="nav-icon">📚</span> Materi & Bahan Ajar
        </a>
        <a href="#assignments" class="nav-item ${activeRoute === '#assignments' ? 'active' : ''}">
          <span class="nav-icon">📝</span> Penugasan & Koreksi
        </a>
        <a href="#assessment" class="nav-item ${activeRoute === '#assessment' ? 'active' : ''}">
          <span class="nav-icon">📈</span> Penilaian & Rekap Nilai
        </a>
        <a href="#qa" class="nav-item ${activeRoute === '#qa' ? 'active' : ''}">
          <span class="nav-icon">💬</span> Tanya Jawab (QA)
        </a>
        <a href="#journal" class="nav-item ${activeRoute === '#journal' ? 'active' : ''}">
          <span class="nav-icon">📖</span> Jurnal KBM Guru
        </a>

        <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--white-muted); padding: 14px 14px 4px; font-weight: 700;">Ujian & Evaluasi</div>
        <a href="#cbt" class="nav-item ${activeRoute === '#cbt' ? 'active' : ''}">
          <span class="nav-icon">💻</span> Exam Room
        </a>

        <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--gold-celestial); padding: 14px 14px 4px; font-weight: 700;">Kecerdasan Buatan</div>
        <a href="#ai" class="nav-item ${activeRoute === '#ai' ? 'active' : ''}" style="border-left: 2px solid var(--gold-celestial);">
          <span class="nav-icon">✨</span> Mathena AI Copilot
        </a>

        <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--white-muted); padding: 14px 14px 4px; font-weight: 700;">Administrasi & Info</div>
        <a href="#reports" class="nav-item ${activeRoute === '#reports' ? 'active' : ''}">
          <span class="nav-icon">📑</span> Rekap & Laporan
        </a>
        <a href="#developer" class="nav-item ${activeRoute === '#developer' ? 'active' : ''}" style="border-left: 2px solid var(--teal-primary);">
          <span class="nav-icon">👨‍🏫</span> Profil Developer
        </a>
      `;
    }

    if (isProctor) {
      return `
        <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--white-muted); padding: 8px 14px 4px; font-weight: 700;">Pengawasan Ujian</div>
        <a href="#proctor" class="nav-item ${activeRoute === '#proctor' ? 'active' : ''}">
          <span class="nav-icon">🛡️</span> Monitoring Exam Room
        </a>
        <a href="#developer" class="nav-item ${activeRoute === '#developer' ? 'active' : ''}">
          <span class="nav-icon">👨‍🏫</span> Profil Developer
        </a>
      `;
    }

    // Default Siswa
    return `
      <a href="#dashboard" class="nav-item ${activeRoute === '#dashboard' ? 'active' : ''}">
        <span class="nav-icon">🏠</span> Beranda Siswa
      </a>
      <a href="#learning" class="nav-item ${activeRoute === '#learning' ? 'active' : ''}">
        <span class="nav-icon">📖</span> Materi Belajar
      </a>
      <a href="#assignments" class="nav-item ${activeRoute === '#assignments' ? 'active' : ''}">
        <span class="nav-icon">📋</span> Tugas Mandiri
      </a>
      <a href="#qa" class="nav-item ${activeRoute === '#qa' ? 'active' : ''}">
        <span class="nav-icon">💬</span> Tanya Guru
      </a>
      <a href="#cbt" class="nav-item ${activeRoute === '#cbt' ? 'active' : ''}">
        <span class="nav-icon">💻</span> Exam Room
      </a>
      <a href="#developer" class="nav-item ${activeRoute === '#developer' ? 'active' : ''}">
        <span class="nav-icon">👨‍🏫</span> Profil Developer
      </a>
    `;
  },

  renderMobileNavItems(role, activeRoute) {
    return `
      <a href="#dashboard" class="mobile-nav-link ${activeRoute === '#dashboard' ? 'active' : ''}">
        <span class="icon">🏠</span>
        <span>Beranda</span>
      </a>
      <a href="#learning" class="mobile-nav-link ${activeRoute === '#learning' ? 'active' : ''}">
        <span class="icon">📚</span>
        <span>Materi</span>
      </a>
      <a href="#assignments" class="mobile-nav-link ${activeRoute === '#assignments' ? 'active' : ''}">
        <span class="icon">📝</span>
        <span>Tugas</span>
      </a>
      <a href="#cbt" class="mobile-nav-link ${activeRoute === '#cbt' ? 'active' : ''}">
        <span class="icon">💻</span>
        <span>Ujian</span>
      </a>
      <a href="#developer" class="mobile-nav-link ${activeRoute === '#developer' ? 'active' : ''}">
        <span class="icon">👨‍🏫</span>
        <span>Developer</span>
      </a>
    `;
  },

  bindShellEvents() {
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', async (e) => {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin keluar dari sistem Mathena?')) {
          await api.logout();
          store.clearAuth();
          window.location.hash = '#login';
        }
      });
    }

    store.subscribe((state) => {
      this.renderToasts(state.toasts);
    });

    this.renderMathFormulas();
  },

  renderToasts(toasts) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    container.innerHTML = toasts.map(t => {
      let bg = 'var(--bg-obsidian-light)';
      let border = 'var(--teal-primary)';
      if (t.type === 'error') { bg = 'rgba(239,68,68,0.95)'; border = '#dc2626'; }
      if (t.type === 'warning') { bg = 'rgba(245,158,11,0.95)'; border = '#d97706'; }
      if (t.type === 'success') { bg = 'rgba(20,184,166,0.95)'; border = '#0d9488'; }

      return `
        <div style="background: ${bg}; border-left: 4px solid ${border}; color: var(--white-crisp); padding: 12px 18px; border-radius: var(--radius-sm); box-shadow: 0 8px 24px rgba(0,0,0,0.5); font-size: 0.9rem; pointer-events: auto; min-width: 260px; max-width: 380px; backdrop-filter: blur(8px);">
          ${this.escapeHtml(t.message)}
        </div>
      `;
    }).join('');
  },

  renderMathFormulas(targetElement = document.body) {
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(targetElement, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
          ],
          ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
          throwOnError: false
        });
      } catch (err) {
        console.warn('[KaTeX Rendering Warning]:', err);
      }
    }
  },

  renderMathToolbar(targetTextareaId) {
    const symbols = [
      { label: '√x', latex: '\\sqrt{x}' },
      { label: 'a/b', latex: '\\frac{a}{b}' },
      { label: 'x²', latex: 'x^{2}' },
      { label: 'xₙ', latex: 'x_{n}' },
      { label: '±', latex: '\\pm' },
      { label: '×', latex: '\\times' },
      { label: '÷', latex: '\\div' },
      { label: 'π', latex: '\\pi' },
      { label: 'θ', latex: '\\theta' },
      { label: 'α', latex: '\\alpha' },
      { label: 'β', latex: '\\beta' },
      { label: '≤', latex: '\\le' },
      { label: '≥', latex: '\\ge' },
      { label: '≠', latex: '\\neq' },
      { label: '°', latex: '^\\circ' },
      { label: '△', latex: '\\triangle' },
      { label: '∠', latex: '\\angle' },
      { label: '∑', latex: '\\sum_{i=1}^{n}' },
      { label: '∫', latex: '\\int' },
      { label: '∞', latex: '\\infty' }
    ];

    return `
      <div class="math-symbol-toolbar">
        <span style="font-size: 0.72rem; color: var(--gold-celestial); font-weight:700; align-self:center; margin-right:4px;">∑ FORMULA:</span>
        ${symbols.map(s => `
          <button type="button" class="math-toolbar-btn" data-latex="${s.latex}" data-target="${targetTextareaId}">${s.label}</button>
        `).join('')}
      </div>
    `;
  },

  bindMathToolbarEvents() {
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
  },

  escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};
