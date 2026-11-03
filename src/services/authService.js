const API_BASE_URL = import.meta.env?.VITE_API_URL || 'https://dairy-management-backend-b2c8.onrender.com/api/v1';

const TOKEN_KEY = 'amritdhara_auth_token';
const USER_KEY = 'amritdhara_user';

export const authService = {
  getApiBaseUrl() {
    return API_BASE_URL;
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
  },

  setToken(token, rememberMe = true) {
    if (!token) return;
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token);
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async login(identifier, password, rememberMe = true) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
          rememberMe: Boolean(rememberMe)
        })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        let errorMsg = data?.error?.message || data?.message;
        if (!errorMsg && data?.error?.details && Array.isArray(data.error.details)) {
          errorMsg = data.error.details.map(d => d.message).join(', ');
        }
        if (!errorMsg) {
          if (response.status === 401) {
            errorMsg = 'Invalid credentials or inactive account.';
          } else if (response.status === 400) {
            errorMsg = 'Please check your login details and try again.';
          } else {
            errorMsg = `Server error (${response.status}). Please try again later.`;
          }
        }
        return {
          success: false,
          status: response.status,
          error: errorMsg,
          raw: data
        };
      }

      const { token, user } = data.data || {};
      if (token) {
        this.setToken(token, rememberMe);
      }

      const mappedUser = this.mapBackendUser(user, token);
      return {
        success: true,
        message: data.message || 'Signed in successfully',
        token,
        user: mappedUser,
        raw: data
      };
    } catch (err) {
      return {
        success: false,
        isNetworkError: true,
        error: 'Unable to connect to the authentication server. Please check your internet connection.',
        originalError: err
      };
    }
  },

  async register(registrationData) {
    try {
      let accountType = 'dairy_farmer';
      if (registrationData.roleId === 'customer') accountType = 'customer';
      else if (registrationData.roleId === 'operator' || registrationData.roleId === 'dairy_staff') accountType = 'dairy_staff';
      else if (registrationData.roleId === 'super_admin' || registrationData.roleId === 'dairy_admin' || registrationData.roleId === 'admin') accountType = 'admin';

      const payload = {
        accountType: registrationData.accountType || accountType,
        fullName: registrationData.fullName,
        mobileNumber: (registrationData.phone || registrationData.mobileNumber || '').replace(/[^\d+]/g, ''),
        username: registrationData.userName || registrationData.username,
        email: registrationData.email || `${(registrationData.userName || 'user').toLowerCase()}@amritdhara.com`,
        villageOrCenter: registrationData.address || registrationData.villageOrCenter || 'Shirwal Center #04',
        password: registrationData.password,
        termsAgreed: registrationData.termsAgreed !== undefined ? Boolean(registrationData.termsAgreed) : true
      };

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        let errorMsg = data?.error?.message || data?.message;
        if (!errorMsg && data?.error?.details && Array.isArray(data.error.details)) {
          errorMsg = data.error.details.map(d => d.message).join(', ');
        }
        return {
          success: false,
          status: response.status,
          error: errorMsg || 'Registration failed. Please check the entered data.',
          raw: data
        };
      }

      const { token, user } = data.data || {};
      if (token) {
        this.setToken(token, true);
      }

      const mappedUser = this.mapBackendUser(user, token);
      return {
        success: true,
        message: data.message || 'Account registered successfully',
        token,
        user: mappedUser,
        raw: data
      };
    } catch (err) {
      return {
        success: false,
        isNetworkError: true,
        error: 'Unable to connect to registration service.',
        originalError: err
      };
    }
  },

  async getProfile() {
    const token = this.getToken();
    if (!token) return { success: false, error: 'No token found' };

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        return { success: false, error: data?.error?.message || 'Failed to fetch user profile' };
      }
      const mappedUser = this.mapBackendUser(data.data?.user || data.data, token);
      return { success: true, user: mappedUser };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async logout() {
    const token = this.getToken();
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(() => {});
      }
    } finally {
      this.clearToken();
    }
  },

  async getUsers(page = 1, limit = 50) {
    const token = this.getToken();
    try {
      const response = await fetch(`${API_BASE_URL}/users?page=${page}&limit=${limit}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        return { success: false, data: [] };
      }
      return { success: true, data: data.data || [] };
    } catch {
      return { success: false, data: [] };
    }
  },

  async createUser(userData) {
    const token = this.getToken();
    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(userData)
      });
      const data = await response.json().catch(() => null);
      return data || { success: false };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  mapBackendUser(backendUser, token) {
    if (!backendUser) return null;

    let roleId = 'farmer';
    let roleTitle = 'Registered Dairy Farmer';
    let badge = 'Farmer';

    switch (backendUser.accountType) {
      case 'dairy_farmer':
        roleId = 'farmer';
        badge = 'Farmer';
        roleTitle = `Registered Dairy Farmer (${backendUser.villageOrCenter || 'Shirwal'})`;
        break;
      case 'customer':
        roleId = 'customer';
        badge = 'Customer';
        roleTitle = `Residential Subscriber (${backendUser.villageOrCenter || 'Pune City'})`;
        break;
      case 'dairy_staff':
        roleId = 'operator';
        badge = 'Operator';
        roleTitle = `Collection Desk Operator (${backendUser.villageOrCenter || 'Shirwal Center #04'})`;
        break;
      case 'admin':
        roleId = 'super_admin';
        badge = 'Super Admin';
        roleTitle = 'Chief Managing Director';
        break;
      default:
        roleId = backendUser.roleId || backendUser.accountType || 'farmer';
        badge = backendUser.badge || 'User';
        roleTitle = backendUser.roleTitle || backendUser.fullName;
    }

    const initials = backendUser.fullName
      ? backendUser.fullName
          .split(' ')
          .map(n => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : (backendUser.username ? backendUser.username.slice(0, 2).toUpperCase() : 'UD');

    return {
      id: roleId,
      roleId: roleId,
      userId: backendUser.id,
      name: backendUser.fullName || backendUser.username,
      userName: backendUser.username,
      fullName: backendUser.fullName,
      email: backendUser.email || '',
      phone: backendUser.mobileNumber || backendUser.phone || '',
      branch: backendUser.villageOrCenter || 'Shirwal Center #04',
      roleTitle,
      badge,
      farmerId: roleId === 'farmer' ? (backendUser.farmerId || 'FRM-1024') : undefined,
      customerId: roleId === 'customer' ? (backendUser.customerId || 'CUST-801') : undefined,
      avatar: initials,
      token: token || this.getToken(),
      tokenType: 'Bearer',
      accountType: backendUser.accountType
    };
  }
};

