/**
 * MATHENA STATE MANAGEMENT SYSTEM
 * Mengelola state global aplikasi: Auth, User Profile, Role, Active Class,
 * Online/Offline status, Toast Notifications, dan reaktivitas subscriber.
 */

class Store {
  constructor() {
    this.state = {
      isAuthenticated: false,
      token: localStorage.getItem('mathena_auth_token') || null,
      role: localStorage.getItem('mathena_user_role') || null, // 'ADMIN' | 'GURU' | 'STUDENT' | 'PROCTOR'
      user: this.getStoredUser(),
      selectedClassId: localStorage.getItem('mathena_selected_class') || '',
      selectedAcademicYearId: localStorage.getItem('mathena_selected_year') || '',
      isOnline: navigator.onLine,
      toasts: []
    };

    if (this.state.token && this.state.user) {
      this.state.isAuthenticated = true;
    }

    this.listeners = [];
    this.initNetworkListeners();
  }

  getStoredUser() {
    try {
      const raw = localStorage.getItem('mathena_user_profile');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  initNetworkListeners() {
    window.addEventListener('online', () => {
      this.setState({ isOnline: true });
      this.showToast('Koneksi internet kembali terhubung.', 'success');
    });

    window.addEventListener('offline', () => {
      this.setState({ isOnline: false });
      this.showToast('Koneksi internet terputus. Mode offline aktif.', 'warning');
    });
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  // Action Helpers
  setAuth(token, role, user) {
    localStorage.setItem('mathena_auth_token', token);
    localStorage.setItem('mathena_user_role', role);
    localStorage.setItem('mathena_user_profile', JSON.stringify(user));

    this.setState({
      isAuthenticated: true,
      token,
      role: role.toUpperCase(),
      user
    });
  }

  clearAuth() {
    localStorage.removeItem('mathena_auth_token');
    localStorage.removeItem('mathena_user_role');
    localStorage.removeItem('mathena_user_profile');
    localStorage.removeItem('mathena_selected_class');
    localStorage.removeItem('mathena_selected_year');

    this.setState({
      isAuthenticated: false,
      token: null,
      role: null,
      user: null,
      selectedClassId: '',
      selectedAcademicYearId: ''
    });
  }

  setSelectedClass(classId) {
    localStorage.setItem('mathena_selected_class', classId);
    this.setState({ selectedClassId: classId });
  }

  setSelectedAcademicYear(yearId) {
    localStorage.setItem('mathena_selected_year', yearId);
    this.setState({ selectedAcademicYearId: yearId });
  }

  showToast(message, type = 'info', duration = 3500) {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    const toast = { id, message, type };
    this.setState({ toasts: [...this.state.toasts, toast] });

    setTimeout(() => {
      this.removeToast(id);
    }, duration);
  }

  removeToast(id) {
    this.setState({
      toasts: this.state.toasts.filter(t => t.id !== id)
    });
  }
}

export const store = new Store();
