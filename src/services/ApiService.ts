const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers);
      }
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(email: string, password: string, name: string) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<{ message: string; token: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // User endpoints
  async getUserProfile(userId: string) {
    return this.request<{ user: any }>(`/users/${userId}`);
  }

  async getMyProfile() {
    return this.request<{ user: any }>('/users/me/profile');
  }

  async updateMyProfile(data: any) {
    return this.request<{ message: string }>('/users/me/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async addSkill(data: { name: string; category?: string; proficiencyLevel?: number }) {
    return this.request<{ message: string; skillId: string }>('/users/me/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSkill(skillId: string, data: any) {
    return this.request<{ message: string }>(`/users/me/skills/${skillId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSkill(skillId: string) {
    return this.request<{ message: string }>(`/users/me/skills/${skillId}`, {
      method: 'DELETE',
    });
  }

  async addExperience(data: any) {
    return this.request<{ message: string; experienceId: string }>('/users/me/experience', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateExperience(experienceId: string, data: any) {
    return this.request<{ message: string }>(`/users/me/experience/${experienceId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteExperience(experienceId: string) {
    return this.request<{ message: string }>(`/users/me/experience/${experienceId}`, {
      method: 'DELETE',
    });
  }

  // Portfolio endpoints
  async getPortfolios(params?: { q?: string; category?: string; page?: number; limit?: number; sort?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.append('q', params.q);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sort) searchParams.append('sort', params.sort);

    const queryString = searchParams.toString();
    return this.request<{ portfolios: any[]; pagination: any }>(`/portfolios${queryString ? `?${queryString}` : ''}`);
  }

  async getPortfolioBySlug(slug: string) {
    return this.request<{ portfolio: any }>(`/portfolios/slug/${slug}`);
  }

  async getMyPortfolios() {
    return this.request<{ portfolios: any[] }>('/portfolios/my');
  }

  async getPortfolio(id: string) {
    return this.request<{ portfolio: any }>(`/portfolios/${id}`);
  }

  async createPortfolio(data: any) {
    return this.request<{ message: string; portfolioId: string; slug: string }>('/portfolios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePortfolio(id: string, data: any) {
    return this.request<{ message: string; slug: string }>(`/portfolios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePortfolio(id: string) {
    return this.request<{ message: string }>(`/portfolios/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategories() {
    return this.request<{ categories: any[] }>('/portfolios/meta/categories');
  }

  // Project endpoints
  async getProjects(portfolioId: string) {
    return this.request<{ projects: any[] }>(`/projects/portfolio/${portfolioId}`);
  }

  async getProject(id: string) {
    return this.request<{ project: any }>(`/projects/${id}`);
  }

  async createProject(portfolioId: string, data: any) {
    return this.request<{ message: string; projectId: string }>(`/projects/portfolio/${portfolioId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: any) {
    return this.request<{ message: string }>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string) {
    return this.request<{ message: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderProjects(portfolioId: string, projectIds: string[]) {
    return this.request<{ message: string }>(`/projects/portfolio/${portfolioId}/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ projectIds }),
    });
  }

  // Upload endpoints
  async uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload/profile-picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async uploadPortfolioCover(portfolioId: string, file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload/portfolio-cover/${portfolioId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async uploadProjectImage(projectId: string, file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload/project-image/${projectId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request<{ stats: any }>('/admin/stats');
  }

  async getAdminUsers(params?: { page?: number; limit?: number; search?: string; role?: string; status?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.role) searchParams.append('role', params.role);
    if (params?.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    return this.request<{ users: any[]; pagination: any }>(`/admin/users${queryString ? `?${queryString}` : ''}`);
  }

  async getAdminUser(userId: string) {
    return this.request<{ user: any }>(`/admin/users/${userId}`);
  }

  async updateAdminUser(userId: string, data: { role?: string; isActive?: boolean }) {
    return this.request<{ message: string }>(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getAdminPortfolios(params?: { page?: number; limit?: number; search?: string; status?: string; featured?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.featured) searchParams.append('featured', params.featured);

    const queryString = searchParams.toString();
    return this.request<{ portfolios: any[]; pagination: any }>(`/admin/portfolios${queryString ? `?${queryString}` : ''}`);
  }

  async updateAdminPortfolio(portfolioId: string, data: { isFeatured?: boolean; isPublished?: boolean }) {
    return this.request<{ message: string }>(`/admin/portfolios/${portfolioId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAdminPortfolio(portfolioId: string) {
    return this.request<{ message: string }>(`/admin/portfolios/${portfolioId}`, {
      method: 'DELETE',
    });
  }

  async getAdminAuditLogs(params?: { page?: number; limit?: number; userId?: string; action?: string; resourceType?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.userId) searchParams.append('userId', params.userId);
    if (params?.action) searchParams.append('action', params.action);
    if (params?.resourceType) searchParams.append('resourceType', params.resourceType);

    const queryString = searchParams.toString();
    return this.request<{ logs: any[]; pagination: any }>(`/admin/audit-logs${queryString ? `?${queryString}` : ''}`);
  }

  async getAdminCategories() {
    return this.request<{ categories: any[] }>('/admin/categories');
  }
}

export const apiService = new ApiService();
