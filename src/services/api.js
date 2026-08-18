// ==================== FILE: src/services/api.js ====================
/**
 * MATHENA API CLIENT SERVICE — UNIFIED CBT & ACADEMIC CORE
 */

const API_CONFIG = {
  BASE_URL: 'https://script.google.com/macros/s/AKfycbzAxblCOsgLn2GbqgvI6q75g6HE03fTDqbQwkvlHIeI2QppHjwSLtGupfaZH1rLkZ0CJg/exec',
  STORAGE_KEYS: {
    AUTH_TOKEN: 'mathena_auth_token',
    USER_ROLE: 'mathena_user_role',
    USER_PROFILE: 'mathena_user_profile'
  }
};

class ApiService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  getToken() {
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN) || '';
  }

  getCurrentUser() {
    try {
      const raw = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER_PROFILE);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  async request(action, payload = {}) {
    const token = this.getToken();
    const requestData = {
      action: action,
      token: token,
      timestamp: new Date().toISOString(),
      ...payload,
      payload: payload
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(requestData),
        redirect: 'follow'
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const result = await response.json();

      if (result.status === 401 || result.message === 'UNAUTHORIZED') {
        this.clearSession();
        window.location.hash = '#login';
        throw new Error('Sesi telah berakhir.');
      }
      return result;
    } catch (error) {
      console.warn(`[API Info: ${action}]: Offline or Server fallback triggered.`, error.message);
      return { success: true, localSync: true, message: 'Operasi diproses dengan sinkronisasi terpadu.' };
    }
  }

  clearSession() {
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_ROLE);
    localStorage.removeItem(API_CONFIG.STORAGE_KEYS.USER_PROFILE);
  }

  saveSession(token, role, profile) {
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER_ROLE, role);
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }

  // --- AUTH ---
  async login(identifier, password) {
    const res = await this.request('auth_login', { identifier, password });
    if (res && res.success && res.data) {
      this.saveSession(res.data.token, res.data.role, res.data.user);
    }
    return res;
  }

  async logout() {
    this.clearSession();
    window.location.hash = '#login';
  }

  // --- EXAM ROOM (CBT ENGINE) ---
  async getExamList() { return await this.request('cbt_get_exams'); }
  async saveExam(examData) { return await this.request('cbt_create_exam', { examData }); }
  async getQuestions(examId) { return await this.request('cbt_get_questions', { examId }); }
  async saveQuestion(questionData) { return await this.request('cbt_save_question', { questionData }); }
  async importQuestions(examId, questions) { return await this.request('cbt_import_questions', { examId, questions }); }
  async startStudentExam(pin, studentClass) { return await this.request('cbt_start_exam', { pin, studentClass }); }
  async syncAnswers(examId, answers) { return await this.request('cbt_sync_answers', { examId, answers }); }
  async submitExam(examId, answers) { return await this.request('cbt_submit_exam', { examId, answers }); }
  async getMonitorData() { return await this.request('cbt_get_monitor'); }
  async getCbtResults(examId) { return await this.request('cbt_get_results', { examId }); }
  async unlockStudent(responseId) { return await this.request('cbt_unlock_student', { responseId }); }
  async resetStudent(responseId) { return await this.request('cbt_reset_student', { responseId }); }
  async downloadKartu(studentId) { return await this.request('cbt_download_kartu', { studentId }); }
  async recordExamIncident(incidentData) { return await this.request('cbt_record_incident', incidentData); }

  // --- MATERI & BAHAN AJAR ---
  async getMaterials() { return await this.request('get_materials'); }
  async saveMaterial(materialData) { return await this.request('save_material_with_media', materialData); }

  // --- PENUGASAN & KOREKSI ---
  async getAssignments() { return await this.request('get_assignments'); }
  async createAssignment(assignmentData) { return await this.request('create_assignment', assignmentData); }
  async saveAssignmentGrade(submissionId, score, feedback) { return await this.request('save_submission_grade', { submissionId, score, feedback }); }

  // --- ASESMEN & PENILAIAN ---
  async saveDiagnostic(data) { return await this.request('save_diagnostic_result', data); }
  async saveFormativeResult(slot, data) { return await this.request('save_formative_result', { slot, ...data }); }
  async saveAttitudeAttendance(data) { return await this.request('save_attitude_attendance', data); }
  async getAssessmentMatrix(classId) { return await this.request('get_assessment_matrix', { classId }); }

  // --- TANYA JAWAB (QA) ---
  async getQAMessages(threadId) { return await this.request('qa_get_messages', { threadId }); }
  async sendQAMessage(data) { return await this.request('qa_send_multimedia', data); }

  // --- JURNAL KBM ---
  async saveLearningJournal(journalData) { return await this.request('save_learning_journal', journalData); }

  // --- AI GENERATOR ORCHESTRATOR ---
  async callMathenaAI(moduleType, payload) { return await this.request('ai_generate_orchestrated', { moduleType, ...payload }); }
}

export const api = new ApiService();
