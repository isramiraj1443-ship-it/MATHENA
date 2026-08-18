/**
 * MATHENA CLIENT-SIDE SPA ROUTER
 * Mengelola transisi view, validasi session token, role guarding ketat
 * (termasuk isolasi total Mathena AI khusus Admin/Guru), dan render shell.
 */

import { store } from '../store/state.js';
import { Layout } from '../components/layout.js';
import { LoginView } from '../views/login.js';

// Route Handlers Placeholder Registry (Akan diisi oleh View Module pada Bagian 3 & 4)
export const ViewRegistry = {
  dashboard: null,
  learning: null,
  assignments: null,
  assessment: null,
  qa: null,
  cbt: null,
  ai: null,
  journal: null,
  reports: null,
  proctor: null
};

class Router {
  constructor() {
    this.appRoot = document.getElementById('app-root');
    this.routes = {
      '#login': { roles: [], public: true, view: () => LoginView.render(), init: () => LoginView.initEvents() },
      '#dashboard': { roles: ['ADMIN', 'GURU', 'ADMIN_GURU', 'STUDENT', 'SISWA'], view: () => ViewRegistry.dashboard?.render(), init: () => ViewRegistry.dashboard?.initEvents() },
      '#learning': { roles: ['ADMIN', 'GURU', 'ADMIN_GURU', 'STUDENT', 'SISWA'], view: () => ViewRegistry.learning?.render(), init: () => ViewRegistry.learning?.initEvents() },
      '#assignments': { roles: ['ADMIN', 'GURU', 'ADMIN_GURU', 'STUDENT', 'SISWA'], view: () => ViewRegistry.assignments?.render(), init: () => ViewRegistry.assignments?.initEvents() },
      '#assessment': { roles: ['ADMIN', 'GURU', 'ADMIN_GURU'], view: () => ViewRegistry.assessment?.render(), init: () => ViewRegistry.assessment?.initEvents() },
      '#qa': { roles: ['ADMIN', 'GURU', 'ADMIN_GURU', 'STUDENT', 'SISWA'], view: () => ViewRegistry.qa?.render(), init: () => ViewRegistry.qa?.initEvents() },
      '#cbt': { roles: ['ADMIN', 'GURU', 'ADMIN_GURU', 'STUDENT', 'SISWA', 'PROCTOR', 'PENGAWAS'], view: () => ViewRegistry.cbt?.render(), init: () => ViewRegistry.cbt?.initEvents() },
      // AI STRICT ACCESS: HANYA ADMIN & GURU SESUAI PRD FR-13 & NON-GOALS
      '#ai': { roles: ['ADMIN', 'GURU', 'ADMIN_GURU'], view: () => ViewRegistry.ai?.render(), init: () => ViewRegistry.ai?.initEvents() },
      '#journal': { roles: ['ADMIN', 'GURU', 'ADMIN_GURU'], view: () => ViewRegistry.journal?.render(), init: () => ViewRegistry.journal?.initEvents() },
      '#reports': { roles: ['ADMIN', 'GURU', 'ADMIN_GURU'], view: () => ViewRegistry.reports?.render(), init: () => ViewRegistry.reports?.initEvents() },
      '#proctor': { roles: ['PROCTOR', 'PENGAWAS', 'ADMIN', 'GURU', 'ADMIN_GURU'], view: () => ViewRegistry.proctor?.render(), init: () => ViewRegistry.proctor?.initEvents() }
    };

    window.addEventListener('hashchange', () => this.handleRoute());
  }

  init() {
    if (!window.location.hash) {
      window.location.hash = store.getState().isAuthenticated ? '#dashboard' : '#login';
    } else {
      this.handleRoute();
    }
  }

  handleRoute() {
    const rawHash = window.location.hash || '#login';
    const hash = rawHash.split('?')[0]; // Pisahkan query parameters jika ada
    const routeConfig = this.routes[hash];
    const state = store.getState();

    // 1. Validasi Endpoint Tidak Dikenal -> Redirect
    if (!routeConfig) {
      store.showToast('Halaman yang diminta tidak ditemukan.', 'warning');
      window.location.hash = state.isAuthenticated ? '#dashboard' : '#login';
      return;
    }

    // 2. Proteksi Autentikasi
    if (!routeConfig.public && !state.isAuthenticated) {
      store.showToast('Silakan login terlebih dahulu untuk melanjutkan.', 'warning');
      window.location.hash = '#login';
      return;
    }

    // 3. Jika sudah login dan membuka #login -> lempar ke dashboard
    if (routeConfig.public && state.isAuthenticated) {
      window.location.hash = state.role === 'PROCTOR' || state.role === 'PENGAWAS' ? '#proctor' : '#dashboard';
      return;
    }

    // 4. Role-Based Access Guarding Ketat
    if (routeConfig.roles && routeConfig.roles.length > 0) {
      const userRole = (state.role || '').toUpperCase();
      if (!routeConfig.roles.includes(userRole)) {
        store.showToast(`Akses Ditolak: Peran [${userRole}] tidak diizinkan membuka modul ini.`, 'error');
        window.location.hash = userRole === 'PROCTOR' || userRole === 'PENGAWAS' ? '#proctor' : '#dashboard';
        return;
      }
    }

    // 5. Render Layout & View
    this.renderCurrentView(hash, routeConfig);
  }

  renderCurrentView(hash, routeConfig) {
    if (hash === '#login') {
      this.appRoot.innerHTML = routeConfig.view();
      routeConfig.init();
    } else {
      const viewContent = routeConfig.view ? (routeConfig.view() || '<div class="glass-panel" style="padding:20px;">Memuat modul...</div>') : '<div class="glass-panel" style="padding:20px;">Modul sedang dipersiapkan...</div>';
      this.appRoot.innerHTML = Layout.renderAppShell(viewContent, hash);
      Layout.bindShellEvents();
      if (routeConfig.init) {
        routeConfig.init();
      }
      Layout.renderMathFormulas(document.getElementById('app-main-viewport'));
    }
  }
}

export const router = new Router();
