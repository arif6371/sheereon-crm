const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return this.handleResponse(response);
  }

  async register(userData: any) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async verifyEmail(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return this.handleResponse(response);
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Notice endpoints
  async getNotices(params?: { targetAudience?: string }) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/notices${queryString}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createNotice(noticeData: any) {
    const response = await fetch(`${API_BASE_URL}/notices`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(noticeData)
    });
    return this.handleResponse(response);
  }

  async markNoticeAsRead(noticeId: string) {
    const response = await fetch(`${API_BASE_URL}/notices/${noticeId}/read`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Meeting/Event endpoints
  async getEvents(params?: { date?: string; type?: string; status?: string }) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/meetings${queryString}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createEvent(eventData: any) {
    const response = await fetch(`${API_BASE_URL}/meetings`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(eventData)
    });
    return this.handleResponse(response);
  }

  async updateEventStatus(eventId: string, status: string) {
    const response = await fetch(`${API_BASE_URL}/meetings/${eventId}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return this.handleResponse(response);
  }

  // Lead endpoints
  async getLeads(params?: { status?: string; priority?: string; search?: string }) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/leads${queryString}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createLead(leadData: any) {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(leadData)
    });
    return this.handleResponse(response);
  }

  async updateLeadStatus(leadId: string, status: string, reason?: string) {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status, reason })
    });
    return this.handleResponse(response);
  }

  async updateLead(leadId: string, leadData: any) {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(leadData)
    });
    return this.handleResponse(response);
  }

  async assignLeads(leadIds: string[], assignTo: string) {
    const response = await fetch(`${API_BASE_URL}/leads/assign`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ leadIds, assignTo })
    });
    return this.handleResponse(response);
  }

  async addLeadNote(leadId: string, note: string) {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}/notes`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ note })
    });
    return this.handleResponse(response);
  }

  async getLeadStats() {
    const response = await fetch(`${API_BASE_URL}/leads/stats`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Project endpoints
  async getProjects(params?: { status?: string; priority?: string }) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/projects${queryString}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createProject(projectData: any) {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(projectData)
    });
    return this.handleResponse(response);
  }

  async updateProject(projectId: string, projectData: any) {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(projectData)
    });
    return this.handleResponse(response);
  }

  async addProjectUpdate(projectId: string, updateData: any) {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/updates`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return this.handleResponse(response);
  }

  async addProjectTask(projectId: string, taskData: any) {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData)
    });
    return this.handleResponse(response);
  }

  async updateTask(projectId: string, taskId: string, taskData: any) {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData)
    });
    return this.handleResponse(response);
  }

  async getProjectStats() {
    const response = await fetch(`${API_BASE_URL}/projects/stats`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // User endpoints
  async getUsers(params?: { status?: string; role?: string; department?: string }) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/users${queryString}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getPendingUsers() {
    const response = await fetch(`${API_BASE_URL}/users/pending`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async approveUser(userId: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/approve`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async rejectUser(userId: string, reason?: string) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/reject`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    return this.handleResponse(response);
  }

  async updateUser(userId: string, userData: any) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async getUserStats() {
    const response = await fetch(`${API_BASE_URL}/users/stats`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Dashboard endpoints
  async getDashboardData() {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Notification endpoints
  async getNotifications(params?: { read?: boolean; type?: string; limit?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/notifications${queryString}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async markNotificationAsRead(notificationId: string) {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async markAllNotificationsAsRead() {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getNotificationCount() {
    const response = await fetch(`${API_BASE_URL}/notifications/count`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createNotification(notificationData: any) {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(notificationData)
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();