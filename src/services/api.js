/**
 * MATHENA API CLIENT SERVICE
 * Mengelola komunikasi frontend dengan Google Apps Script Web App Endpoint.
 * Mendukung Auth, Token Management, Academic, Assessment (Diagnostic, Formative 1-5, Attitude, Attendance),
 * QA Chat, EXAM CBT Engine, Mathena AI Copilot, Files, Reports, dan Audit Logging.
 */

const API_CONFIG = {
  BASE_URL: 'saya mendapatkan link_url deploy baru https://script.google.com/macros/s/AKfycbxDvutT33F7mkvwSAJj9YZ9oWaEdGZ-1SAc5pkWLEC9qSwCTBqlVOAiXY4WHUEs1ffuvw/exec
harus saya copy kemana?',
  STORAGE_KEYS: {
    AUTH_TOKEN: 'mathena_auth_token',
    USER_ROLE: 'mathena_user_role',
    USER_PROFILE: 'mathena_user_profile',
    CBT_LOCAL_DRAFT: 'mathena_cbt_answers_'
  }
};

class ApiService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Helper internal untuk mengambil Session Token
   */
  getToken() {
    return localStorage.getItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN) || '';
  }

  /**
   * Helper internal untuk mengambil Profile pengguna aktif
   */
  getCurrentUser() {
    const raw = localStorage.getItem(API_CONFIG.STORAGE_KEYS.USER_PROFILE);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /**
   * Central Core Request Handler untuk Google Apps Script
   */
  async request(action, payload = {}) {
    const token = this.getToken();
    const requestData = {
      action: action,
      token: token,
      timestamp: new Date().toISOString(),
      payload: payload
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' // Menghindari pre-flight OPTIONS issue pada Google Apps Script
        },
        body: JSON.stringify(requestData),
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();

      // Tangani unauthenticated/expired token
      if (result.status === 401 || result.message === 'UNAUTHORIZED') {
        this.clearSession();
        window.location.hash = '#login';
        throw new Error('Sesi telah berakhir. Silakan login kembali.');
      }

      return result;
    } catch (error) {
      console.error(`[Mathena API Error] [Action: ${action}]:`, error);
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

  // ==========================================
  // DOMAIN: AUTH & IDENTITY
  // ==========================================

  async login(username, password) {
    const response = await this.request('auth_login', { username, password });
    if (response.success && response.data) {
      this.saveSession(response.data.token, response.data.role, response.data.user);
    }
    return response;
  }

  async logout() {
    try {
      await this.request('auth_logout', {});
    } finally {
      this.clearSession();
      window.location.hash = '#login';
    }
  }

  async getProfile() {
    return await this.request('get_user_profile', {});
  }

  // ==========================================
  // DOMAIN: ACADEMIC & STUDENTS
  // ==========================================

  async getAcademicYears() {
    return await this.request('get_academic_years', {});
  }

  async getClasses(academicYearId = '') {
    return await this.request('get_classes', { academic_year_id: academicYearId });
  }

  async getStudents(classId = '') {
    return await this.request('get_students', { class_id: classId });
  }

  async getStudentDetail(studentId) {
    return await this.request('get_student_detail', { student_id: studentId });
  }

  // ==========================================
  // DOMAIN: LEARNING & MATERIALS & ASSIGNMENTS
  // ==========================================

  async getMaterials(classId = '') {
    return await this.request('get_materials', { class_id: classId });
  }

  async saveMaterial(materialData) {
    return await this.request('save_material', materialData);
  }

  async getAssignments(classId = '') {
    return await this.request('get_assignments', { class_id: classId });
  }

  async createAssignment(assignmentData) {
    return await this.request('create_assignment', assignmentData);
  }

  async submitAssignment(submissionData) {
    return await this.request('submit_assignment', submissionData);
  }

  async gradeAssignment(submissionId, gradeData) {
    return await this.request('grade_assignment', {
      submission_id: submissionId,
      ...gradeData
    });
  }

  // ==========================================
  // DOMAIN: ASSESSMENT (DIAGNOSTIC, F1-F5, ATTITUDE, ATTENDANCE)
  // ==========================================

  async getDiagnosticAssessments(classId = '') {
    return await this.request('get_diagnostic_assessments', { class_id: classId });
  }

  async saveDiagnosticResult(resultData) {
    return await this.request('save_diagnostic_result', resultData);
  }

  /**
   * Mengambil penilaian Formatif (Dibatasi 1-5 sesuai PRD)
   */
  async getFormativeAssessments(classId = '') {
    return await this.request('get_formative_assessments', { class_id: classId });
  }

  /**
   * Menyimpan hasil formatif. Melakukan validasi client side F1 - F5.
   */
  async saveFormativeResult(formatNumber, resultData) {
    const fNum = parseInt(formatNumber, 10);
    if (isNaN(fNum) || fNum < 1 || fNum > 5) {
      throw new Error('Sesuai aturan PRD, formatif hanya diizinkan antara Formatif 1 hingga Formatif 5.');
    }
    return await this.request('save_formative_result', {
      formative_number: fNum,
      ...resultData
    });
  }

  async getAttitudeAssessments(classId = '') {
    return await this.request('get_attitude_assessments', { class_id: classId });
  }

  async saveAttitudeAssessment(data) {
    return await this.request('save_attitude_assessment', data);
  }

  async getAttendance(classId = '', date = '') {
    return await this.request('get_attendance', { class_id: classId, date: date });
  }

  async saveAttendance(attendanceList) {
    return await this.request('save_attendance', { records: attendanceList });
  }

  async getAssessmentSummary(classId = '', studentId = '') {
    return await this.request('get_assessment_summary', {
      class_id: classId,
      student_id: studentId
    });
  }

  // ==========================================
  // DOMAIN: QA THREADS & CHAT
  // ==========================================

  async getQAThreads(filter = {}) {
    return await this.request('get_qa_threads', filter);
  }

  async getQAMessages(threadId) {
    return await this.request('get_qa_messages', { thread_id: threadId });
  }

  async createQAThread(data) {
    return await this.request('create_qa_thread', data);
  }

  async sendQAMessage(threadId, message, fileId = '') {
    return await this.request('send_qa_message', {
      thread_id: threadId,
      message_text: message,
      file_id: fileId
    });
  }

  async updateQAStatus(threadId, status) {
    return await this.request('update_qa_status', {
      thread_id: threadId,
      status: status // 'OPEN' | 'ANSWERED' | 'CLOSED'
    });
  }

  // ==========================================
  // DOMAIN: EXAM CBT ENGINE
  // ==========================================

  async getServerTime() {
    return await this.request('cbt_get_server_time', {});
  }

  async getQuestionBanks() {
    return await this.request('cbt_get_question_banks', {});
  }

  async importQuestions(bankId, questionsArray) {
    return await this.request('cbt_import_questions', {
      bank_id: bankId,
      questions: questionsArray
    });
  }

  async getExams(classId = '') {
    return await this.request('cbt_get_exams', { class_id: classId });
  }

  async createExam(examConfig) {
    return await this.request('cbt_create_exam', examConfig);
  }

  async getExamSessions(examId) {
    return await this.request('cbt_get_sessions', { exam_id: examId });
  }

  async startExamAttempt(examId, sessionId) {
    return await this.request('cbt_start_attempt', {
      exam_id: examId,
      session_id: sessionId
    });
  }

  async autosaveExamAnswer(attemptId, questionId, studentAnswer) {
    // Simpan local fallback terlebih dahulu
    const cacheKey = `${API_CONFIG.STORAGE_KEYS.CBT_LOCAL_DRAFT}${attemptId}`;
    let currentCache = {};
    try {
      currentCache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    } catch {
      currentCache = {};
    }
    currentCache[questionId] = {
      answer: studentAnswer,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(cacheKey, JSON.stringify(currentCache));

    // Kirim sinkronisasi ke server
    return await this.request('cbt_autosave_answer', {
      attempt_id: attemptId,
      question_id: questionId,
      student_answer: studentAnswer
    });
  }

  async submitExamAttempt(attemptId) {
    const response = await this.request('cbt_submit_attempt', { attempt_id: attemptId });
    // Bersihkan draft cache lokal setelah sukses submit
    localStorage.removeItem(`${API_CONFIG.STORAGE_KEYS.CBT_LOCAL_DRAFT}${attemptId}`);
    return response;
  }

  async getProctorMonitoring(sessionId) {
    return await this.request('cbt_proctor_monitoring', { session_id: sessionId });
  }

  async recordExamIncident(incidentData) {
    return await this.request('cbt_record_incident', incidentData);
  }

  // ==========================================
  // DOMAIN: MATHENA AI (ADMIN & GURU ONLY)
  // ==========================================

  async callMathenaAI(aiModule, parameters) {
    const currentUser = this.getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'GURU')) {
      throw new Error('Akses Ditolak: Fitur Mathena AI hanya dapat diakses oleh Admin dan Guru.');
    }

    return await this.request('ai_generate_content', {
      module: aiModule, // 'RPD' | 'LKPD' | 'Bahan Ajar' | 'Soal' | 'Media' | 'Analisis Kelas' | 'Jurnal' | 'Tanya Jawab Guru'
      params: parameters
    });
  }

  // ==========================================
  // DOMAIN: LEARNING JOURNALS
  // ==========================================

  async getLearningJournals(classId = '') {
    return await this.request('get_learning_journals', { class_id: classId });
  }

  async saveLearningJournal(journalData) {
    return await this.request('save_learning_journal', journalData);
  }

  // ==========================================
  // DOMAIN: FILES METADATA & REPORTS
  // ==========================================

  async uploadFileMetadata(fileMetadata) {
    return await this.request('save_file_metadata', fileMetadata);
  }

  async getReports(reportType, filters = {}) {
    return await this.request('get_report_data', {
      report_type: reportType,
      filters: filters
    });
  }
}

// Export singleton instance
export const api = new ApiService();
