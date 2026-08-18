// ==================== FILE: src/main.js ====================
import { router, ViewRegistry } from './router/router.js';
import { store } from './store/state.js';

import { AdminDashboardView } from './views/admin/dashboard.js';
import { AdminStudentsView } from './views/admin/students.js';
import { AdminMaterialsView } from './views/admin/materials.js';
import { AdminAssignmentsView } from './views/admin/assignments.js';
import { AdminAssessmentsView } from './views/admin/assessments.js';
import { AdminAiCopilotView } from './views/admin/ai_copilot.js';
import { AdminJournalsView } from './views/admin/journals.js';
import { AdminReportsView } from './views/admin/reports.js';

import { StudentDashboardView } from './views/student/dashboard.js';
import { QAChatView } from './views/qa/qa_chat.js';
import { CBTExamRoomView } from './views/cbt/exam_room.js';
import { ProctorMonitoringView } from './views/proctor/monitoring.js';

function configureViewRegistry() {
  const role = (store.getState().role || '').toUpperCase();
  const isStudent = role === 'STUDENT' || role === 'SISWA';
  const isProctor = role === 'PROCTOR' || role === 'PENGAWAS';

  if (isStudent) {
    ViewRegistry.dashboard = StudentDashboardView;
  } else if (isProctor) {
    ViewRegistry.dashboard = ProctorMonitoringView;
  } else {
    ViewRegistry.dashboard = AdminDashboardView;
  }

  ViewRegistry.students = AdminStudentsView;
  ViewRegistry.learning = AdminMaterialsView;
  ViewRegistry.assignments = AdminAssignmentsView;
  ViewRegistry.assessment = AdminAssessmentsView;
  ViewRegistry.qa = QAChatView;
  ViewRegistry.cbt = CBTExamRoomView;
  ViewRegistry.ai = AdminAiCopilotView;
  ViewRegistry.journal = AdminJournalsView;
  ViewRegistry.reports = AdminReportsView;
  ViewRegistry.proctor = ProctorMonitoringView;
}

configureViewRegistry();
store.subscribe(configureViewRegistry);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.warn(err));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  router.init();
});
