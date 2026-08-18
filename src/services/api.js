// ==================== FILE: src/services/api.js ====================
/**
 * MATHENA API CLIENT SERVICE
 * Menghubungkan seluruh modul Mathena & CBT ke Google Apps Script backend.
 */

const API_CONFIG = {
  BASE_URL: 'https://script.google.com/macros/s/AKfycbz6GS0FB3Nubhqn1No8D5SFxmaaeq78PqeHuLjx4Xx_xZYmY_vK7ps6CCRvDQT2b-17jw/exec',
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
    const raw = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER_PROFILE);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
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
        throw new Error('Sesi telah berakhir. Silakan login kembali.');
      }
      return result;
    } catch (error) {
      console.error(`[API Error] [${action}]:`, error);
      throw error;
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
    try { await this.request('auth_logout', {}); }
    finally { this.clearSession(); window.location.hash = '#login'; }
  }

  // --- CBT EXAMS ---
  async getExams() {
    return await this.request('cbt_get_exams', {});
  }

  async saveExam(examData) {
    return await this.request('cbt_save_exam', { examData });
  }

  async deleteExam(examId) {
    return await this.request('cbt_delete_exam', { examId });
  }

  async getQuestions(examId) {
    return await this.request('cbt_get_questions', { examId });
  }

  async saveQuestion(questionData) {
    return await this.request('cbt_save_question', { questionData });
  }

  async importQuestions(examId, questions) {
    return await this.request('cbt_import_questions', { examId, questions });
  }

  async getMonitoringData() {
    return await this.request('cbt_get_monitoring', {});
  }

  async unlockStudent(responseId) {
    return await this.request('cbt_unlock_student', { responseId });
  }

  async resetStudent(responseId) {
    return await this.request('cbt_reset_student', { responseId });
  }

  // --- JURNAL KBM ---
  async saveLearningJournal(journalData) {
    return await this.request('save_learning_journal', { journalData });
  }

  // --- MATHENA AI ---
  async callMathenaAI(moduleType, params) {
    return await this.request('ai_generate', { moduleType, inputPayload: params });
  }
}

export const api = new ApiService();
