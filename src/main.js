/**
 * MATHENA APPLICATION BOOTSTRAPPER (ENTRY POINT)
 * Mengintegrasikan seluruh router, state store, PWA service worker,
 * serta menghubungkan seluruh modul views (Admin, Guru, Siswa, CBT, dan Proctor).
 */

import { router, ViewRegistry } from './router/router.js';
import { store } from './store/state.js';

// Import Modul Admin / Guru
import { AdminDashboardView } from './views/admin/dashboard.js';
import { AdminMaterialsView } from './views/admin/materials.js';
import { AdminAssignmentsView } from './views/admin/assignments.js';
import { AdminAssessmentsView } from './views/admin/assessments.js';
import { AdminAiCopilotView } from './views/admin/ai_copilot.js';
import { AdminJournalsView } from './views/admin/journals.js';
import { AdminReportsView } from './views/admin/reports.js';

// Import Modul Siswa, QA, CBT Engine & Pengawas
import { StudentDashboardView } from './views/student/dashboard.js';
import { QAChatView } from './views/qa/qa_chat.js';
import { CBTExamRoomView } from './views/cbt/exam_room.js';
import { ProctorMonitoringView } from './views/proctor/monitoring.js';

/**
 * Registrasi View Dinamis Berdasarkan Peran Pengguna Aktif
 */
function configureViewRegistry() {
  const role = (store.getState().role || '').toUpperCase();
  const isStudent = role === 'STUDENT' || role === 'SISWA';
  const isProctor = role === 'PROCTOR' || role === 'PENGAWAS';

  // Dashboard Router Switch
  if (isStudent) {
    ViewRegistry.dashboard = StudentDashboardView;
  } else if (isProctor) {
    ViewRegistry.dashboard = ProctorMonitoringView;
  } else {
    ViewRegistry.dashboard = AdminDashboardView;
  }

  // Modul Pembelajaran & Penugasan
  ViewRegistry.learning = AdminMaterialsView;
  ViewRegistry.assignments = AdminAssignmentsView;
  ViewRegistry.assessment = AdminAssessmentsView;

  // Modul Tanya Jawab & CBT
  ViewRegistry.qa = QAChatView;
  ViewRegistry.cbt = CBTExamRoomView;

  // Modul Khusus Guru (PRD Strict Compliance)
  ViewRegistry.ai = AdminAiCopilotView;
  ViewRegistry.journal = AdminJournalsView;
  ViewRegistry.reports = AdminReportsView;

  // Modul Pengawas
  ViewRegistry.proctor = ProctorMonitoringView;
}

// Inisialisasi awal registrasi
configureViewRegistry();

// Subscribe router bila terjadi perubahan auth/role
store.subscribe(() => {
  configureViewRegistry();
});

// Registrasi Service Worker PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('[Mathena PWA] Service Worker aktif:', reg.scope))
      .catch((err) => console.warn('[Mathena PWA] Registrasi SW gagal:', err));
  });
}

// Jalankan SPA Router
document.addEventListener('DOMContentLoaded', () => {
  router.init();
});
