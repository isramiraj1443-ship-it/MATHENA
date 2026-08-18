// ==================== FILE: src/router/router.js ====================
/**
 * MATHENA CLIENT-SIDE SPA ROUTER (V2.1.0)
 */

import { store } from '../store/state.js';
import { Layout } from '../components/layout.js';
import { LoginView } from '../views/login.js';

export const ViewRegistry = {
  dashboard: null,
  students: null,
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
      '#students': { roles: ['ADMIN', 'GURU', 'ADMIN_GURU'], view: () => ViewRegistry.students?.render(), init: () => ViewRegistry.students?.initEvents() },
      '#learning': { roles: ['ADMIN', 'GURU', 'ADMIN_GURU', 'STUDENT', 'SISWA'], view: () => ViewRegistry.learning?.render(), init: () => ViewRegistry.learning?.initEvents() },
      '#assignments': { roles: ['ADMIN', 'GURU', 'ADMIN_GURU', 'STUDENT', 'SISWA'], view: () => ViewRegistry.assignments?.render(), init: () => ViewRegistry.assignments?.initEvents() },
      '#assessment': { roles: ['ADMIN', 'GURU', 'ADMIN_GURU'], view: () => ViewRegistry.assessment?.render(), init: () => ViewRegistry.assessment?.initEvents() },
      '#qa': { roles: ['ADMIN', 'GURU', 'ADMIN_GURU', 'STUDENT', 'SISWA'], view: () => ViewRegistry.qa?.render(), init: () => ViewRegistry.qa?.initEvents() },
      '#cbt': { roles: ['ADMIN', 'GURU', 'ADMIN_GURU', 'STUDENT', 'SISWA', 'PROCTOR', 'PENGAWAS'], view: () => ViewRegistry.cbt?.render(), init: () => ViewRegistry.cbt?.initEvents() },
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
    const hash = rawHash.split('?')[0];
    const routeConfig = this.routes[hash];
    const state = store.getState();

    if (!routeConfig) {
      store.showToast('Halaman tidak ditemukan.', 'warning');
      window.location.hash = state.isAuthenticated ? '#dashboard' : '#login';
      return;
    }

    if (!routeConfig.public && !state.isAuthenticated) {
      window.location.hash = '#login';
      return;
    }

    if (routeConfig.public && state.isAuthenticated) {
      window.location.hash = state.role === 'PROCTOR' || state.role === 'PENGAWAS' ? '#proctor' : '#dashboard';
      return;
    }

    if (routeConfig.roles && routeConfig.roles.length > 0) {
      const userRole = (state.role || '').toUpperCase();
      if (!routeConfig.roles.includes(userRole)) {
        store.showToast(`Akses ditolak untuk peran [${userRole}].`, 'error');
        window.location.hash = userRole === 'PROCTOR' || userRole === 'PENGAWAS' ? '#proctor' : '#dashboard';
        return;
      }
    }

    this.renderCurrentView(hash, routeConfig);
  }

  renderCurrentView(hash, routeConfig) {
    if (hash === '#login') {
      this.appRoot.innerHTML = routeConfig.view();
      routeConfig.init();
    } else {
      const viewContent = routeConfig.view ? routeConfig.view() : '<div class="glass-panel" style="padding:20px;">Memuat modul...</div>';
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
